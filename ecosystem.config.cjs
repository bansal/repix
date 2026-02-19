module.exports = {
  apps: [
    {
      name: "repix",
      port: "3210",
      exec_mode: "cluster",
      instances: "max",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
