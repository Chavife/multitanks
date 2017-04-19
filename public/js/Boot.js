socket = io.connect ();

var bootState = {
  create: function(){
    game.plugins.add(PhaserInput.Plugin);
    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.height = window.innerHeight;
    game.width = window.innerWidth;
    game.state.start('login');

  }
}
