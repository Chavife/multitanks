var loginName;
var loginPassword;
var warningtext;

socket.on('InvalidUser',function() {
   warningtext.setText('Invalid Login Name');
});

socket.on('InvalidPassword',function() {
   warningtext.setText('Bad password, try again.');
});

socket.on('LoginSuccesful',function() {
   warningtext.setText('LOGIN SUCCESFUL');
   game.state.start('mainlobby');

});


var loginState = {

    preload: function(){
      game.load.spritesheet('button', 'img/Button-sprite.png', 314, 99);
      game.load.spritesheet('rotating_tank', 'img/rotating_tank.png',  160,160);
    },
    
    create: function(){
      warningtext = game.add.text(game.world.centerX, game.world.centerY + 10, "", { font: "20px Courier", fill: "#c00", align: "center" });
      warningtext.anchor.set(0.5);


      loginName = game.add.inputField(game.world.centerX - 208, game.world.centerY - 120  , {
          font: '18px Courier',
          fill: '#212121',
          fontWeight: 'bold',
          width: 400,
          height: 30,
          padding: 8,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 6,
          placeHolder: 'Login Name',
      });

      loginPassword = game.add.inputField(game.world.centerX - 208, game.world.centerY - 60, {
          font: '18px Courier',
          fill: '#212121',
          fontWeight: 'bold',
          width: 400,
          height: 30,
          padding: 8,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 6,
          placeHolder: 'Password',
          type: PhaserInput.InputType.password
      });

      game.stage.backgroundColor = 0x556f54;

      var tank = game.add.sprite(game.world.centerX - 80, 200, 'rotating_tank');
      var rotate = tank.animations.add('rotate');
      tank.animations.play('rotate', 5, true);

      var button = game.add.button(game.world.centerX, game.world.centerY + 70, 'button', Login, this, 1, 3, 2);
      button.anchor.set(0.5);

      var buttontext = game.add.text(game.world.centerX, game.world.centerY + 70, "LOGIN", { font: "40px Courier", fill: "#000", align: "center" });
      buttontext.anchor.set(0.5);

      var register = game.add.text(game.world.centerX, game.world.centerY + 140, "Register", { font: "20px Courier", fill: "#000", align: "center" });
      register.anchor.set(0.5);
      register.inputEnabled = true;
      register.events.onInputOver.add(over, this);
      register.events.onInputOut.add(out, this);
      register.events.onInputDown.add(down, this);


      function over(item) {
          item.fill = "#f00";
      }

      function out(item) {
          item.fill = "#000";
      }

      function down(item) {
          game.state.start('register');
      }
    }

}
function Login () {
   var logName = loginName.value;
   var pass = loginPassword.value;

   if(logName != '' && pass != ''){
      warningtext.setText("Waiting for server response.");
      socket.emit ('Login',logName,pass);
   }else{
      warningtext.setText("All the fields must be filled in!");
   }
}
