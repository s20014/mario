const D_WIDTH = 900;
const D_HEIGHT = 600;
let player; // プレイヤーのスプライトを格納する変数

const config = {
    type: Phaser.AUTO,
    width: D_WIDTH,// ゲーム画面の横幅
    height: D_HEIGHT,// ゲーム画面の高さ
    antialias: false,
    scene: {　// ここで関数を呼ぶ
        preload: preload,// 素材の読み込み時の関数　☆
        create: create,// 画面が作られた時の関数　△
        update: update// 連続実行される関数　◯
    },
    fps: {
        target: 24,// フレームレート
        forceSetTimeOut: true
    },
    physics: {　//物理の設定
        default: "arcade",
        arcade: {
            debug: true,// スプライトに緑の枠を表示します
            gravity: {y: 300}// 重力の方向とその強さ
        }
    }
}

// 2, Phaser3オブジェクトを作る
let phaser = new Phaser.Game(config);

function preload() {
    console.log("preload!!");
    this.load.spritesheet("mario2", './assets/mario/mariri.png',{frameWidth: 100, frameHeight: 95});
    this.load.spritesheet("mario", './assets/mario_all.png',{frameWidth: 78.5, frameHeight: 75});
    this.load.image("kumo", "./assets/kumo.png");
    this.load.image("sky", "./assets/ssss.png");
    this.load.image("block", "./assets/block3.png");
    this.load.image("r_jump", "./assets/mario_jump_right.png");
    this.load.image("l_jump", "./assets/mario_left_jump.png");
}

function create(){
    console.log("create!!")
    this.add.image(D_WIDTH/2, D_HEIGHT/2, "sky");

    let staticGroup = this.physics.add.staticGroup();
    staticGroup.create(D_WIDTH/2, D_HEIGHT -40, "block");

    this.add.sprite(50, 30, "kumo");
    this.add.sprite(200, 60, "kumo");
    this.add.sprite(350, 40, "kumo");
    this.add.sprite(500, 20, "kumo");
    this.add.sprite(650, 30, "kumo");
    this.add.sprite(800, 50, "kumo");


    player = this.physics.add.sprite(50, D_HEIGHT - 200, 'mario');
    player.lr = true
    this.physics.add.collider(player, staticGroup);
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('mario', { start: 5, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'normal_left',
        frames: this.anims.generateFrameNumbers('mario', { start: 3, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'normal_right',
        frames: this.anims.generateFrameNumbers('mario', { start: 4, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'r_jump',
        frames: this.anims.generateFrameNumbers('mario', { start: 8, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'l_jump',
        frames: this.anims.generateFrameNumbers('mario', { start: 9, end: 9 }),
        frameRate: 10,
        repeat: -1
    });
}

function update() {
    console.log("update!");

    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown && player.body.touching.down ) {
        player.setVelocityX(-150);
        player.lr = false
        player.anims.play('left', true)
        if (cursors.up.isDown) {
            player.setVelocityY(-150);
        }
    }
    else if (cursors.right.isDown && player.body.touching.down) {
        player.setVelocityX(150);
        player.lr = true
        player.anims.play('right', true)
        if (cursors.up.isDown) {
            player.setVelocityY(-150);
        }
    }
    else if(!player.body.touching.down) {
        if (player.lr) {
            player.anims.play('r_jump')
        }else {
            player.anims.play('l_jump')
        }
    }else if (cursors.up.isDown) {
        player.setVelocityY(-150);
    }
    else {
        player.setVelocityX(0);
        if (player.lr) {
            player.anims.play('normal_right')
        }else {
            player.anims.play('normal_left')
        }

    }


}