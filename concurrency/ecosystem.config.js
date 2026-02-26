"use strict";
module.exports = {
  apps: [
    {
      name: "concurrency",
      script: "./dist/index.js",
      instances: 4,
      exec_mode: "cluster",
    },
  ],
};
