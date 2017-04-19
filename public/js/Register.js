var registerUserName;
var registerLoginName;
var registerPassword;
var warningtext;


socket.on('UserNameExists',function() {
   warningtext.setText('User Name already exists');
});

socket.on('LoginNameExists',function() {
   warningtext.setText('Login Name already exists');
});

socket.on('RegistrationSuccesful',function() {
   var redirect = 5;

   var interval = setInterval(function () {
        warningtext.setText('REGISTRATION SUCCESFUL!\n'+
                              'redirecting to login page in ' + redirect + ' seconds')

        if (redirect-- == 0) {
           clearInterval(interval);
           game.state.start('login');
        }
   }, 1000);
});


var registerState = {


    create: function(){

      var register = game.add.text(game.world.centerX, game.world.centerY - 230, "Registration", { font: "100px Courier", fill: "#000", align: "center" });
      register.anchor.set(0.5);

      warningtext = game.add.text(game.world.centerX, game.world.centerY - 150, "", { font: "20px Courier", fill: "#c00", align: "center" });
      warningtext.anchor.set(0.5);

      registerUserName = game.add.inputField(game.world.centerX - 208, game.world.centerY - 120  , {
          font: '18px Courier',
          fill: '#212121',
          fontWeight: 'bold',
          width: 400,
          height: 30,
          padding: 8,
          borderWidth: 1,
          borderColor: '#000',
          borderRadius: 6,
          placeHolder: 'User Name',
      });

      registerLoginName = game.add.inputField(game.world.centerX - 208, game.world.centerY - 60  , {
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

      registerPassword = game.add.inputField(game.world.centerX - 208, game.world.centerY, {
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

      var button = game.add.button(game.world.centerX, game.world.centerY + 120, 'button', Register, this, 1, 3, 2);
      button.anchor.set(0.5);
      var buttontext = game.add.text(game.world.centerX, game.world.centerY + 120, "REGISTER", { font: "40px Courier", fill: "#000", align: "center" });
      buttontext.anchor.set(0.5);
    }

}




function Register () {
   var usrName = registerUserName.value;
   var logName = registerLoginName.value;
   var pass = registerPassword.value;

   if(usrName != '' && logName != '' && pass != ''){
      warningtext.setText("Waiting for server response.");
      socket.emit ('Register',usrName,logName,pass);
   }else{
      warningtext.setText("All the fields must be filled in!");
   }

}
