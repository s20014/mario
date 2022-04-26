//参考サイト
//
//■カメラをセットして画面をスクロールする機能の実装に参考にさせていただきました
//Follow User Controlled Sprite
//Example： https://phaser.io/examples/v3/view/camera/follow-user-controlled-sprite
//Exampleのコード： https://github.com/photonstorm/phaser3-examples/blob/master/public/src/camera/follow%20user%20controlled%20sprite.js
//
//Follow Sprite Small Bounds
//Example： https://phaser.io/examples/v3/view/camera/follow-sprite-small-bounds
//Exampleのコード： https://github.com/photonstorm/phaser3-examples/blob/master/public/src/camera/follow%20sprite%20small%20bounds.js
//
//■カメラセットによる画面スクロール時の、スコア用文字列表示を固定する実装の参考にさせていただきました
//setScrollFactor not behaving as documented
//https://github.com/photonstorm/phaser/issues/3662
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
    this.load.setBaseURL('https://rawcdn.githack.com/photonstorm/phaser3-examples/301997032fdc400527092fe60ed17d07a31efa11/public/src/games/firstgame');

    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

function create ()
{
    this.cameras.main.setBounds(0, 0, 2400, 600);
    this.physics.world.setBounds(0, 0, 2400, 600);

    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');
    this.add.image(2000, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(1200, 568, 'ground').setScale(2).refreshBody();
    platforms.create(2000, 568, 'ground').setScale(2).refreshBody();


    platforms.create(50, 250, 'ground');
    platforms.create(600, 400, 'ground');
    platforms.create(750, 220, 'ground');
    platforms.create(1200, 400, 'ground');
    platforms.create(1400, 200, 'ground');
    platforms.create(1700, 450, 'ground');
    platforms.create(1900, 300, 'ground');
    platforms.create(2200, 150, 'ground');
    platforms.create(2400, 400, 'ground');


    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);


    this.cameras.main.startFollow(player, true);
    //作業用
    //this.cameras.main.setZoom(0.5);

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

    stars = this.physics.add.group({
        key: 'star',
        repeat: 33,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    //scoreText.scrollFactorX = 0;
    scoreText.setScrollFactor(0);


    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
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

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}


