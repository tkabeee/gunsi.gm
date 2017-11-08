/*
 * PHASER Tanks
 * http://examples.phaser.io/_site/view_full.html?d=games&f=tanks.js&t=tanks
 */

EnemyTank = function (index, game, player, bullets) {

  // ランダムで配置場所を生成
  var x = game.world.randomX;
  var y = game.world.randomY;

  this.game = game;
  this.health = 3;
  this.player = player;
  this.bullets = bullets;
  this.fireRate = 1000;
  this.nextFire = 0;
  this.alive = true;

  this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
  this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
  this.turret = game.add.sprite(x, y, 'enemy', 'turret');

  this.shadow.anchor.set(0.5);
  this.tank.anchor.set(0.5);
  this.turret.anchor.set(0.3, 0.5);

  this.tank.name = index.toString();
  game.physics.enable(this.tank, Phaser.Physics.ARCADE);
  this.tank.body.immovable = false;
  this.tank.body.collideWorldBounds = true;
  this.tank.body.bounce.setTo(1, 1);

  this.tank.angle = game.rnd.angle();

  if(index == 1)
  {
    console.log(this);
  }

  game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);

};

EnemyTank.prototype.damage = function() {

  this.health -= 1;

  if (this.health <= 0)
  {
    this.alive = false;

    this.shadow.kill();
    this.tank.kill();
    this.turret.kill();

    return true;
  }

  return false;

}

EnemyTank.prototype.update = function() {

  this.shadow.x = this.tank.x;
  this.shadow.y = this.tank.y;
  this.shadow.rotation = this.tank.rotation;

  this.turret.x = this.tank.x;
  this.turret.y = this.tank.y;
  this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

  if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
  {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
      this.nextFire = this.game.time.now + this.fireRate;

      var bullet = this.bullets.getFirstDead();

      bullet.reset(this.turret.x, this.turret.y);

      bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
    }
  }

};

var game = new Phaser.Game(600, 500, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

  game.load.atlas('tank', 'assets/example/tanks/tanks.png', 'assets/example/tanks/tanks.json');
  game.load.atlas('enemy', 'assets/example/tanks/enemy-tanks.png', 'assets/example/tanks/tanks.json');
  game.load.image('logo', 'assets/example/tanks/logo.png');
  game.load.image('bullet', 'assets/example/tanks/bullet.png');
  game.load.image('earth', 'assets/example/tanks/scorched_earth.png');
  game.load.spritesheet('kaboom', 'assets/example/tanks/explosion.png', 64, 64, 23);
    
}

// 地面
var land;

// タンクの影
var shadow;
// プレイヤーのタンク
var tank;
// 旋回砲塔
var turret;

// 敵タンク全体のオブジェクト
var enemies;
// 敵の砲撃
var enemyBullets;
// 敵の総数
var enemiesTotal = 0;
// 敵の生存数
var enemiesAlive = 0;
// 爆発
var explosions;
// ゲームロゴ
var logo;

// プレイヤーのスピード
var currentSpeed = 0;
// キーボードカーソル
var cursors;

// プレイヤーの砲撃
var bullets;
// 砲撃の間隔
var fireRate = 100;
// 次の砲撃
var nextFire = 0;

// スタートテキスト
var introText;

function create () {

  //  Resize our game world to be a 2000 x 2000 square
  // game.world.setBounds(-1000, -1000, 2000, 2000);
  game.world.setBounds(0, 0, 600, 500);

  //  Our tiled scrolling background
  land = game.add.tileSprite(0, 0, 600, 500, 'earth');
  land.fixedToCamera = true;  // true

  //  The base of our tank
  tank = game.add.sprite(0, 0, 'tank', 'tank1');
  tank.anchor.setTo(0.5, 0.5);
  tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

  //  This will force it to decelerate and limit its speed
  game.physics.enable(tank, Phaser.Physics.ARCADE);
  tank.body.drag.set(0.2);
  tank.body.maxVelocity.setTo(400, 400);
  tank.body.collideWorldBounds = true;

  //  Finally the turret that we place on-top of the tank body
  turret = game.add.sprite(0, 0, 'tank', 'turret');
  turret.anchor.setTo(0.3, 0.5);

  //  The enemies bullet group
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(100, 'bullet');
  
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 0.5);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

  //  Create some baddies to waste :)
  enemies = [];

  enemiesTotal = 10;
  enemiesAlive = 10;

  for (var i = 0; i < enemiesTotal; i++)
  {
    // 敵タンクを必要な数だけ生成
    enemies.push(new EnemyTank(i, game, tank, enemyBullets));
  }

  //  A shadow below our tank
  shadow = game.add.sprite(0, 0, 'tank', 'shadow');
  shadow.anchor.setTo(0.5, 0.5);

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

  tank.bringToTop();
  turret.bringToTop();

  // ロゴを生成
  // logo = game.add.sprite(0, 200, 'logo');
  // ロゴをカメラに対して固定する
  // logo.fixedToCamera = true;

  introText = game.add.text(100, 100, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
  introText.anchor.setTo(0.5, 0.5);

  // game.input.onDown.add(removeLogo, this);
  game.input.onDown.add(startGame, this);

  game.camera.follow(tank);
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);

  cursors = game.input.keyboard.createCursorKeys();

}

/* @tk */
function startGame(){
  game.input.onDown.remove(startGame, this);
  introText.visible = false;
}

function removeLogo () {

  game.input.onDown.remove(removeLogo, this);
  logo.kill();

}

function update () {

  game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);

  enemiesAlive = 0;

  for (var i = 0; i < enemies.length; i++)
  {
    if (enemies[i].alive)
    {
      enemiesAlive++;
      game.physics.arcade.collide(tank, enemies[i].tank);
      game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
      enemies[i].update();
    }
  }

  if (cursors.left.isDown)
  {
    tank.angle -= 4;
  }
  else if (cursors.right.isDown)
  {
    tank.angle += 4;
  }

  if (cursors.up.isDown)
  {
    //  The speed we'll travel at
    currentSpeed = 300;
  }
  else
  {
    if (currentSpeed > 0)
    {
      currentSpeed -= 4;
    }
  }

  if (currentSpeed > 0)
  {
    game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
  }

  land.tilePosition.x = -game.camera.x;
  land.tilePosition.y = -game.camera.y;

  //  Position all the parts and align rotations
  shadow.x = tank.x;
  shadow.y = tank.y;
  shadow.rotation = tank.rotation;

  turret.x = tank.x;
  turret.y = tank.y;

  turret.rotation = game.physics.arcade.angleToPointer(turret);

  if (game.input.activePointer.isDown)
  {
    //  Boom!
    fire();
  }

}

function bulletHitPlayer (tank, bullet) {

  bullet.kill();

}

function bulletHitEnemy (tank, bullet) {

  bullet.kill();

  var destroyed = enemies[tank.name].damage();

  if (destroyed)
  {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(tank.x, tank.y);
    explosionAnimation.play('kaboom', 30, false, true);
  }

}

function fire () {

  if (game.time.now > nextFire && bullets.countDead() > 0)
  {
    nextFire = game.time.now + fireRate;

    var bullet = bullets.getFirstExists(false);

    bullet.reset(turret.x, turret.y);

    bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
  }

}

function render () {

  // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
  game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);

}