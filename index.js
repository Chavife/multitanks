var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcryptjs');
const saltRounds = 10;


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
	database : 'tanks'
});

/*
var connection = mysql.createConnection({
  host     : 'eu-cdbr-west-01.cleardb.com',
  user     : 'bc33589cc8bcc6',
  password : 'b77b362f',
  database : 'heroku_84f758f9399c48b'
});
*/
connection.connect(function(err) {
  if(!!err){
		console.log("Unable to connect to database");
	}else{
		console.log("Connected to database");
	}
});



var app = express();
var port = 3000;

app.use(express.static(__dirname + '/public'));

var io = require ('socket.io').listen(app.listen (process.env.PORT || port,function () {
	console.log ('Listen on port ' + port);
}));



var LogedUsers = [];
var UsersToMatchmakeDeadMatch = [];
var DeadMatchRooms = [];


io.on ('connection', function (socket) {


   socket.on ('disconnect', function () {
		if(LogedUsers[socket.id] != null) delete LogedUsers[socket.id];
	});

   socket.on ('MatchmakeToDeadMatch' , function(){
      if(LogedUsers[socket.id] == undefined) return;
      UsersToMatchmakeDeadMatch.push({ID:LogedUsers[socket.id].ID , Socket:socket.id, UserName: LogedUsers[socket.id].UserName});
      if(UsersToMatchmakeDeadMatch.length >= 2){
         CreateDeadMatchRoom();
      }
   });

   function CreateDeadMatchRoom(){
      var Room = {
         Players: []
      };

      var l = UsersToMatchmakeDeadMatch.length;
      var players = {};

      Room.Name = UsersToMatchmakeDeadMatch[0].Socket ; //Name of the room is named after the first player
      for(var i = 0; i < l; i++){
      	 var p = UsersToMatchmakeDeadMatch.pop();
      	 if(LogedUsers[p.Socket] != undefined){
            	Room.Players.push(p);
            	players[""+LogedUsers[Room.Players[Room.Players.length-1].Socket].UserName] = {x: 200, y: 200};
            	LogedUsers[Room.Players[Room.Players.length-1].Socket].InGame = Room.Name;
         }
      }

      console.log(players);
      for(var i = 0; i < Room.Players.length; i++){
         io.to(Room.Players[i].Socket).emit("GameStart",players);
      }

      Room.Timer = setTimeout(function(){
         EndGame(Room.Name);
      },60000);

      DeadMatchRooms[Room.Name] = Room;
   }

   function EndGame(roomname){

      var roomToEnd = DeadMatchRooms[roomname];
      for (var i = 0; i < roomToEnd.Players.length; i++){
         if(LogedUsers[roomToEnd.Players[i].Socket] != undefined){
            LogedUsers[roomToEnd.Players[i].Socket].InGame = -1;
         }
         io.to(roomToEnd.Players[i].Socket).emit("GameEnd");
      }
      delete DeadMatchRooms[roomname];
   }

   socket.on ('get_user_information', function () {
      if(LogedUsers[socket.id] != undefined){
         GiveTank(LogedUsers[socket.id].ID, false);
         GiveUserInfo(LogedUsers[socket.id].ID);
      }
	});

   socket.on ('get_tank', function () {
      if(LogedUsers[socket.id] != undefined){
            GiveTank(LogedUsers[socket.id].ID, true);
      }
	});

   socket.on ('ChangingTankAngle', function (angle) {
	   if(LogedUsers[socket.id] == undefined) return;
      //GiveUserInfo(LogedUsers[socket.id].ID);
      var room = DeadMatchRooms[LogedUsers[socket.id].InGame];
      if(room != undefined){
         for(var i = 0; i < room.Players.length ; i++){
            if(room.Players[i].Socket != socket.id){
                  io.to(room.Players[i].Socket).emit("SendingTankAngle", LogedUsers[socket.id].UserName, angle);
            }
         }
      }
	});

   socket.on ('ChangingTurretAngle', function (angle) {
		if(LogedUsers[socket.id] == undefined) return;
      var room = DeadMatchRooms[LogedUsers[socket.id].InGame];
      if(room != undefined){
         for(var i = 0; i < room.Players.length ; i++){
            if(room.Players[i].Socket != socket.id){
                  io.to(room.Players[i].Socket).emit("SendingTurretAngle", LogedUsers[socket.id].UserName, angle);
            }
         }
      }
	});

   socket.on ('ChangingPosition', function (x,y) {
	   if(LogedUsers[socket.id] == undefined) return;
      //GiveUserInfo(LogedUsers[socket.id].ID);
      var room = DeadMatchRooms[LogedUsers[socket.id].InGame];
      if(room != undefined){
         for(var i = 0; i < room.Players.length ; i++){
            if(room.Players[i].Socket != socket.id){
                  io.to(room.Players[i].Socket).emit("SendingTankPosition", LogedUsers[socket.id].UserName, x,y);
            }
         }
      }
	});

   socket.on ('upgrade', function (name) {
      if(LogedUsers[socket.id] == undefined) return;

      var goingToUpgrade;
      switch (name) {
         case "Damage":
            goingToUpgrade = "damage";
            break;
         case "Health":
            goingToUpgrade = "health";
            break;
         case "Shield":
            goingToUpgrade = "shield";
            break;
         case "Tank rotation":
            goingToUpgrade = "tank_rotation_speed";
            break;
         case "Turret rotation":
            goingToUpgrade = "barrel_rotation_speed";
            break;
         case "Tank speed":
            goingToUpgrade = "tank_speed";
            break;
         case "Reload time":
            goingToUpgrade = "shoot_speed";
            break;
      }
      if(goingToUpgrade == undefined) return;

      var upgradecost = -1;
      var upgradeprog = 1;

      var sql = "SELECT u.currency, t." + goingToUpgrade + " AS upgrade " +
                "FROM users u JOIN tanks t ON u.ID=t.owner_id " +
                "WHERE u.ID = ?";
      var inserts = [LogedUsers[socket.id].ID];
      sql = mysql.format(sql, inserts);

      connection.query(sql,function(error, rows, fields){
         if(!!error){
            console.log("Error in the query");
         }else{
            upgradecost = Math.floor(rows[0].upgrade * 2000) + 500;
            upgradeprog = rows[0].upgrade;
            if(rows[0].currency >= upgradecost){
               var sql = "UPDATE users " +
                         "SET currency = ? " +
                         "WHERE ID = ?";
               var inserts = [rows[0].currency - upgradecost,
                              LogedUsers[socket.id].ID];

               sql = mysql.format(sql, inserts);
               connection.query(sql,function(error, rows, fields){
                  if(!!error){
                        console.log("SQL error");
                  }else{
                     var sql = "UPDATE tanks " +
                               "SET " + goingToUpgrade + " = ? " +
                               "WHERE owner_id = ?";
                     var inserts = [upgradeprog + 1,
                                    LogedUsers[socket.id].ID];
                     sql = mysql.format(sql, inserts);
                     connection.query(sql,function(error, rows, fields){
                        if(!!error){
                              console.log("SQL error");
                        }else{
                              console.log("User: " + LogedUsers[socket.id].ID + " upgraded " + goingToUpgrade);
                        }

                     });
                  }
               });
            }
         }
      });
	});

	/*REGISTRATION HANDLER FUNCTION*/
	socket.on ('Register', function (UserName, LoginName, Pass) {

		if(UserName == '' || LoginName == '' || Pass == '') return;

		var sql = "SELECT * FROM users WHERE ?? = ?";
		var inserts = ['user_name', UserName];
		sql = mysql.format(sql, inserts);

		connection.query(sql,function(error, rows, fields){
			if(!!error){
				console.log("Error in the query");
			}else{
				if(rows.length == 0){ //Nobody with this UserNameExists
					var sql = "SELECT * FROM users WHERE ?? = ?";
					var inserts = ['login_name', LoginName];
					sql = mysql.format(sql, inserts);

					connection.query(sql,function(error, rows, fields){
						if(!!error){
							console.log("Error in the query");
						}else{
							if(rows.length == 0){ //Nobody with this UserNameExists

								CreateUser(UserName,LoginName,Pass);

							}else{
								socket.emit("LoginNameExists");
								return;
							}
						}
					});
				}else{
					socket.emit("UserNameExists");
					return;
				}
			}
		});
	});
	/*END REGISTRATION*/


	socket.on("Login" , function(LoginName, Pass){

		if(LoginName == '' || Pass == '') return;

		var sql = "SELECT * FROM users WHERE ?? = ?";
		var inserts = ['login_name', LoginName];
		sql = mysql.format(sql, inserts);

		connection.query(sql,function(error, rows, fields){
			if(!!error){
				console.log("Error in the query");
			}else{
				if(rows.length == 0){
					socket.emit("InvalidUser");
				}else{
					bcrypt.compare(Pass, rows[0].password, function(err, res) {
						if(res===true){
                     LogedUsers[socket.id] = {ID:rows[0].ID, InGame: -1, UserName: rows[0].user_name};
							socket.emit("LoginSuccesful");
						}else{
							socket.emit("InvalidPassword");
						}
					});
				}
			}
		});
	});

   var GiveUserInfo = function(id){
      var sql = "SELECT * FROM users WHERE ?? = ?";
		var inserts = ['ID', id];
		sql = mysql.format(sql, inserts);

		connection.query(sql,function(error, rows, fields){
			if(!!error){
				console.log("Error in the query");
			}else{
				if(rows.length == 0){
               return false;
				}else{
					var User =  {
                  UserName: rows[0].user_name,
                  Currency: rows[0].currency
               };

               socket.emit("user", User);
            }
			}
		});
   }


   var GiveTank = function(id, ingame){

		var sql = "SELECT * FROM tanks WHERE ?? = ?";
		var inserts = ['owner_id', id];
		sql = mysql.format(sql, inserts);

		connection.query(sql,function(error, rows, fields){
			if(!!error){
				console.log("Error in the query");
			}else{
				if(rows.length == 0){
            /**Create new tank for user*/
            CreateNewTank(id);
            GiveTank(id); //try give it again;
				}else{
					var Tank = {
                  dmg: rows[0].damage,
                  hp: rows[0].health,
                  sh: rows[0].shield,
                  trs: rows[0].tank_rotation_speed,
                  brs: rows[0].barrel_rotation_speed,
                  ts: rows[0].tank_speed,
                  ss: rows[0].shoot_speed
               };

               if(!ingame)socket.emit("tank", Tank);
               else socket.emit('PlayTank', Tank);
            }
			}
		});
   }

   var CreateNewTank = function(owner_id){
      var sql = "INSERT INTO tanks (owner_id, damage, health, shield, tank_rotation_speed, barrel_rotation_speed, tank_speed, shoot_speed) " +
					 "VALUES (?,1,1,1,1,1,1,1)";
      var inserts = [owner_id];
      sql = mysql.format(sql, inserts);

      connection.query(sql,function(error, rows, fields){
         if(!!error){
            console.log("Error in the query");
         }else{

         }
      });
   }


	var CreateUser = function(UserName, LoginName, Pass){
		var sql = "INSERT INTO users (user_name, password, login_name, currency) " +
					 "VALUES (?,?,?,10000)";

		bcrypt.genSalt(saltRounds, function(err, salt) {
			 bcrypt.hash(Pass, salt, function(err, hash) {
				 var inserts = [UserName,hash,LoginName];
				 sql = mysql.format(sql, inserts);

				 connection.query(sql,function(error, rows, fields){
					 if(!!error){
						 console.log("Error in the query");
					 }else{
						 console.log("New user " + LoginName + " Registered");
						 socket.emit("RegistrationSuccesful");
					 }
				 });
			 });
		});
	}

});
