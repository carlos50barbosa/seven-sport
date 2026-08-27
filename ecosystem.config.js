/**
 * PM2 — Seven Sport
 *
 * Deploy na VPS:
 *   npm ci && npm run build
 *   pm2 start ecosystem.config.js
 *   pm2 save && pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'seven-sport',
      cwd: '/var/www/seven-sport',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '400M',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Precisam estar definidas no BUILD também (elas vivem em .env).
        // Aqui ficam só para deixar o runtime coerente com o que foi compilado.
        NEXT_PUBLIC_BASE_PATH: '/seven-sport',
        NEXT_PUBLIC_SITE_URL: 'https://servicostech.com.br/seven-sport',
      },
      error_file: '/var/log/pm2/seven-sport-error.log',
      out_file: '/var/log/pm2/seven-sport-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
