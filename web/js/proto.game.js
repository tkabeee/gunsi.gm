EnemyBlock = function(game, player){

  //Position
  var x = game.world.randomX;
  var y = game.world.randomY;

  this.game = game;
  this.health = 3;
  this.player = player;
  this.alive = true;

  this.block = game.add.sprite(x, y, 'enemy', 'block');
  this.block.anchor.set(0.5);

  game.physics.enable(this.block, Phaser.Physics.ARCADE);

  this.block.body.immovable = false;
  this.block.body.collideWorldBounds = true;
  this.block.body.bounce.setTo(1, 1);

  this.block.angle = game.rnd.angle();

  game.physics.arcade.velocityFromRotation(this.block.rotation, 100, this.block.body.velocity);

  // console.log(this);

};

EnemyBlock.prototype.damage = function(){

  console.log('damage!');

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
    update:  update
  }
);

// NAMESPACES
var player;
var chip;


// Player
var ship;
// crop rectangle
var cropRect;

// Enemy of the provisional
var block;
var enemy;
// 敵の砲撃
var enemyBullet;

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
  game.load.image('ship', '../assets/gfx/ship.png');
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

  console.log(chip);


  ship = game.add.sprite(0, 0, 'ship');
  ship.anchor.setTo(0.5, 0.5);

  // Ship
  ship.w = 32;
  ship.h = 32;

  // Move
  ship.x = 250;
  ship.y = 400;

  // Crop
  cropRect = new Phaser.Rectangle(0, ship.w, ship.h, 32);
  ship.crop(cropRect);

  // Rotate
  ship.angle = 270;

  game.physics.enable(ship, Phaser.Physics.ARCADE);

  // The drag applied to the motion of the Body.
  ship.body.drag.set(0.2);

  // The maximum velocity in pixels per second sq. that the Body can reach.
  ship.body.maxVelocity.setTo(400, 400);

  // collide world bounds
  ship.body.collideWorldBounds = true;

  enemy = new EnemyBlock(game, block);

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

  // game.camera.follow(ship);
  // game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  // game.camera.focusOnXY(0, 0);

  // マウスの位置情報を返す
  //console.log(game.input.x);


  // Brings the Sprite to the top of the display list it is a child of.
  // http://docs.phaser.io/Phaser.Sprite.html#bringToTop
  ship.bringToTop();

  // The Keyboard Input manager.
  // Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right.
  cursors = game.input.keyboard.createCursorKeys();

  fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update(){

  // http://docs.phaser.io/Phaser.Physics.Arcade.html#overlap
  game.physics.arcade.overlap(enemyBullet, ship, bulletHitPlayer, null, this);

  // カーソルキーでplayer操作
  playerControl();

  if (enemy.alive)
  {
    game.physics.arcade.collide(ship, enemy.block);
    game.physics.arcade.overlap(bullets, enemy.block, bulletHitEnemy, null, this);
    enemy.update();
  }

  if (fireKey.isDown)
  {
    fire();
  }

  //console.log('x: '+ship.x, 'y: '+ship.y);
}

function playerControl(){

  if (cursors.left.isDown)
  {
    ship.angle -= 4;
  }
  else if (cursors.right.isDown)
  {
    ship.angle += 4;
  }

  if (cursors.up.isDown)
  {
    //  The speed we'll travel at
    // 砲撃スピードを超えるとおかしいでしょ
    // currentSpeed = 160;
    chip.Move.front(player, ship);
  }
  /*
  else
  {
    if (currentSpeed > 0)
    {
      currentSpeed -= 4;
    }
  }
  */

  if (currentSpeed > 0)
  {
    game.physics.arcade.velocityFromRotation(ship.rotation, currentSpeed, ship.body.velocity);
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
      bullet.reset(ship.x, ship.y);

      // bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);

      // angle値を基点として、砲撃先のpoint値を算出する
      // Point object を生成してそのポイントに対してrotate()を行なう？
      // bullet.body.velocity.x = 200;
      // bullet.body.velocity.y = 200;
      // http://docs.phaser.io/Point.js.html#sunlight-1-line-798
      var angle = ship.angle;
      var asDegrees = true;
      var distance = 280;
      var firePoint = bullet.body.velocity.rotate(0, 0, angle, asDegrees, distance);

      // console.log('angle: ' + angle);
      // console.log('distance: ' + distance);
      // console.log('rotate.point: ' + firePoint);

      // bulletTime = game.time.now + 200;
      // game.physics.arcade.moveToObject(bullet, ship, 10, 0);
    }
  }

}

function bulletHitPlayer (ship, bullet) {

  bullet.kill();

}

function bulletHitEnemy (block, bullet) {

  bullet.kill();

  var destroyed = enemy.damage();

  // console.log(block);

  // ヒットしたら毎回爆発させる
  // if (destroyed)
  // {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(block.x, block.y);
    explosionAnimation.play('kaboom', 30, false, true);
  // }

}
