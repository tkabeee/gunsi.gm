/**
 *
 * Canvas tutorial
 * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial
 *
 */

var GameState = function(game){
};

GameState.prototype = {

// Load images
preload: function(){
  // キャラクター画像のロード
  var img = new Image();
  img.src = "/assets/gfx/ship.png";

  this.img = img;
},

// initialize
init: function(){
  var self = this;
  self.preload();
},

ready: function(){
  var self = this;

  // 画面生成
  self.create();

},

// Setup
create: function(){
  var self = this,
      canvas = document.getElementById('stage');

  if(canvas.getContext){
    var ctx = canvas.getContext('2d');

    // 画像を描画
    /*
    self.img.onload = function(){
      ctx.translate(100, 50); 
      ctx.rotate(-90 * Math.PI / 180);
      ctx.drawImage(this, 0, 32, 32, 32, 0, 0, 16, 32);
    }
    */

    // 前進する


    // 行進する

  }
},

// This method is called every time
update: function(){
}

}

var game = new GameState();
game.init();
game.ready();