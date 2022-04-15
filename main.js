const D_WIDTH = 480;
const D_HEIGHT = 320;
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
    this.load.image("mario", "./assets/mario/mario_stop.jpg");
    this.load.image("sky", "./assets/rora.jpg");
}

function create(){
    console.log("create!!")
    this.add.image(D_WIDTH/2, D_HEIGHT/2, "sky");
    player = this.physics.add.sprite(240, 80, "mario");

}

function update() {
    console.log("update!");
}