EnemyBlock = function(index, game, player){

  //Position
  var x = game.world.randomX;
  var y = game.world.randomY;

  this.game = game;
  this.health = 3;
  this.player = player;
  this.alive = true;

  this.block = game.add.sprite(x, y, 'enemy', 'block');
  this.block.anchor.set(0.5);
  this.block.idx = index.toString();

  game.physics.enable(this.block, Phaser.Physics.ARCADE);

  // 固定する
  this.block.body.immovable = true;
  // マップ外への動作
  this.block.body.collideWorldBounds = true;
  // bounce設定
  this.block.body.bounce.setTo(0, 0);
  // this.block.body.bounce.setTo(1, 1);

  // this.block.angle = game.rnd.angle();

  // game.physics.arcade.velocityFromRotation(this.block.rotation, 100, this.block.body.velocity);

  // console.log(this);

};

EnemyBlock.prototype.damage = function(){

  this.health -= 1;

  if (this.health <= 0)
  {
    console.log('kill!!');

    this.alive = false;
    this.block.kill();

    return true;
  }

  return false;

};

EnemyBlock.prototype.update = function(){
};

var game = new Phaser.Game(
  600,
  500,
  Phaser.AUTO,
  'field',
  {
    preload: preload,
    create:  create,
    update:  update,
    //render:  render,
  }
);

// NAMESPACES
var player;
var chip;


// Player
var unit;
// crop rectangle
var cropRect;

// Enemy of the provisional
var block;
var enemies;
// 敵の砲撃
var enemyBullets;
var enemiesTotal;

// プレイヤーの砲撃
var bullets;
// 砲撃の間隔
var fireRate = 300;
// 次の砲撃
var nextFire = 0;
// プレイヤーのスピード
var currentSpeed = 0;
// キーボードカーソル
var cursors;

// スペースキー
var fireKey

function preload(){
  game.load.image('unit', '../assets/gfx/unit.png');
  game.load.image('block', '../assets/gfx/block.png');
  game.load.image('bullet', '../assets/gfx/bullet.png');
  game.load.spritesheet('kaboom', '../assets/gfx/explosion.png', 64, 64, 23);
}

function create(){

  // Resize the world
  game.world.setBounds(0, 0, 600, 500);

  // プレイヤー生成
  player = new PLAYER();
  // 駆動チップ生成
  chip = new CHIP();

  unit = game.add.sprite(0, 0, 'unit');
  unit.anchor.setTo(0.5, 0.5);

  // Ship
  unit.w = 32;
  unit.h = 32;

  // Move
  unit.x = 250;
  unit.y = 400;

  // Crop
  cropRect = new Phaser.Rectangle(0, unit.w, unit.h, 32);
  unit.crop(cropRect);

  // Rotate
  unit.angle = 270;

  game.physics.enable(unit, Phaser.Physics.ARCADE);

  // The drag applied to the motion of the Body.
  unit.body.drag.set(0.2);

  // The maximum velocity in pixels per second sq. that the Body can reach.
  unit.body.maxVelocity.setTo(400, 400);

  // collide world bounds
  unit.body.collideWorldBounds = true;

  // てきのいれもの
  enemies = [];

  // てきのかず
  enemiesTotal = 5;

  for (var i = 0; i < enemiesTotal; i++)
  {
    enemies.push(new EnemyBlock(i, game, block));
  }

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

  for (var i = 0; i < 10; i++)
  {
    var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('kaboom');
  }

  // game.camera.follow(unit);
  // game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  // game.camera.focusOnXY(0, 0);

  // マウスの位置情報を返す
  //console.log(game.input.x);


  // Brings the Sprite to the top of the display list it is a child of.
  // http://docs.phaser.io/Phaser.Sprite.html#bringToTop
  unit.bringToTop();

  // The Keyboard Input manager.
  // Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
  cursors = game.input.keyboard.createCursorKeys();

  fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // chipの初期設定
  chip.move(player, unit);
  chip.rotate(player, unit);

  // 衝突判定の初期化
  for (var i = 0; i < enemies.length; i++)
  {
    chip.collide(i, unit, enemies[i].block);
    chip.detect(i, unit, enemies[i].block);
  }
}

function update(){

  // http://docs.phaser.io/Phaser.Physics.Arcade.html#overlap
  game.physics.arcade.overlap(enemyBullets, unit, bulletHitPlayer, null, this);

  // カーソルキーでplayer操作
  playerControl();

  for (var i = 0; i < enemies.length; i++)
  {
    if (enemies[i].alive)
    {
      // 一時的に物理衝突を外す
      //game.physics.arcade.collide(unit, enemies[i].block);
      game.physics.arcade.overlap(bullets, enemies[i].block, bulletHitEnemy, null, this);
      enemies[i].update();
    }
  }

  for (var i = 0; i < enemies.length; i++)
  {
    chip.collide.check(i);

    if (chip.detect.range(i, 100))
    {
    }
  }

  if (fireKey.isDown)
  {
    fire();
  }

  //console.log('x: '+unit.x, 'y: '+unit.y);
}

function render() {

    game.debug.bodyInfo(unit, 32, 32);
    game.debug.spriteInfo(unit, 32, 140);

    // game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 32, 250);

}

function playerControl(){

  if (cursors.left.isDown)
  {
    // 左旋回
    chip.rotate.left();
  }
  
  if (cursors.right.isDown)
  {
    // 左旋回
    chip.rotate.right();
  }

  if (cursors.up.isDown)
  {
    // 前進
    chip.move.front();
  }

  if (cursors.down.isDown)
  {
    // 後進
    chip.move.back();
  }

  if (player.currentSpeed > 0)
  {
    // game.physics.arcade.velocityFromRotation(unit.rotation, player.currentSpeed, unit.body.velocity);
  }

}

function fire () {

  if (game.time.now > nextFire /*&& bullets.countDead() > 0*/)
  {
    nextFire = game.time.now + fireRate;

    var bullet = bullets.getFirstExists(false);

    if (bullet)
    {
      // Resets the Sprite. This places the Sprite at the given x/y world coordinates and then sets alive, exists, visible and renderable all to true.
      // Also resets the outOfBounds state and health values. If the Sprite has a physics body that too is reset.
      bullet.reset(unit.x, unit.y);

      // bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);

      // angle値を基点として、砲撃先のpoint値を算出する
      // Point object を生成してそのポイントに対してrotate()を行なう？
      // bullet.body.velocity.x = 200;
      // bullet.body.velocity.y = 200;
      // http://docs.phaser.io/Point.js.html#sunlight-1-line-798
      var angle = unit.angle;
      var asDegrees = true;
      var distance = 280;
      var firePoint = bullet.body.velocity.rotate(0, 0, angle, asDegrees, distance);

      // console.log('angle: ' + angle);
      // console.log('distance: ' + distance);
      // console.log('rotate.point: ' + firePoint);

      // bulletTime = game.time.now + 200;
      // game.physics.arcade.moveToObject(bullet, unit, 10, 0);
    }
  }

}

function bulletHitPlayer (unit, bullet) {

  bullet.kill();

}

function bulletHitEnemy (block, bullet) {

  bullet.kill();

  var destroyed = enemies[block.idx].damage();

  // console.log(block);

  // ヒットしたら毎回爆発させる
  // if (destroyed)
  // {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(block.x, block.y);
    explosionAnimation.play('kaboom', 30, false, true);
  // }

}
