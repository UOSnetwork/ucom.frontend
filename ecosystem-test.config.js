const NODE_ENV = 'staging';
const HTTP_SERVER_PORT = 8080;
const BABEL_ENV = 'server';

module.exports = {
  apps: [
    {
      name: `${NODE_ENV}_frontend_renderer`,
      instance_var: 'INSTANCE_ID',
      script: 'server.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: ['server.js'],
      autorestart: true,
      env: {
        PORT: HTTP_SERVER_PORT,
        NODE_ENV,
        BABEL_ENV,
      },
    },
  ],
};
