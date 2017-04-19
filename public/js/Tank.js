
EnemyTank = function (index, game, player, bullets) {

    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 100;
    this.shield = 100;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.healthbar = game.add.image(x,y, "enemyHP");
    this.healthbar.anchor.set(0.5);
    this.healthbar.scale.setTo((this.health/100 * 10),1);
    this.shieldbar = game.add.image(x,y, "enemySH");
    this.shieldbar.anchor.set(0.5);
    this.shieldbar.scale.setTo((this.shield/100 * 10),1);
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.playerName = game.add.text(x, y + 20, index, { font: "20px Courier", fill: "#000", align: "center" });
    this.playerName.anchor.set(0.5);

    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = true;
    this.tank.body.collideWorldBounds = true;
    //this.tank.body.bounce.setTo(1, 1);

    this.tank.angle = game.rnd.angle();

    //game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};

EnemyTank.prototype.damage = function() {

    this.health -= 10;

    if (this.health <= 0){
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();
        this.playerName.setText("");
        this.healthbar.kill();
        this.shieldbar.kill();


        return true;
    }

    return false;
}

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.playerName.x = this.tank.x;
    this.playerName.y = this.tank.y + 50;

    this.shieldbar.x = this.tank.x;
    this.shieldbar.y = this.tank.y - 45;
    this.shieldbar.scale.setTo((this.shield/100 * 10),1);

    this.healthbar.x = this.tank.x;
    this.healthbar.y = this.tank.y - 60;
    this.healthbar.scale.setTo((this.health/100 * 10),1);

    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;

    //this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
/*
    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
        }
    }
*/
};
