require('./chat_server');

var http = require("http"), static = require("node-static");

var file = new static.Server("./public");

var server = http.createServer(function (req, res) {
  req.addListener("end", function () {
    file.serve(req, res);
  }).resume();
});

createChat(server);

server.listen(8000);