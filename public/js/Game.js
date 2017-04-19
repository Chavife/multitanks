var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Game');


window.onresize = function(event) {
    game.scale.setGameSize(window.innerWidth, window.innerHeight);
};


game.state.add('boot', bootState);
game.state.add('login', loginState);
game.state.add('register', registerState);
game.state.add('mainlobby', mainLobbyState);
game.state.add('gameplay', gamePlayState);

game.state.start('boot');
