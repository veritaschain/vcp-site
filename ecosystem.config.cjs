module.exports = {
  apps: [
    {
      name: 'vcp-preview',
      script: 'npx',
      args: 'http-server . -p 3000 -c-1 --cors',
      env: {
        NODE_ENV: 'development'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
