const D_WIDTH = 900;
const D_HEIGHT = 600;
let player; // プレイヤーのスプライトを格納する変数
let platforms;
let time = 0;
let score = 0;
let gameOver;
let scoreText;
let timeTest;
let coinCount = 0;
let coinGroup

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
    this.load.spritesheet("mario", './assets/mario_all.png',{frameWidth: 78.5, frameHeight: 75});
    this.load.spritesheet("kuribo","./assets/kuribo.png", {frameWidth:84, frameHeight: 70 });
    this.load.spritesheet("noko", "./assets/nokonoko_aruku.png", {frameWidth:78, frameHeight:100 });
    this.load.spritesheet("noko_die", "./assets/nokonoko_die.png", {frameWidth:78, frameHeight:75});
    this.load.image("kumo", "./assets/kumo.png");
    this.load.image("sky", "./assets/ssss.png");
    this.load.image("sky_han", "./assets/sky_han.png");
    this.load.image("block", "./assets/block3.png");
    this.load.image("dokan", "./assets/dokan.png");
    this.load.spritesheet("kuribo_die", "./assets/kuribo_die.png", {frameWidth: 69, frameHeight: 36});
    this.load.spritesheet("kill", "./assets/killer.png", {frameWidth: 107, frameHeight: 68});
    this.load.image("coin", "./assets/coin.png");
}

function create(){
    console.log("create!!");

    this.cameras.main.setBounds(0, 0, 2400, 600);
    this.physics.world.setBounds(0, 0, 2400, 600);

    this.add.image(450, D_HEIGHT/2, "sky");
    this.add.image(1350, D_HEIGHT/2, "sky_han");
    this.add.image(2250, D_HEIGHT/2, "sky");


    platforms = this.physics.add.staticGroup();

    platforms.create(450, 570, 'block');
    platforms.create(1200, 570, 'block');
    platforms.create(2250, 570, 'block');
    platforms.create(2700, 570, 'block');
    platforms.create(1000, 480, 'dokan');
    platforms.create(2000, 480, 'dokan');

    this.add.sprite(50, 30, "kumo");
    this.add.sprite(200, 60, "kumo");
    this.add.sprite(350, 40, "kumo");
    this.add.sprite(500, 20, "kumo");
    this.add.sprite(650, 30, "kumo");
    this.add.sprite(800, 50, "kumo");
    this.add.sprite(1000, 30, "kumo");
    this.add.sprite(1300, 60, "kumo");
    this.add.sprite(1700, 40, "kumo");
    this.add.sprite(2000, 20, "kumo");
    this.add.sprite(2400, 30, "kumo");
    this.add.sprite(2600, 50, "kumo");


    let moveGroup;
    coinGroup = this.physics.add.group();
    for (let i = 0; i < 12; i++) {
        coinGroup.create(i * 200 + 20, 0, "coin");
    }

    player = this.physics.add.sprite(50, D_HEIGHT - 200, 'mario');
    kuribo = [this.physics.add.sprite(190, 0,'kuribo'),
        this.physics.add.sprite(300, 0,'kuribo'),
        this.physics.add.sprite(700, 0,'kuribo'),
        this.physics.add.sprite(900, 0,'kuribo'),
        this.physics.add.sprite(1300, 0,'kuribo'),
        this.physics.add.sprite(2000, 0,'kuribo')]

    noko = [this.physics.add.sprite(400, 150, 'noko'),
        this.physics.add.sprite(1000, 0, 'noko')]



    killer = new Array (
        [this.physics.add.sprite(2000, 50, 'kill'), -200, -3]
    )


    player.setCollideWorldBounds(true);

    kill = [];
    this.physics.add.collider(coinGroup, platforms)
    this.physics.add.collider(player, kuribo);
    this.physics.add.collider(player, kill);
    this.physics.add.collider(platforms, kuribo);
    this.physics.add.collider(player, noko);
    this.physics.add.collider(platforms, noko);
    this.physics.add.collider(player, platforms);



    this.physics.add.overlap(player, coinGroup, (p, c)=> {
        collectCoin(p, c);
        c.destroy();//コインを消す
    }, null, this);

    player.lr = true
    this.cameras.main.startFollow(player, true);

    for (let i of kuribo) {
        i.setVelocityX(20);
    }

    for (let i of noko) {
        i.setVelocityX(-20);
    }

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

    this.anims.create({
        key: 'kuribo',
        frames: this.anims.generateFrameNumbers('kuribo', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'kuribo_die',
        frames: this.anims.generateFrameNumbers('kuribo_die', { start: 0, end: 0 }),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'l_noko',
        frames: this.anims.generateFrameNumbers('noko', { start:0 , end: 1 }),
        frameRate: 3,
        repeat: -1
    });
    this.anims.create({
        key: 'r_noko',
        frames: this.anims.generateFrameNumbers('noko', { start: 2, end: 3}),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'r_noko_die',
        frames: [ { key: 'noko_die', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'killer',
        frames: this.anims.generateFrameNumbers('kill', { start: 0, end: 16}),
        frameRate: 10,
        repeat: -1
    });

    scoreText = this.add.text(12, 12, 'Score: ' + score,  { font: "30px", fill: "#000" });
    scoreText.setScrollFactor(0);

    gameOver = this.add.text(D_WIDTH/2 - 120, D_HEIGHT/2 - 50, "",  { font: "50px", fill: "#000" });
    gameOver.setScrollFactor(0);

    timeTest = this.add.text(D_WIDTH - 200, 20, 'Time:' + "2000",  { font: "30px", fill: "#000" });
    timeTest.setScrollFactor(0);
}

function update() {
    console.log("update!");

    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown && player.body.touching.down ) {
        player.setVelocityX(-150);
        player.lr = false
        player.anims.play('left', true)
        if (cursors.up.isDown) {
            player.setVelocityY(-300);
        }
    }else if (cursors.down.isDown) {
        player.setVelocityY(100);
    }
    else if (cursors.right.isDown && player.body.touching.down) {
        player.setVelocityX(150);
        player.lr = true
        player.anims.play('right', true)
        if (cursors.up.isDown) {
            player.setVelocityY(-300);
        }
    }
    else if(!player.body.touching.down) {
        if (player.lr) {
            player.anims.play('r_jump')
            if (cursors.right.isDown || cursors.right.isDown && cursors.up.isDown) {
                player.setVelocityX(100);
            }else if (cursors.left.isDown || cursors.right.isDown && cursors.up.isDown){
                player.setVelocityX(-100);
            }
        }else {
            player.anims.play('l_jump')
            if (cursors.right.isDown || cursors.right.isDown && cursors.up.isDown) {
                player.setVelocityX(100);
            }else if (cursors.left.isDown || cursors.right.isDown && cursors.up.isDown){
                player.setVelocityX(-100);
            }
        }
    }else if (cursors.up.isDown) {
        player.setVelocityY(-300);
    }
    else {
        player.setVelocityX(0);
        if (player.lr) {
            player.anims.play('normal_right');
        }else {
            player.anims.play('normal_left');
        }
    }

//kuribo
    for (let i of kuribo) {

        if (i.body.touching.down) {
            i.anims.play('kuribo', true)
            if (i.body.touching.right) {
                i.setVelocityX(-20);
            } else if (i.body.touching.left) {
                i.setVelocityX(20);
            }
        }
        if (i.body.touching.up) {
            a = 0;
            player.setVelocityY(-150);
            i.anims.play('kuribo_die')
        }
    }

    console.log(time);

    //敵の動き noko
    for (let i of noko) {
        if (i.body.touching.down) {
            i.anims.play('l_noko', true);
            if (i.body.touching.right) {
                i.setVelocityX(-20);
                i.anims.play('l_noko', true);
            } else if (i.body.touching.left) {
                i.setVelocityX(20)
                i.anims.play('r_noko', true);
            }
        }
        if (i.body.touching.up) {
            player.setVelocityY(-150);
            i.anims.play('r_noko_die')
        }
    }

    if (time % 200 === 0 && time !== 0) {
        let xnum =  (Math.random() * 2400) + 5
        let xnum2 = (Math.random() * 2400) + 5
        let ynum = (Math.random() * 400)

        kuribo.push(
            this.physics.add.sprite(xnum, 0,'kuribo').setVelocityX(20)
        );
        noko.push(
            this.physics.add.sprite(xnum2, 0,'noko').setVelocityX(20)
        );
        killer.push(
            [this.physics.add.sprite(2400, ynum, 'kill'), -200, -3]
        )
    } else if (time >= 2000) {
        gameOver.text = "Time up!!";
        this.physics.pause();
    }

    //キラー


    for (let i of killer) {
        kill.push(i[0]);
        if(i[0].body.touching.up) {
            player.setVelocityY(-150);
            i[2] = 500;
            i[1] = 0;
        } else  {
            i[0].setVelocityY(i[2]);
            i[0].setVelocityX(i[1]);
        }
        i[0].anims.play('killer', true);

    }
time ++
    times = 2000 - time
    if (times >= 0) {
        timeTest.text = 'Time:' + times
    }
}

function collectCoin(playre, coin) {
    coinCount++
    score += 10;
    scoreText.text = 'Score: ' + score;
    if (coinCount >= 12) {
        for (let i = 0; i < 12; i++) {
            coinGroup.create(i * 200 + 20, 0, "coin");
        }
        coinCount = 0;
    }
}
