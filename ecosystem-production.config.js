const NODE_ENV = 'production';
const HTTP_SERVER_PORT = 3030;
const BABEL_ENV = 'server';

module.exports = {
  apps: [
    {
      name: `${NODE_ENV}_frontend_renderer`,
      instance_var: 'INSTANCE_ID',
      script: './server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      autorestart: true,
      env: {
        PORT: HTTP_SERVER_PORT,
        NODE_ENV,
        BABEL_ENV,
      },
    },
  ],
};
