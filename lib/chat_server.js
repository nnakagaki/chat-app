createChat = function (server) {
  var io = require("socket.io")(server);
  var allUsers = [];
  var users = {"main":[],"room1":[],"room2":[],"room3":[],"room4":[]};
  var rooms = ["room1", "room2", "room3", "room4"];
  var allMessages = {"main":[],"room1":[],"room2":[],"room3":[],"room4":[]}
  var guestID = 1;

  io.on("connection", function (socket) {
    var error = "";

    socket.join("main");
    socket.room = "main";
    socket.name = "guest" + guestID;
    users[socket.room].push(socket.name);
    guestID += 1;

    io.emit("userConnect", {user: socket.name});

    // socket.on("disconnect", function () {
//       for (var i = 0; i < users[socket.room].length; i++) {
//         if (users[socket.room][i] === socket.name) {
//           users[socket.room].splice(i, 1);
//         }
//       }
//
//       io.emit("disconnection", {user: socket.name});
//     })

    socket.on("getRooms", function (req) {
      var roomMsgs = allMessages["main"]
      socket.emit("getRooms", {rooms: rooms, mainUsers: users["main"], userName: socket.name,
          last14Msgs: roomMsgs.slice(roomMsgs.length - 14, roomMsgs.length)})
    });

    socket.on("switchRoom", function (req) {
      socket.leave(socket.room);
      socket.join(req.room);
      socket.room = req.room;
      guestID += 1;
      var roomMsgs = allMessages[socket.room]
      socket.emit("switchRoom", {room: req.room,
          last14Msgs: roomMsgs.slice(roomMsgs.length - 14, roomMsgs.length)});
    })

    socket.on("nickChangeRequest", function (req) {
      if (req.newName.substring(0, 5).toLowerCase() === "guest") {
        error = "username cannot start with 'guest'";
        socket.emit("message", {error: error});
        error = "";
      } else {
        var flag = true

        for (var i = 0; i < allUsers.length; i++) {
          if (allUsers[i] === req.newName) {
            flag = false;
          }
        }

        if (flag) {
          allUsers.push(req.newName);
          socket.name = req.newName;
        } else {
          error = "that username already exists";
          socket.emit("message", {error: error});
          error = "";
        }
      }
    });
    socket.on("message", function (msg) {
      var msgText = msg.text;
      allMessages[socket.room].push(socket.name+" says: "+msgText);
      io.to(socket.room).emit("message", {text: msgText, user: socket.name, error: error});
    });
  });
};