var app = require("express")();
var mysql = require("mysql");
var http = require("http").Server(app);
var io = require("socket.io")(http);

var pool = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "kormi",
  password: "CS0amcTe9QlApey6",
  database: "sockettest",
  debug: false,
  timezone: 'utc-6'
});

app.get("/web", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});



app.get("/", function (req, res) {
 console.log('acceesssed');
});


io.on("connection", function (socket) {
  console.log("A user is connected");
  socket.on("status added", function (status) {
    console.log('add_status Called '+status);
    add_status(status, function (res) {
      if (res) {
        io.emit("refresh feed", status);
      } else {
        io.emit("error");
      }
    });
  });
});




var add_status = function (status, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(false);
      return;
    }
    connection.query(
      "INSERT INTO `fbstatus` (`s_text`) VALUES ('" + status + "')",
      function (err, rows) {
        //connection.release();
        if (!err) {
          callback(true);
        }
      }
    );
    connection.on("error", function (err) {
      callback(false);
      return;
    });
  });
};



http.listen(3000, function () {
  console.log("Listening on 3000");
});
