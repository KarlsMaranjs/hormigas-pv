var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'js/phaser-3.16.2/assets/sky.png');
    this.load.image('ground', 'js/phaser-3.16.2/assets/platform.png');
    this.load.image('star', 'js/phaser-3.16.2/assets/star.png');
    this.load.image('bomb', 'js/phaser-3.16.2/assets/bomb.png');
    this.load.spritesheet('dude',
        'js/phaser-3.16.2/assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{
    this.add.image('400', '300', 'sky')
}

function update ()
{
}