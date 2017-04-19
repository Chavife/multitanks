var currency_value;
var currency;
var tmp_currency;
var CurrencyAnimationInterval;
var MatchmakeInfo;
var Players;
var MyUserName;

socket.on('tank',function(tank) {

   MakeUpgradeBar(250,300,"Damage", tank.dmg, "left");
   MakeUpgradeBar(250,450,"Health", tank.hp, "left");
   MakeUpgradeBar(250,600,"Shield", tank.sh, "left");

   MakeUpgradeBar(game.width - 250,300,"Tank rotation", tank.trs, "right");
   MakeUpgradeBar(game.width - 250,450,"Turret rotation", tank.brs, "right");
   MakeUpgradeBar(game.width - 250,600,"Tank speed", tank.ts, "right");
   MakeUpgradeBar(game.width - 250,750,"Reload time", tank.ss, "right");

});

socket.on('GameStart', function(players){
   console.log(players);
   Players = players;
   game.state.start('gameplay');
});

socket.on('user',function(user) {
   var welcome = game.add.text(50, 50, "Welcome " + user.UserName, { font: "40px Courier", fill: "#000", align: "center" });
   MyUserName = user.UserName;
   currency_value = user.Currency;
   currency = game.add.text(game.width - 300, 50, user.Currency, { font: "60px Courier", fill: "#000", align: "center" });
});

var mainLobbyState = {
   preload: function(){
      game.load.spritesheet('button', 'img/Button-sprite.png', 314, 99);
      game.load.image('tank', 'img/side_tank.png');
      game.load.image('upgrade_bar', 'img/upgrade-bar.png');
      game.load.spritesheet('coin', 'img/coin-sprite.png', 128, 128);
   },

   create: function(){

      socket.emit("get_user_information");

      var tankimg = game.add.sprite(game.world.centerX, game.world.centerY, 'tank');
      tankimg.anchor.set(0.5);
      tankimg.scale.setTo(1.8,1.8);

      MatchmakeInfo = game.add.text(game.world.centerX, 200, "", { font: "40px Courier", fill: "#f00", align: "center" });
      MatchmakeInfo.anchor.setTo(0.5)

      var coin = game.add.sprite(game.width - 400, 50, 'coin');
      coin.scale.setTo(0.5,0.5);
      var rotate = coin.animations.add('rotate');
      coin.animations.play('rotate', 10, true);

      var deadmatchbtn = game.add.button(game.world.centerX - 200, game.height - 100, 'button', PlayDeadmatch, this, 1, 3, 2);
      deadmatchbtn.anchor.set(0.5);
      var deadmatchbtntext = game.add.text(game.world.centerX - 200, game.height - 100, "PLAY\nDEADMATCH", { font: "25px Courier", fill: "#000", align: "center" });
      deadmatchbtntext.anchor.set(0.5);

      var teambtn = game.add.button(game.world.centerX + 200, game.height - 100, 'button', PlayTeam, this, 1, 3, 2);
      teambtn.anchor.set(0.5);
      var teambtntext = game.add.text(game.world.centerX + 200, game.height - 100, "PLAY\nTEAM", { font: "25px Courier", fill: "#000", align: "center" });
      teambtntext.anchor.set(0.5);

      var fightsbtn = game.add.button(250, 750, 'button', LastFights, this, 1, 3, 2);
      fightsbtn.anchor.set(0.5);
      var fightsbtntext = game.add.text(250, 750, "LAST\nFIGHTS", { font: "25px Courier", fill: "#000", align: "center" });
      fightsbtntext.anchor.set(0.5);

   }
}

function PlayDeadmatch(){
   socket.emit("MatchmakeToDeadMatch");
   MatchmakeInfo.setText("Waiting for other players");

}

function PlayTeam(){

}

function LastFights(){

}

function MakeUpgradeBar(x,y,name,progress,side){
   var barwidth = 357;
   var barheight = 75;
   var margin = 20;

   var cost = Math.floor(progress * 2000) + 500;

   var rectangle = new Phaser.Rectangle(x - barwidth/2 + margin/2,
                                        y - barheight/2 + margin/2,
                                        (barwidth - margin)*(progress/20),
                                        barheight - margin);

   var bmd = game.add.bitmapData(game.width, game.height);
   bmd.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, '#FFE115');
   bmd.addToWorld();

   var bar = game.add.sprite(x,y, 'upgrade_bar');
   bar.anchor.set(0.5);

   var upgradenamex, upgradenamey;
   var buttonx,buttony;
   var coinx,coiny;
   var pricex, pricey;

   if(side == "left"){
      upgradenamex = x - barwidth/2 + 10;
      upgradenamey = y - 72;

      buttonx = x + 50;
      buttony = y - 80;

      coinx = x + 57;
      coiny = y - 73;

      pricex = x + 100;
      pricey = y -70;
   }else{
      upgradenamex = x - 30;
      upgradenamey = y - 72;

      buttonx = x - 175;
      buttony = y - 80;

      coinx = x - 168;
      coiny = y - 73;

      pricex = x - 125;
      pricey = y -70;
   }
   var upgradename = game.add.text(upgradenamex, upgradenamey, name, { font: "25px Courier", fill: "#000", align: "center" });

   var button = game.add.button(buttonx, buttony, 'button', function(){
      if(currency_value < cost || progress == 20) return;
      var duration = cost;
      var step = cost/10;
      tmp_currency = currency_value;
      currency_value -= cost;
      clearInterval(CurrencyAnimationInterval);
      CurrencyAnimationInterval = setInterval(function () {
           tmp_currency -= step;
           duration -= step;
           if(tmp_currency<0) tmp_currency = currency_value;
           currency.setText(tmp_currency);
           if (duration == 0) {
             currency.setText(currency_value);
             clearInterval(CurrencyAnimationInterval);
          }
      }, 50);

      progress++;

      if(progress == 20){
         upgradecost.setText("MAX");
         coin.destroy();
      }else{
         cost = Math.floor(progress * 2000) + 500;
         upgradecost.setText(cost);
      }
      rectangle.width = Math.floor((barwidth - margin)*(progress/20));
      bmd.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height, '#FFE115');
      bmd.draw();

      socket.emit("upgrade", name);
   }, this, 1, 3, 2);
   button.scale.setTo(0.4,0.4);

   var coin = game.add.sprite(coinx, coiny, 'coin');
   coin.scale.setTo(0.2,0.2);
   var rotate = coin.animations.add('rotate');
   coin.animations.play('rotate', 10, true);
   var upgradecost = game.add.text(pricex, pricey, cost, { font: "20px Courier", fill: "#000", align: "center" });
   if(progress == 20){
      upgradecost.setText("MAX");
      coin.destroy();
   }
}
