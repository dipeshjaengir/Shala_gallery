import { Router } from 'express';
import { getDBStatus } from '../config/db.js';
import { getCloudinaryStatus } from '../config/cloudinary.js';

const router = Router();

router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const cldStatus = getCloudinaryStatus();

  res.status(200).json({
    status: 'ok',
    service: 'SHALAGALLERY Backend API',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.connected,
      targetDatabase: dbStatus.targetDatabase,
    },
    storage: {
      provider: 'Cloudinary',
      configured: cldStatus.configured,
      targetFolder: cldStatus.folder,
      cloudName: cldStatus.cloudName,
    },
  });
});

export default router;
