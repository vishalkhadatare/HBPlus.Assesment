import app from './app.js';
import config from './config/environment.js';

const server = app.listen(config.PORT, () => {
  console.log('====================================================');
  console.log(`🚀 HBPlus Secure Access API running on port ${config.PORT}`);
  console.log(`🔒 Mode: ${config.NODE_ENV}`);
  console.log(`🏢 Enforced Email Domain: @${config.ALLOWED_EMAIL_DOMAIN}`);
  console.log(`🌐 Allowed Client Origins: ${config.CLIENT_ORIGINS.join(', ')}`);
  console.log('====================================================');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Closing HTTP server gracefully.');
  server.close(() => {
    console.log('[Server] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received. Shutting down.');
  server.close(() => {
    process.exit(0);
  });
});

export default server;
