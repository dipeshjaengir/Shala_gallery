import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ieyxmxrp';
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || 'shala_gallery';

const isConfigured = Boolean(
  apiKey &&
  apiSecret &&
  !apiKey.includes('REPLACE_WITH_') &&
  !apiSecret.includes('REPLACE_WITH_')
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log(`[Cloudinary] Configured for cloud: ${cloudName}, folder: ${CLOUDINARY_FOLDER}`);
} else {
  console.warn(
    `[Cloudinary] Notice: Cloudinary credentials contain placeholders. Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env to enable production image uploads.`
  );
}

export const uploadArtworkStream = (buffer, originalName = 'artwork') => {
  return new Promise((resolve, reject) => {
    if (!isConfigured) {
      return reject(
        new Error(
          'Cloudinary is not configured with valid API credentials. Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ quality: 'auto:best' }, { fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error.message || error);
          return reject(new Error('Cloudinary upload failed: ' + (error.message || 'Unknown error')));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteArtworkAsset = async (publicId) => {
  if (!isConfigured || !publicId) return false;

  // Safety check: ensure the public_id belongs to the shala_gallery folder to prevent accidental deletion of other assets
  if (!publicId.startsWith(`${CLOUDINARY_FOLDER}/`)) {
    console.warn(`[Cloudinary Safety] Refusing to delete asset outside '${CLOUDINARY_FOLDER}' namespace: ${publicId}`);
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary] Asset deleted: ${publicId}`, result);
    return result.result === 'ok';
  } catch (error) {
    console.error(`[Cloudinary Delete Error] Failed to delete asset ${publicId}:`, error.message);
    return false;
  }
};

export const getCloudinaryStatus = () => ({
  configured: isConfigured,
  cloudName,
  folder: CLOUDINARY_FOLDER,
});

export default cloudinary;
