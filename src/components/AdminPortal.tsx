import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Shield,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Calendar,
  ArrowLeft,
  X,
  Loader2,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { apiFetch, setStoredAdminToken } from '../utils/api';

interface AdminPortalProps {
  onNavigate: (tab: string) => void;
}

interface MongoArtwork {
  _id: string;
  id?: string;
  title: string;
  category: string;
  medium?: string;
  dimensions?: string;
  price?: string | null;
  framing?: string;
  status: string;
  year?: string;
  description?: string;
  aspectRatio: string;
  featured: boolean;
  imageSrc: string;
  cloudinaryPublicId?: string | null;
  commissionSubtype?: string | null;
  createdAt?: string;
}

interface CustomerInquiry {
  _id: string;
  fullName: string;
  email: string;
  inquiryType: string;
  artworkTitle?: string;
  dimensions?: string;
  budgetRange?: string;
  message: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
  createdAt: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigate }) => {
  // Authentication & State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Active view: 'login' | 'setup' | 'reset' | 'dashboard'
  const [viewMode, setViewMode] = useState<'login' | 'setup' | 'reset' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState<'artworks' | 'inquiries'>('artworks');

  // Form states - completely empty by default for fresh unauthenticated sessions
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [setupToken, setSetupToken] = useState<string>('');
  const [setupPassword, setSetupPassword] = useState<string>('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState<string>('');
  const [resetToken, setResetToken] = useState<string>('');
  const [resetPassword, setResetPassword] = useState<string>('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState<string>('');

  // Change Password state (for authenticated admin panel)
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState<string>('');
  const [changePasswordStatus, setChangePasswordStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);

  // Status and notices
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Dashboard Data
  const [artworks, setArtworks] = useState<MongoArtwork[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');

  // Modal scroll ref
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Artwork Editor Modal
  const [isEditingArtwork, setIsEditingArtwork] = useState<boolean>(false);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);
  const [artworkForm, setArtworkForm] = useState({
    title: '',
    category: 'Landscape & Realism',
    medium: 'Oil on archival canvas',
    dimensions: '',
    price: '',
    framing: 'Unframed',
    status: 'available',
    year: new Date().getFullYear().toString(),
    description: '',
    aspectRatio: 'portrait',
    featured: false,
    imageSrc: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Initial load: parse URL parameters and check auth status
  useEffect(() => {
    const init = async () => {
      setIsCheckingAuth(true);
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const actionParam = params.get('action');
      const emailParam = params.get('email');

      if (emailParam) {
        setAdminEmail(emailParam);
      }

      let currentConfigured = true;

      try {
        // Check setup status
        const setupRes = await apiFetch('/api/auth/setup-status').catch(() => null);
        if (setupRes && setupRes.ok) {
          const setupJson = await setupRes.json();
          setIsConfigured(setupJson.isConfigured);
          currentConfigured = setupJson.isConfigured;
          if (setupJson.adminEmail && !adminEmail) {
            setAdminEmail(setupJson.adminEmail);
          }
        }

        // If a token was provided, verify it to retrieve the specific target administrator account
        if (tokenParam) {
          const verifyRes = await apiFetch(
            `/api/auth/verify-reset-token?token=${encodeURIComponent(tokenParam)}`
          ).catch(() => null);
          if (verifyRes && verifyRes.ok) {
            const verifyJson = await verifyRes.json();
            if (verifyJson.valid && verifyJson.email) {
              setAdminEmail(verifyJson.email);
            }
          }
        }

        // Check current session
        const meRes = await apiFetch('/api/auth/me').catch(() => null);
        if (meRes && meRes.ok) {
          const meJson = await meRes.json();
          if (meJson.authenticated) {
            if (meJson.email) setAdminEmail(meJson.email);
            setIsAuthenticated(true);
            setViewMode('dashboard');
            return;
          }
        }
      } catch (e) {
        console.error('[AdminPortal] Auth check error:', e);
      } finally {
        setIsCheckingAuth(false);
      }

      // Route view mode according to URL params and configuration state
      if (actionParam === 'reset') {
        if (tokenParam) setResetToken(tokenParam);
        setViewMode('reset');
      } else if (actionParam === 'setup') {
        if (tokenParam) setSetupToken(tokenParam);
        setViewMode('setup');
      } else if (tokenParam) {
        // If token parameter is provided without explicit action:
        // Account already configured -> password reset
        // Account not configured -> initial setup
        if (currentConfigured) {
          setResetToken(tokenParam);
          setViewMode('reset');
        } else {
          setSetupToken(tokenParam);
          setViewMode('setup');
        }
      } else if (!currentConfigured) {
        setViewMode('setup');
      }
    };

    init();
  }, []);

  // Prevent background scrolling and reset modal scroll when artwork editor is active
  useEffect(() => {
    if (isEditingArtwork) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEditingArtwork]);

  // When authenticated, load dashboard datasets
  useEffect(() => {
    if (isAuthenticated && viewMode === 'dashboard') {
      fetchArtworks();
      fetchInquiries();
    }
  }, [isAuthenticated, viewMode]);

  const fetchArtworks = async () => {
    try {
      const res = await apiFetch('/api/artworks');
      if (res.ok) {
        const json = await res.json();
        setArtworks(json.data || []);
      }
    } catch (e) {
      console.warn('Failed to fetch artworks', e);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await apiFetch('/api/inquiries');
      if (res.ok) {
        const json = await res.json();
        setInquiries(json.data || []);
      }
    } catch (e) {
      console.warn('Failed to fetch inquiries', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'ok') {
        if (data.token) {
          setStoredAdminToken(data.token);
        }
        if (data.email) {
          setAdminEmail(data.email);
        }
        setIsAuthenticated(true);
        setViewMode('dashboard');
        setStatusMessage(null);
      } else {
        if (data?.requiresSetup) {
          setViewMode('setup');
          setStatusMessage({
            type: 'info',
            text: 'Administrator account requires initial password configuration.',
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: data?.message || 'Login failed. Please check your credentials.',
          });
        }
      }
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'Unable to reach backend server. Please verify the backend is active.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (setupPassword !== setupConfirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (setupPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await apiFetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken: setupToken.trim(), password: setupPassword }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'ok') {
        if (data.token) {
          setStoredAdminToken(data.token);
        }
        if (data.email) {
          setAdminEmail(data.email);
        }
        setIsAuthenticated(true);
        setIsConfigured(true);
        setViewMode('dashboard');
        setStatusMessage({
          type: 'success',
          text: 'Administrator account configured successfully. You are now logged in.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data?.message || 'Setup failed. Please check your setup token.',
        });
      }
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'Unable to reach backend server. Please check your connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (resetPassword !== resetConfirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (resetPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }
    if (!resetToken.trim()) {
      setStatusMessage({ type: 'error', text: 'Password reset token is required.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken.trim(), newPassword: resetPassword }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'ok') {
        if (data.token) {
          setStoredAdminToken(data.token);
        }
        if (data.email) {
          setAdminEmail(data.email);
        }
        setIsAuthenticated(true);
        setIsConfigured(true);
        setViewMode('dashboard');
        setStatusMessage({
          type: 'success',
          text: 'Password has been reset successfully. You are now logged in.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data?.message || 'Password reset failed. The token may be invalid or expired.',
        });
      }
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'Unable to reach backend server. Please check your connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout network notice', e);
    }
    setStoredAdminToken(null);
    setLoginEmail('');
    setLoginPassword('');
    setIsAuthenticated(false);
    setViewMode('login');
    setStatusMessage(null);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput !== confirmNewPasswordInput) {
      setChangePasswordStatus({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPasswordInput.length < 8) {
      setChangePasswordStatus({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (currentPasswordInput === newPasswordInput) {
      setChangePasswordStatus({ type: 'error', text: 'New password must be different from current password.' });
      return;
    }

    setIsSubmittingPassword(true);
    setChangePasswordStatus(null);

    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput,
          confirmPassword: confirmNewPasswordInput,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'ok') {
        if (data.token) {
          setStoredAdminToken(data.token);
        }
        setChangePasswordStatus({
          type: 'success',
          text: data?.message || 'Password changed successfully.',
        });
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmNewPasswordInput('');
        setTimeout(() => {
          setIsChangingPassword(false);
          setChangePasswordStatus(null);
        }, 1800);
      } else {
        setChangePasswordStatus({
          type: 'error',
          text: data?.message || 'Failed to update password. Please check your current password.',
        });
      }
    } catch (err) {
      setChangePasswordStatus({
        type: 'error',
        text: 'Unable to reach backend server. Please check your connection.',
      });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleOpenNewArtwork = () => {
    setEditingArtworkId(null);
    setArtworkForm({
      title: '',
      category: 'Landscape & Realism',
      medium: 'Oil on archival canvas',
      dimensions: '70 × 50 cm',
      price: '€1,200',
      framing: 'Unframed',
      status: 'available',
      year: new Date().getFullYear().toString(),
      description: '',
      aspectRatio: 'portrait',
      featured: false,
      imageSrc: '',
    });
    setSelectedFile(null);
    setUploadPreview(null);
    setIsEditingArtwork(true);
    setTimeout(() => {
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
    }, 0);
  };

  const handleEditArtwork = (art: MongoArtwork) => {
    setEditingArtworkId(art._id || art.id || null);
    setArtworkForm({
      title: art.title || '',
      category: art.category || 'Landscape & Realism',
      medium: art.medium || '',
      dimensions: art.dimensions || '',
      price: art.price || '',
      framing: art.framing || 'Unframed',
      status: art.status || 'available',
      year: art.year || new Date().getFullYear().toString(),
      description: art.description || '',
      aspectRatio: art.aspectRatio || 'portrait',
      featured: art.featured || false,
      imageSrc: art.imageSrc || '',
    });
    setSelectedFile(null);
    setUploadPreview(art.imageSrc || null);
    setIsEditingArtwork(true);
    setTimeout(() => {
      if (modalScrollRef.current) modalScrollRef.current.scrollTop = 0;
    }, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artworkForm.title.trim()) {
      alert('Please enter an artwork title.');
      return;
    }
    if (!selectedFile && !artworkForm.imageSrc.trim()) {
      alert('Please choose an image file for this artwork.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', artworkForm.title);
      formData.append('category', artworkForm.category);
      formData.append('medium', artworkForm.medium);
      formData.append('dimensions', artworkForm.dimensions);
      formData.append('price', artworkForm.price);
      formData.append('framing', artworkForm.framing);
      formData.append('status', artworkForm.status);
      formData.append('year', artworkForm.year);
      formData.append('description', artworkForm.description);
      formData.append('aspectRatio', artworkForm.aspectRatio);
      formData.append('featured', String(artworkForm.featured));

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (artworkForm.imageSrc) {
        formData.append('imageSrc', artworkForm.imageSrc);
      }

      const url = editingArtworkId ? `/api/artworks/${editingArtworkId}` : '/api/artworks';
      const method = editingArtworkId ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'ok') {
        setIsEditingArtwork(false);
        fetchArtworks();
        window.dispatchEvent(new CustomEvent('shalagallery-artworks-updated'));
      } else {
        alert(data?.message || 'Failed to save artwork record.');
      }
    } catch (e) {
      alert('Error saving artwork. Check server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArtwork = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will remove the artwork from your collection.`)) {
      return;
    }

    try {
      const res = await apiFetch(`/api/artworks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchArtworks();
        window.dispatchEvent(new CustomEvent('shalagallery-artworks-updated'));
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || 'Failed to delete artwork.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq._id === id ? { ...inq, status: newStatus as any } : inq))
        );
      }
    } catch (e) {
      console.warn('Failed to update inquiry status', e);
    }
  };

  const handleDeleteInquiry = async (id: string, clientName: string) => {
    if (!window.confirm(`Delete inquiry submission from "${clientName}"?`)) return;

    try {
      const res = await apiFetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      }
    } catch (e) {
      console.warn('Failed to delete inquiry', e);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryFilter === 'all') return true;
    return inq.status === inquiryFilter;
  });

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;

  if (isCheckingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-theme-accent mb-4" size={28} />
        <p className="text-xs tracking-[0.2em] uppercase text-theme-text-muted">
          Loading Curatorial Portal...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: PASSWORD RESET
  // -------------------------------------------------------------
  if (viewMode === 'reset') {
    return (
      <div className="max-w-md mx-auto my-16 px-6 font-sans">
        <div className="bg-theme-bg-card border border-theme-border p-8 shadow-premium relative text-left">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-theme-bg-surface border border-theme-border rounded-full">
              <KeyRound size={18} className="text-theme-accent" />
            </div>
            <div>
              <span className="block text-[8px] tracking-[0.25em] text-theme-accent uppercase font-semibold">
                SECURITY CREDENTIALS
              </span>
              <h2 className="font-serif text-lg text-theme-text">Reset Admin Password</h2>
            </div>
          </div>

          <p className="text-xs text-theme-text-muted leading-relaxed mb-6 font-sans">
            Set a new master administrator password for <strong className="text-theme-text">{adminEmail}</strong>. A valid single-use reset token generated by the server CLI is required.
          </p>

          {statusMessage && (
            <div
              className={`p-3 text-xs flex items-start gap-2 mb-6 border ${
                statusMessage.type === 'error'
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-theme-accent/40 bg-theme-bg-surface text-theme-text'
              }`}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="flex flex-col gap-5 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Admin Email
              </label>
              <input
                type="email"
                disabled
                value={adminEmail}
                className="py-2.5 bg-transparent border-b border-theme-border-medium text-theme-text opacity-70 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Reset Token <span className="text-theme-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token from CLI script"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text font-mono text-[11px]"
              />
              <span className="text-[9px] text-theme-text-muted opacity-60">
                Generate in terminal via: <code className="text-theme-accent">node server/scripts/init-admin.js --reset</code>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                New Password (Min 8 characters) <span className="text-theme-accent">*</span>
              </label>
              <input
                type="password"
                required
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="••••••••••••"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Confirm New Password <span className="text-theme-accent">*</span>
              </label>
              <input
                type="password"
                required
                value={resetConfirmPassword}
                onChange={(e) => setResetConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-theme-text text-theme-bg py-3 px-6 font-sans text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-theme-accent hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'Reset Password & Proceed'}
            </button>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-theme-border text-[9px] tracking-wider uppercase text-theme-text-muted">
              <button
                type="button"
                onClick={() => {
                  setStatusMessage(null);
                  setViewMode('login');
                }}
                className="hover:text-theme-accent transition-colors"
              >
                &larr; Return to Login
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-theme-accent transition-colors"
              >
                Public Gallery &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: INITIAL SETUP
  // -------------------------------------------------------------
  if (viewMode === 'setup') {
    return (
      <div className="max-w-md mx-auto my-16 px-6 font-sans">
        <div className="bg-theme-bg-card border border-theme-border p-8 shadow-premium relative text-left">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-theme-bg-surface border border-theme-border rounded-full">
              <Shield size={18} className="text-theme-accent" />
            </div>
            <div>
              <span className="block text-[8px] tracking-[0.25em] text-theme-accent uppercase font-semibold">
                SECURITY SETUP
              </span>
              <h2 className="font-serif text-lg text-theme-text">Initial Admin Setup</h2>
            </div>
          </div>

          <p className="text-xs text-theme-text-muted leading-relaxed mb-6 font-sans">
            Set up the master administrator password for <strong className="text-theme-text">{adminEmail}</strong>. A valid single-use setup token generated by the server CLI is required.
          </p>

          {statusMessage && (
            <div
              className={`p-3 text-xs flex items-start gap-2 mb-6 border ${
                statusMessage.type === 'error'
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-theme-accent/40 bg-theme-bg-surface text-theme-text'
              }`}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSetup} className="flex flex-col gap-5 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Admin Email
              </label>
              <input
                type="email"
                disabled
                value={adminEmail}
                className="py-2.5 bg-transparent border-b border-theme-border-medium text-theme-text opacity-70 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Setup Token <span className="text-theme-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
                placeholder="Paste token from CLI script"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text font-mono text-[11px]"
              />
              <span className="text-[9px] text-theme-text-muted opacity-60">
                Generate in terminal via: <code className="text-theme-accent">node server/scripts/init-admin.js</code>
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                New Password (Min 8 characters) <span className="text-theme-accent">*</span>
              </label>
              <input
                type="password"
                required
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                placeholder="••••••••••••"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Confirm Password <span className="text-theme-accent">*</span>
              </label>
              <input
                type="password"
                required
                value={setupConfirmPassword}
                onChange={(e) => setSetupConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-theme-text text-theme-bg py-3 px-6 font-sans text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-theme-accent hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'Complete Setup & Log In'}
            </button>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-theme-border text-[9px] tracking-wider uppercase text-theme-text-muted">
              <button
                type="button"
                onClick={() => setViewMode('login')}
                className="hover:text-theme-accent transition-colors"
              >
                &larr; Return to Login
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-theme-accent transition-colors"
              >
                Public Gallery &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOGIN FORM
  // -------------------------------------------------------------
  if (!isAuthenticated || viewMode === 'login') {
    return (
      <div className="max-w-md mx-auto my-16 px-6 font-sans">
        <div className="bg-theme-bg-card border border-theme-border p-8 md:p-10 shadow-premium relative text-left">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-theme-bg-surface border border-theme-border rounded-full">
              <Lock size={18} className="text-theme-accent" />
            </div>
            <div>
              <span className="block text-[8px] tracking-[0.25em] text-theme-accent uppercase font-semibold">
                CURATORIAL PORTAL
              </span>
              <h2 className="font-serif text-lg text-theme-text">Administrator Login</h2>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 text-xs flex items-start gap-2 mb-6 border ${
                statusMessage.type === 'error'
                  ? 'border-red-500/30 bg-red-500/10 text-red-400'
                  : 'border-theme-accent/40 bg-theme-bg-surface text-theme-text'
              }`}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off" className="flex flex-col gap-6 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Admin Email
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-theme-text text-theme-bg py-3 px-6 font-sans text-[10px] tracking-[0.3em] uppercase font-semibold hover:bg-theme-accent hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'Authenticate & Enter'}
            </button>

            <div className="flex justify-between items-center mt-2 pt-4 border-t border-theme-border text-[9px] tracking-wider uppercase text-theme-text-muted">
              {!isConfigured ? (
                <button
                  type="button"
                  onClick={() => setViewMode('setup')}
                  className="text-theme-accent hover:underline"
                >
                  Configure Initial Account &rarr;
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-theme-accent transition-colors cursor-pointer"
              >
                &larr; Public Gallery
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED CURATORIAL DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 font-sans text-left">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-theme-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-theme-text">Gallery Administration</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setCurrentPasswordInput('');
              setNewPasswordInput('');
              setConfirmNewPasswordInput('');
              setChangePasswordStatus(null);
              setIsChangingPassword(true);
            }}
            className="px-3.5 py-2 bg-theme-bg-card border border-theme-border text-[9px] tracking-[0.2em] uppercase text-theme-text-muted hover:text-theme-text hover:border-theme-text transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound size={12} /> Change Password
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-2 border border-theme-border text-[9px] tracking-[0.2em] uppercase text-theme-text-muted hover:text-theme-text hover:border-theme-text transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={12} /> Public Site
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-theme-bg-card border border-theme-border text-[9px] tracking-[0.2em] uppercase text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      {/* Dashboard Sub-navigation */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-6 my-8 border-b border-theme-border pb-3">
        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-4 py-2.5 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'artworks'
              ? 'border-theme-accent text-theme-text'
              : 'border-transparent text-theme-text-muted hover:text-theme-text'
          }`}
        >
          <ImageIcon size={14} /> Artwork Collection ({artworks.length})
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold transition-all border-b-2 flex items-center gap-2 relative cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-theme-accent text-theme-text'
              : 'border-transparent text-theme-text-muted hover:text-theme-text'
          }`}
        >
          <MessageSquare size={14} /> Customer Inquiries ({inquiries.length})
          {unreadInquiriesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-theme-accent text-white text-[8px] flex items-center justify-center font-bold">
              {unreadInquiriesCount}
            </span>
          )}
        </button>
      </div>

      {/* --------------------------------------------------------- */}
      {/* TAB 1: ARTWORKS MANAGEMENT */}
      {/* --------------------------------------------------------- */}
      {activeTab === 'artworks' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-serif text-lg text-theme-text">Artwork Collection</h2>
              <p className="text-xs text-theme-text-muted">
                Manage your paintings and artwork displayed on your website.
              </p>
            </div>
            <button
              onClick={handleOpenNewArtwork}
              className="bg-theme-text text-theme-bg px-4 py-2.5 text-[9px] tracking-[0.25em] uppercase font-semibold flex items-center gap-2 hover:bg-theme-accent hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={13} /> Add Artwork
            </button>
          </div>

          {artworks.length === 0 ? (
            <div className="p-12 border border-dashed border-theme-border text-center bg-theme-bg-card">
              <ImageIcon className="mx-auto text-theme-text-muted opacity-40 mb-3" size={32} />
              <p className="text-xs text-theme-text font-medium mb-1">No Artworks in Collection</p>
              <p className="text-[11px] text-theme-text-muted max-w-md mx-auto mb-4">
                Click the button below to add your first piece of artwork to the gallery.
              </p>
              <button
                onClick={handleOpenNewArtwork}
                className="bg-theme-bg-surface border border-theme-border px-4 py-2 text-[9px] tracking-[0.2em] uppercase text-theme-text hover:border-theme-accent cursor-pointer"
              >
                + Add Artwork
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((art) => (
                <div
                  key={art._id || art.id}
                  className="bg-theme-bg-card border border-theme-border p-4 flex flex-col justify-between shadow-sm relative group"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-theme-bg-surface overflow-hidden mb-3 border border-theme-border">
                      <img
                        src={art.imageSrc}
                        alt={art.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.opacity = '0.3';
                        }}
                      />
                      <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider px-2 py-0.5 bg-black/75 text-white backdrop-blur-sm">
                        {art.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-base text-theme-text">{art.title}</h3>
                    <p className="text-[10px] text-theme-accent tracking-wider uppercase mt-0.5">
                      {art.category}
                    </p>

                    <div className="mt-2 text-[10px] text-theme-text-muted flex justify-between">
                      <span>{art.dimensions || 'Custom scale'}</span>
                      <span className="font-medium text-theme-text">{art.price || 'P.O.R.'}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-theme-border flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => handleEditArtwork(art)}
                      className="p-1.5 hover:text-theme-accent transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteArtwork(art._id || art.id!, art.title)}
                      className="p-1.5 text-red-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* TAB 2: INQUIRIES MANAGEMENT */}
      {/* --------------------------------------------------------- */}
      {activeTab === 'inquiries' && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="font-serif text-lg text-theme-text">Customer Inquiries</h2>
              <p className="text-xs text-theme-text-muted">
                Review and respond to client inquiries received through the website.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 text-[9px] tracking-wider uppercase">
              {['all', 'unread', 'read', 'responded', 'archived'].map((f) => (
                <button
                  key={f}
                  onClick={() => setInquiryFilter(f)}
                  className={`px-2.5 py-1 rounded-sm border transition-colors ${
                    inquiryFilter === f
                      ? 'bg-theme-text text-theme-bg border-theme-text font-semibold'
                      : 'border-theme-border text-theme-text-muted hover:text-theme-text'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="p-12 border border-dashed border-theme-border text-center bg-theme-bg-card">
              <MessageSquare className="mx-auto text-theme-text-muted opacity-40 mb-3" size={32} />
              <p className="text-xs text-theme-text font-medium mb-1">No Inquiries Found</p>
              <p className="text-[11px] text-theme-text-muted max-w-md mx-auto">
                No submissions matching "{inquiryFilter}". As real collectors submit the website contact form, their inquiries will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`p-6 border transition-all bg-theme-bg-card ${
                    inq.status === 'unread' ? 'border-theme-accent/60 shadow-sm' : 'border-theme-border'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-3 border-b border-theme-border">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base text-theme-text font-medium">
                          {inq.fullName}
                        </h3>
                        <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-theme-bg-surface border border-theme-border text-theme-accent font-semibold">
                          {inq.inquiryType}
                        </span>
                        {inq.status === 'unread' && (
                          <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-theme-accent text-white font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-xs text-theme-text-muted hover:text-theme-accent transition-colors mt-0.5 inline-block"
                      >
                        {inq.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-theme-text-muted font-sans flex items-center gap-1">
                        <Calendar size={12} />{' '}
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                      </span>

                      {/* Status Dropdown */}
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                        className="text-[9px] uppercase tracking-wider bg-theme-bg border border-theme-border py-1 px-2 outline-none text-theme-text cursor-pointer"
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="responded">Responded</option>
                        <option value="archived">Archived</option>
                      </select>

                      <button
                        onClick={() => handleDeleteInquiry(inq._id, inq.fullName)}
                        className="p-1 text-red-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Submission details */}
                  <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-sans text-theme-text-muted">
                    {inq.artworkTitle && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wider block text-[8px]">
                          Target Artwork
                        </span>
                        <span className="text-theme-text font-medium">{inq.artworkTitle}</span>
                      </div>
                    )}
                    {inq.dimensions && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wider block text-[8px]">
                          Scale / Dimensions
                        </span>
                        <span className="text-theme-text font-medium">{inq.dimensions}</span>
                      </div>
                    )}
                    {inq.budgetRange && (
                      <div>
                        <span className="opacity-60 uppercase tracking-wider block text-[8px]">
                          Budget Range
                        </span>
                        <span className="text-theme-text font-medium">{inq.budgetRange}</span>
                      </div>
                    )}
                  </div>

                  {/* Message body */}
                  <div className="mt-4 p-4 bg-theme-bg-surface border border-theme-border text-xs leading-relaxed text-theme-text italic font-serif">
                    "{inq.message}"
                  </div>

                  {/* Direct Reply Link */}
                  <div className="mt-3 flex justify-end">
                    <a
                      href={`mailto:${inq.email}?subject=${encodeURIComponent(
                        `SHALAGALLERY: Regarding your inquiry (${inq.inquiryType})`
                      )}&body=${encodeURIComponent(`Dear ${inq.fullName},\n\nThank you for reaching out to SHALAGALLERY.\n\n`)}`}
                      onClick={() => handleUpdateInquiryStatus(inq._id, 'responded')}
                      className="text-[9px] tracking-[0.2em] uppercase font-semibold text-theme-accent hover:underline flex items-center gap-1"
                    >
                      <Mail size={12} /> Reply to {inq.fullName} &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT ARTWORK */}
      {/* --------------------------------------------------------- */}
      {isEditingArtwork && (
        <div
          className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsEditingArtwork(false)}
        >
          <div
            className="bg-theme-bg-card border border-theme-border w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed Top */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-theme-border shrink-0 bg-theme-bg-card">
              <div>
                <span className="block text-[8px] tracking-[0.25em] text-theme-accent uppercase font-semibold">
                  ARTWORK DETAILS
                </span>
                <h2 className="font-serif text-lg sm:text-xl text-theme-text">
                  {editingArtworkId ? 'Edit Artwork' : 'Add New Artwork'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingArtwork(false)}
                className="p-1.5 text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Scrollable Form Content */}
            <div
              ref={modalScrollRef}
              className="overflow-y-auto px-6 py-5 flex-1 text-xs text-left"
            >
              <form id="artwork-form" onSubmit={handleSaveArtwork} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={artworkForm.title}
                      onChange={(e) => setArtworkForm({ ...artworkForm, title: e.target.value })}
                      placeholder="e.g. Desert Horizon"
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Category *
                    </label>
                    <select
                      value={artworkForm.category}
                      onChange={(e) => setArtworkForm({ ...artworkForm, category: e.target.value })}
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text cursor-pointer"
                    >
                      <option value="Landscape & Realism">Landscape &amp; Realism</option>
                      <option value="Abstract Art">Abstract Art</option>
                      <option value="Arabic Calligraphy">Arabic Calligraphy</option>
                      <option value="Previous Commissions">Previous Commissions</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Medium
                    </label>
                    <input
                      type="text"
                      value={artworkForm.medium}
                      onChange={(e) => setArtworkForm({ ...artworkForm, medium: e.target.value })}
                      placeholder="e.g. Oil on Canvas"
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={artworkForm.dimensions}
                      onChange={(e) => setArtworkForm({ ...artworkForm, dimensions: e.target.value })}
                      placeholder="e.g. 70 × 50 cm"
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Price
                    </label>
                    <input
                      type="text"
                      value={artworkForm.price}
                      onChange={(e) => setArtworkForm({ ...artworkForm, price: e.target.value })}
                      placeholder="e.g. €1,200"
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Status
                    </label>
                    <select
                      value={artworkForm.status}
                      onChange={(e) => setArtworkForm({ ...artworkForm, status: e.target.value })}
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text cursor-pointer"
                    >
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="commissioned">Commissioned</option>
                      <option value="private_collection">Private Collection</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Framing
                    </label>
                    <select
                      value={artworkForm.framing}
                      onChange={(e) => setArtworkForm({ ...artworkForm, framing: e.target.value })}
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text cursor-pointer"
                    >
                      <option value="Unframed">Unframed</option>
                      <option value="Framed">Framed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                      Aspect Ratio
                    </label>
                    <select
                      value={artworkForm.aspectRatio}
                      onChange={(e) => setArtworkForm({ ...artworkForm, aspectRatio: e.target.value })}
                      className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text cursor-pointer"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                      <option value="square">Square</option>
                      <option value="tall">Tall</option>
                    </select>
                  </div>
                </div>

                {/* Artwork Image Upload / Preview Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                    Artwork Image *
                  </label>
                  <div className="p-5 border border-dashed border-theme-border bg-theme-bg-surface flex flex-col items-center justify-center gap-3">
                    {uploadPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-36 h-36 relative overflow-hidden border border-theme-border shadow-sm bg-theme-bg-card">
                          <img
                            src={uploadPreview}
                            alt="Artwork preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] text-theme-text-muted text-center max-w-xs truncate">
                          {selectedFile ? `Selected: ${selectedFile.name}` : 'Current artwork image'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-3">
                        <div className="p-3 bg-theme-bg-card border border-theme-border rounded-full">
                          <ImageIcon size={24} className="text-theme-accent opacity-60" />
                        </div>
                        <span className="text-[11px] text-theme-text-muted">
                          No image selected yet
                        </span>
                      </div>
                    )}

                    <label className="cursor-pointer bg-theme-bg-card border border-theme-border py-2 px-5 text-[9px] tracking-[0.2em] uppercase font-semibold hover:border-theme-accent hover:text-theme-accent transition-colors shadow-xs">
                      {uploadPreview ? 'Change Image' : 'Choose Image'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] tracking-wider uppercase text-theme-text-muted font-semibold">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={artworkForm.description}
                    onChange={(e) => setArtworkForm({ ...artworkForm, description: e.target.value })}
                    placeholder="Artwork narrative or details..."
                    className="py-2 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={artworkForm.featured}
                    onChange={(e) => setArtworkForm({ ...artworkForm, featured: e.target.checked })}
                    className="accent-theme-accent cursor-pointer"
                  />
                  <label htmlFor="featuredCheck" className="text-[10px] text-theme-text cursor-pointer select-none">
                    Feature prominently on Home / Highlights
                  </label>
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed Bottom */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-theme-border bg-theme-bg-surface/50 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditingArtwork(false)}
                className="px-4 py-2 border border-theme-border text-[9px] tracking-wider uppercase text-theme-text-muted hover:text-theme-text hover:border-theme-text transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="artwork-form"
                disabled={isLoading}
                className="bg-theme-text text-theme-bg px-6 py-2 text-[9px] tracking-[0.25em] uppercase font-semibold hover:bg-theme-accent hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              >
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* MODAL: CHANGE PASSWORD */}
      {/* --------------------------------------------------------- */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-theme-bg-card border border-theme-border p-6 sm:p-8 shadow-premium relative text-left max-w-md w-full">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-theme-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-theme-accent" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-theme-bg-surface border border-theme-border rounded-full">
                  <KeyRound size={18} className="text-theme-accent" />
                </div>
                <div>
                  <span className="block text-[8px] tracking-[0.25em] text-theme-accent uppercase font-semibold">
                    SECURITY CREDENTIALS
                  </span>
                  <h2 className="font-serif text-lg text-theme-text">Change Password</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setChangePasswordStatus(null);
                }}
                className="p-1.5 text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {adminEmail && (
              <p className="text-xs text-theme-text-muted leading-relaxed mb-5 font-sans">
                Update account password for <strong className="text-theme-text font-medium">{adminEmail}</strong>.
              </p>
            )}

            {changePasswordStatus && (
              <div
                className={`p-3 text-xs flex items-start gap-2 mb-5 border ${
                  changePasswordStatus.type === 'error'
                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {changePasswordStatus.type === 'error' ? (
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                )}
                <span>{changePasswordStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} autoComplete="off" className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                  Current Password <span className="text-theme-accent">*</span>
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                  New Password (Min 8 characters) <span className="text-theme-accent">*</span>
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] tracking-[0.2em] text-theme-text-muted uppercase font-semibold">
                  Confirm New Password <span className="text-theme-accent">*</span>
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmNewPasswordInput}
                  onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                  className="py-2.5 bg-transparent border-b border-theme-border-medium focus:border-theme-accent outline-none text-theme-text font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-theme-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setChangePasswordStatus(null);
                  }}
                  className="px-4 py-2 border border-theme-border text-[9px] tracking-wider uppercase text-theme-text-muted hover:text-theme-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="bg-theme-text text-theme-bg py-2.5 px-6 font-sans text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-theme-accent hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingPassword ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
