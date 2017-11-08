/**
 * 移動用チップ
 */
CHIP.prototype.move = function(player, sprite){

  this.move.player = player;
  this.move.sprite = sprite;

};

CHIP.prototype.move.__proto__ = {

  'ready': function(){

    if (this.player.currentSpeed > 0)
    {
      // 停止じゃない場合
      if ((this.player.maxVelocity % 2) < this.player.currentSpeed)
      {
        this.player.currentSpeed -= (this.player.deceleration * 3);
      }
      else
      {
        this.player.currentSpeed -= this.player.deceleration;
      }
    }
    else
    {
      // 停止する
      this.player.currentSpeed = 0;

      // 進行方向を変更
      this.player.direction = !this.player.direction;
    }

  },

  'front': function(){

    if (!this.player.direction)
    {
      // 角度調整
      this.player.angle = this.sprite.angle - 180;
      // 前進前の速度調整
      this.ready();
    }
    else
    {
      this.player.angle = this.sprite.angle;

      if (this.player.currentSpeed < this.player.maxVelocity)
      {
        this.player.currentSpeed += this.player.deceleration;
      }
      else
      {
        this.player.currentSpeed = this.player.maxVelocity;
      }
    }

    this.player.point = this.sprite.body.velocity.rotate(0, 0, this.player.angle, true, this.player.currentSpeed);

    // console.log('angle: ' + this.player.angle);
    // console.log('speed: ' + this.player.currentSpeed);

  },

  'back': function(player, sprite){

    var self = this;

    // 減速前進中
    if (this.player.direction)
    {
      // 角度調整
      this.player.angle = this.sprite.angle;
      // 速度調整
      this.ready();
    }
    else
    {
      this.player.angle = this.sprite.angle - 180;

      if (this.player.currentSpeed < this.player.maxVelocity)
      {
        this.player.currentSpeed += this.player.deceleration;
      }
      else
      {
        this.player.currentSpeed = this.player.maxVelocity;
      }
    }

    this.player.point = this.sprite.body.velocity.rotate(0, 0, this.player.angle, true, this.player.currentSpeed);

    // console.log('angle: ' + this.player.angle);
    // console.log('speed: ' + this.player.currentSpeed);

  },

  'stop': function(player, sprite){

  }

};