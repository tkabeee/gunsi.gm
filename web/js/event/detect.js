/**
 * 探索用チップ
 */

// TODO: 敵がいなくなっても判定している

CHIP.prototype.detect = function(index, unit, target){

  this.detect.unit = unit;
  this.detect[index] = {
    'decision': false,
    'target': target,
  };

};

CHIP.prototype.detect.__proto__ = {

  // 範囲を捜索（前面に限る）
  'range': function(index, distance){

      var self = this[index];
      
      // 判定の初期化
      self.decision = false;

      // unitのpointを取得
      this.unit.point = new Phaser.Point(this.unit.x, this.unit.y);

      // distanceの範囲にターゲットがいるかどうかを探知する

      // unitからtargetまでのdistanceを確認する
      this.unit.distanceBetween = this.unit.point.distance(self.target, true);

      if (this.unit.distanceBetween < distance)
      {
        // ターゲットがいた場合は、trueを返す
        self.decision = true;

        console.log(index+': '+self.decision);
      }

      return self.decision;
  }

};