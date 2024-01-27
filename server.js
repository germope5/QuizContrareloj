const liveServer = require('live-server');

const params = {
  port: 3000, // Puedes cambiar el puerto si es necesario
  file: "index.html",
  wait: 1000,
  logLevel: 2,
};

liveServer.start(params);
