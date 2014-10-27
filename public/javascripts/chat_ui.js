var socket = io();

var user = new Chat(socket)

socket.emit("getRooms", {});

// socket.on("userConnect", function (event) {
//   $(".users ul").append("<li>"+event.user+"</li>");
// })
//
// socket.on("disconnection", function (event) {
//   $("li#"+event.user).remove();
// })

socket.on("getRooms", function (event) {
  for (var i = 0; i < event.rooms.length; i++) {
    $(".room-list ul").append("<li><button id="+event.rooms[i]+">"+event.rooms[i]+"</button></li>")
  }

  for (var i = 0; i < event.last14Msgs.length; i++) {
    $(".chat-box ul").append("<li>"+event.last14Msgs[i]+"</li>")
  }

//   for (var i = 0; i < event.mainUsers.length; i++) {
//     if (event.userName !== event.mainUsers[i]) {
//       $(".users ul").append("<li id="+event.mainUsers[i]+">"+event.mainUsers[i]+"</li>");
//     }
//   }

  $(".room-list ul li button").on("click", function (event) {
    var roomID = $(event.currentTarget).attr("id");
    socket.emit("switchRoom", {room: roomID});
  })
});

socket.on("switchRoom", function (event) {
  $(".chat-box ul").html("");
  for (var i = 0; i < event.last14Msgs.length; i++) {
    $(".chat-box ul").append("<li>"+event.last14Msgs[i]+"</li>");
  }
  $("h1").html(event.room);
})

socket.on("message", function (event) {
  if (event.error !== "") {
    alert(event.error);
  } else {
    $(".chat-box ul").append("<li>"+event.user+ " says: " +event.text+"</li>");
    $(".chat-box").scrollTop($(".chat-box ul").height())
  }

});

$("form button#submit").on("click", function (event) {
  event.preventDefault()
  var message = $("form textarea#message").val();
  user.processCommand(message)
  $("form textarea#message").val("");
  $("form textarea#message").focus();
});

$("form textarea#message").on("keypress", function (event) {
  if (event.charCode === 13) {
    event.preventDefault()
    var message = $("form textarea#message").val();
    user.processCommand(message)
    $("form textarea#message").val("");
    $("form textarea#message").focus();
  }
});

