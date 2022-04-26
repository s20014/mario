//参考サイト
//
//■Phaser3 Example
//Follow User Controlled Sprite
//Example： https://phaser.io/examples/v3/view/camera/follow-user-controlled-sprite
//Exampleのコード： https://github.com/photonstorm/phaser3-examples/blob/master/public/src/camera/follow%20user%20controlled%20sprite.js
//
//Follow Sprite Small Bounds
//Example： https://phaser.io/examples/v3/view/camera/follow-sprite-small-bounds
//Exampleのコード： https://github.com/photonstorm/phaser3-examples/blob/master/public/src/camera/follow%20sprite%20small%20bounds.js
//
//Follow Zoom Tilemap
//Example： https://phaser.io/examples/v3/view/camera/follow-zoom-tilemap
//Exampleのコード： https://github.com/photonstorm/phaser3-examples/blob/master/public/src/camera/follow%20zoom%20tilemap.js
//
//■Phaser2 Example
//Map Collide
//Example： https://phaser.io/examples/v2/tilemaps/map-collide
//Exampleのコード： https://github.com/photonstorm/phaser-examples/blob/master/examples/tilemaps/map%20collide.js
//


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var platforms;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles1', 'https://rawcdn.githack.com/photonstorm/phaser3-examples/33639f80cef3e4ea281e783500139c796094f007/public/assets/tilemaps/tiles/super-mario.png');
    this.load.tilemapTiledJSON('map', 'https://rawcdn.githack.com/photonstorm/phaser3-examples/33639f80cef3e4ea281e783500139c796094f007/public/assets/tilemaps/maps/super-mario.json');
    this.load.spritesheet('dude', 'https://rawcdn.githack.com/photonstorm/phaser3-examples/301997032fdc400527092fe60ed17d07a31efa11/public/src/games/firstgame/assets/dude.png', { frameWidth: 32, frameHeight: 48 });

}

var player;
var cursors;
var score = 0;
var gameOver = false;

function create ()
{
    this.cameras.main.setBounds(0, 0, 3392, 100);
    this.physics.world.setBounds(0, 0, 3392, 240);


    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('SuperMarioBros-World1-1', 'tiles1');
    var layer = map.createStaticLayer('World1', tileset, 0, 0);

    map.setCollisionBetween(15, 16);
    map.setCollisionBetween(20, 25);
    map.setCollisionBetween(27, 29);
    map.setCollision(40);

    player = this.physics.add.sprite(100, 100, 'dude');

    player.setScale(0.7);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);


    this.cameras.main.startFollow(player, true);
    this.cameras.main.setZoom(1.5);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, layer);

}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.onFloor())
    {
        player.setVelocityY(-230);
    }
}


