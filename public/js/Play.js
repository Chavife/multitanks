var land;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var currentSpeed = 0;
var cursors;

var bullets;
var nextFire = 0;

var HPBar;
var HPText;
var SHBar;
var SHText;

var frame = 0;


/**TANK VARIABLES COMMENTS SAY WITCH WALUES MAKES SENSE*/
var damage = 5; //5 - 10
var MaxHP = 100; //100 - 1000
var MaxSH = 100; //100 - 1000
var tankRotSpeed = 1; //1-5
var turretRotSpeed = 50; //50-300
var tankSpeed = 150; //150-400
var fireRate = 1000; //1000-100
/*END TANK VARIABLES*/

var currentHP = MaxHP;
var currentSH = MaxSH;

socket.on('GameEnd',function() {
   game.world.setBounds(0,0,window.innerWidth,window.innerHeight);
   console.log(game.world);
   delete Players;
   game.state.start('mainlobby');
});

socket.on('SendingTankAngle',function(user, angle) {
   enemies[user].tank.rotation = angle;
});

socket.on('SendingTurretAngle',function(user, angle) {
   enemies[user].turret.rotation = angle;
});

socket.on('PlayTank',function(tank) {
   damage = Math.round(0.26*tank.dmg + 5); //5 - 10
   MaxHP = Math.round(47.37*tank.hp + 53); //100 - 1000
   MaxSH = Math.round(47.37*tank.sh + 53); //100 - 1000
   tankRotSpeed = 0.21*tank.trs + 0.79; //1-5
   turretRotSpeed = Math.round(13.16*tank.brs + 36.84); //50-300
   console.log(turretRotSpeed);
   tankSpeed = Math.round(13.16*tank.ts + 136.84); //150-400
   fireRate = Math.round(-47.37*tank.ss + 1047); //1000-100
   currentHP = MaxHP;
   currentSH = MaxSH;
   turret.body.maxAngular = turretRotSpeed;
});

socket.on('SendingTankPosition',function(user, x, y) {
   enemies[user].tank.x = x;
   enemies[user].tank.y = y;
});

var gamePlayState = {
   preload: function(){
      game.load.atlas('tank', 'img/tanks.png', 'img/tanks.json');
      game.load.atlas('enemy', 'img/enemy-tanks.png', 'img/tanks.json');
      game.load.image('logo', 'img/logo.png');
      game.load.image('bullet', 'img/bullet.png');
      game.load.image('enemyHP', 'img/enemyHP.png');
      game.load.image('enemySH', 'img/enemySH.png');
      game.load.image('earth', 'img/light_sand.png');
      game.load.image('playerframe', 'img/Frame.png');
      game.load.spritesheet('kaboom', 'img/explosion.png', 64, 64, 23);
      game.load.spritesheet('hpbar', 'img/HPBar.png', 256, 26, 21);
      game.load.spritesheet('shbar', 'img/SHBar.png', 248, 16, 21);
   },


   create: function(){
      //  Resize our game world to be a 2000 x 2000 square
      game.world.setBounds(-2000, -2000, 3000, 3000);

      socket.emit("get_tank");

      //  Our tiled scrolling background
      land = game.add.tileSprite(0, 0, game.width, game.height, 'earth');
      land.fixedToCamera = true;

      var frame = game.add.sprite(20,20, 'playerframe');
      frame.fixedToCamera = true;

      var name = game.add.text(85, 135, MyUserName , { font: "15px Courier", fill: "#eee ", align: "center" });
      name.anchor.setTo(0.5);
      name.fixedToCamera = true;

      HPBar = game.add.sprite(146,60, 'hpbar');
      HPBar.fixedToCamera = true;
      HPText = game.add.text(225, 75, currentHP + "/" + MaxHP, { font: "17px Courier", fill: "#fff ", align: "center" });
      HPText.anchor.setTo(0.5);
      HPText.fixedToCamera = true;

      SHBar = game.add.sprite(144,92, 'shbar');
      SHBar.fixedToCamera = true;
      SHText = game.add.text(205, 103, currentSH + "/" + MaxSH, { font: "12px Courier", fill: "#fff ", align: "center" });
      SHText.anchor.setTo(0.5);
      SHText.fixedToCamera = true;


      //  The base of our tank
      tank = game.add.sprite(0, 0, 'tank', 'tank1');
      tank.anchor.setTo(0.5, 0.5);
      tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

      //  This will force it to decelerate and limit its speed
      game.physics.enable(tank, Phaser.Physics.ARCADE);
      tank.body.drag.set(0.2);
      tank.body.maxVelocity.setTo(400, 400); //MAX SPEED
      tank.body.collideWorldBounds = true;

      //  Finally the turret that we place on-top of the tank body
      turret = game.add.sprite(0, 0, 'tank', 'turret');
      game.physics.enable(turret, Phaser.Physics.ARCADE);
      turret.body.maxAngular = turretRotSpeed;
      turret.body.angularDrag = 0;
      turret.anchor.setTo(0.3, 0.5);

      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
      enemyBullets.createMultiple(100, 'bullet');

      enemyBullets.setAll('anchor.x', 0.5);
      enemyBullets.setAll('anchor.y', 0.5);
      enemyBullets.setAll('outOfBoundsKill', true);
      enemyBullets.setAll('checkWorldBounds', true);

      //  Create some baddies to waste :)
      enemies = [];

      enemiesTotal = 20;
      enemiesAlive = 20;

      for (name in Players)
      {
         if(name != MyUserName){
               console.log(name);
               enemies[name] = new EnemyTank(name, game, tank, enemyBullets);
         }

      }

      //  A shadow below our tank
      shadow = game.add.sprite(0, 0, 'tank', 'shadow');
      game.physics.enable(shadow, Phaser.Physics.ARCADE);
      shadow.anchor.setTo(0.5, 0.5);

      //  Our bullet group
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.physicsBodyType = Phaser.Physics.ARCADE;
      bullets.createMultiple(30, 'bullet', 0, false);
      bullets.setAll('anchor.x', 0.5);
      bullets.setAll('anchor.y', 0.5);
      bullets.setAll('outOfBoundsKill', true);
      bullets.setAll('checkWorldBounds', true);

      //  Explosion pool
      explosions = game.add.group();

      for (var i = 0; i < 10; i++){
         var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
         explosionAnimation.anchor.setTo(0.5, 0.5);
         explosionAnimation.animations.add('kaboom');
      }

      tank.bringToTop();
      turret.bringToTop();

      game.camera.follow(tank);
      game.camera.focusOnXY(0, 0);

      cursors = game.input.keyboard.createCursorKeys();
   },

   update: function(){
      game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

      if(game.width != window.innerWidth || game.height != window.innerHeight){
         game.width = window.innerWidth;
         game.height = window.innerHeight;
         game.scale.setGameSize(game.width, game.height);
         land.width = game.width;
         land.height = game.height;
      }

      enemiesAlive = 0;

      for (name in enemies)
      {
         if (enemies[name].alive)
         {
            enemiesAlive++;
            game.physics.arcade.collide(tank, enemies[name].tank);
            game.physics.arcade.overlap(bullets, enemies[name].tank, bulletHitEnemy, null, this);
            enemies[name].update();
         }
      }

      if (cursors.left.isDown){
         tank.angle -= tankRotSpeed;
         turret.rotation -=Phaser.Math.degToRad(tankRotSpeed);
         socket.emit("ChangingTankAngle",tank.rotation);
      }
      else if (cursors.right.isDown){
         tank.angle += tankRotSpeed;
         turret.rotation += Phaser.Math.degToRad(tankRotSpeed);
         socket.emit("ChangingTankAngle",tank.rotation);
      }

      if (cursors.up.isDown){
         if(currentSpeed < 0){
            currentSpeed += tankSpeed/10;
         }else{
            currentSpeed = tankSpeed;
         }
      }else if(cursors.down.isDown){

         if(currentSpeed > 0){
            currentSpeed -= tankSpeed/20;
         }else{
            currentSpeed = -tankSpeed/2;
         }
      }else{
         if (currentSpeed > 0){
            currentSpeed -= tankSpeed/20;
         }else if (currentSpeed < 0){
            currentSpeed += tankSpeed/20;
         }
      }

      game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
      game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, shadow.body.velocity);
      game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, turret.body.velocity);

      if (Math.abs(currentSpeed) > 0){
         socket.emit("ChangingPosition", tank.x,tank.y);
      }

      land.tilePosition.x = -game.camera.x;
      land.tilePosition.y = -game.camera.y;

      //  Position all the parts and align rotations
      shadow.x = tank.x;
      shadow.y = tank.y;
      shadow.rotation = tank.rotation;

      turret.x = tank.x;
      turret.y = tank.y;

      HPBar.frame = 19 - Math.floor(((currentHP/MaxHP)*100 - 1)/5);
      HPText.setText(currentHP + '/' + MaxHP);
      SHBar.frame = 19 - Math.floor(((currentSH/MaxSH)*100 - 1)/5);
      SHText.setText(currentSH + '/' + MaxSH);

      var prev_tur_rot = turret.rotation;

      var pointer_rot = Phaser.Math.radToDeg(Phaser.Math.normalizeAngle(game.physics.arcade.angleToPointer(turret)));
      var turret_rot = Phaser.Math.radToDeg(Phaser.Math.normalizeAngle(turret.rotation));

      if(pointer_rot >= turret_rot - 5 && pointer_rot <= turret_rot + 5){
         turret.body.angularVelocity = 0;
      }else if(pointer_rot > turret_rot && turret_rot < 180 && pointer_rot - turret_rot > 180){
         turret.body.angularVelocity = -1000;
      }else if(pointer_rot < turret_rot && turret_rot > 180 && turret_rot - pointer_rot > 180){
         turret.body.angularVelocity = +1000;
      }else if(turret_rot - pointer_rot > 0){
         turret.body.angularVelocity = -1000;
      }else{
         turret.body.angularVelocity = +1000;
      }

      if(turret.body.angularVelocity != 0){
         console.log("change");
         socket.emit("ChangingTurretAngle", turret.rotation);
      }

      if (game.input.activePointer.isDown)
      {
         fire();
      }

   },

   render:function(){
   }

}

function bulletHitPlayer (tank, bullet) {

   bullet.kill();

}

function bulletHitEnemy (tank, bullet) {

   bullet.kill();

   var destroyed = enemies[tank.name].damage();

   if (destroyed)
   {
      var explosionAnimation = explosions.getFirstExists(false);
      explosionAnimation.reset(tank.x, tank.y);
      explosionAnimation.play('kaboom', 30, false, true);
   }

}

function fire () {

   if (game.time.now > nextFire && bullets.countDead() > 0){
      nextFire = game.time.now + fireRate;

      var bullet = bullets.getFirstExists(false);

      bullet.reset(turret.x, turret.y);

      bullet.rotation = turret.rotation;
      game.physics.arcade.velocityFromRotation(bullet.rotation, 500, bullet.body.velocity);


      //game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 1000);
   }

}
