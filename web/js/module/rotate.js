/**
 * 旋回用チップ
 */
CHIP.prototype.rotate = function(player, sprite){

  this.rotate.player = player;
  this.rotate.sprite = sprite;

};

// TODO: directionの判定がうまくいっていない
CHIP.prototype.rotate.__proto__ = {

  'right': function(){

    var self = this;

    self.player.angle = self.sprite.angle += 4;

    if (self.player.currentSpeed > 0)
    {
      if (!self.player.direction)
      {
        self.player.angle = self.sprite.angle - 180;
      }

      self.sprite.body.velocity.rotate(0, 0, self.player.angle, true, self.player.currentSpeed);
    }
  },

  'left': function(){

    var self = this;

    self.player.angle = self.sprite.angle -= 4;

    if (self.player.currentSpeed > 0)
    {
      if (!self.player.direction)
      {
        self.player.angle = self.sprite.angle - 180;
      }

      self.sprite.body.velocity.rotate(0, 0, self.player.angle, true, self.player.currentSpeed);
    }
  }

};