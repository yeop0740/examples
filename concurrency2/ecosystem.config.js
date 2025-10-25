module.exports = {
  apps: [
    {
      name: 'concurrency2-app',
      script: 'dist/src/main.js',
      instances: 4,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgres://postgres:1234@localhost:5453/postgres?schema=public&connection_limit=5', // 실제 DB URL로 변경
        JWT_SECRET: 'secret', // 실제 JWT SECRET으로 변경
      },
    },
  ],
};
