module.exports = {
  apps: [{
    name: 'seevechain',
    script: './scripts/start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://postgres:seevechain@localhost/seevechain',
      PORT: 1337,
      TIME_DIFFERENCE: 0
    },
    env_production: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://postgres:seevechain@localhost/seevechain',
      PORT: 1337,
      TIME_DIFFERENCE: 0
    }
  }]
}
