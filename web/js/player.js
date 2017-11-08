PLAYER = function(){

  // 角度
  this.angle = -90;  // 正面
  // 方向
  this.direction = true; // 前:true 後ろ:false
  // Point object
  this.point = new Phaser.Point();
  // 基本速度
  this.maxVelocity = 200;
  // 現在の速度
  this.currentSpeed = 0;
  // 減速値
  this.deceleration = 4;

};