Chat = function (socket) {
  this.socket = socket;
}

Chat.prototype.processCommand = function (text) {
//   var re = /(\w{0,})/;
//   var match = text.match(re)[0];
//   this.socket.emit(match + "Request", {command: text});

  if (text.substring(0,6) === "/nick ") {
    this.socket.emit("nickChangeRequest", {newName: text.substring(6,text.length)});
  } else if (text.substring(0,6) === "/join ") {
    this.socket.emit("switchRoom", {room: text.substring(6,text.length)});
  } else {
    this.socket.emit("message", {text: text});
  }
};