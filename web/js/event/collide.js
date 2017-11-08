/**
 * 衝突判定／イベント系
 */
CHIP.prototype.collide = function(index, unit, target){

  this.collide.unit = unit;
  this.collide[index] = {
    'decision': false,
    'target': target,
  };

}

CHIP.prototype.collide.__proto__ = {

  'check': function(index){

    var self = this[index];

    self.decision = game.physics.arcade.collide(this.unit, self.target);

    if(self.decision){

      // console.log('collide!');
      return true;

    }

    return false;

  },

 };