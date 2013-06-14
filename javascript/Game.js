var SpaceFlock = function SpaceFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 10;

  this.draw = function() {};

  this.dead = function() {
    if(Manager.board.nextLevel()) {
      Manager.loadBoard(new GameBoard(Manager.board.nextLevel())); 
    } else {
      Manager.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit){
      this.lastHit = this.hit;
      this.dy = this.speed;
    }else{
      this.dy = 0;
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Space)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0){
    	this.dead();
    } 

    this.max_y = max;
    return true;
  };
}


var Space = function Space(opts){
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
}

Space.prototype.draw = function(canvas){
  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}

Space.prototype.dead = function(){
  this.flock.speed += 1;
  this.board.remove(this);
}

Space.prototype.step = function(dt){
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
  if(Math.abs(this.mx) > 10){
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    this.frame = (this.frame+1) % 2;
    if(this.x > Manager.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
  return true;
}

Space.prototype.fireSometimes = function(){
      if(Math.random() * 100 < 10){
        this.board.addSprite('missile',this.x + this.w/2 - Sprites.map.missile.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
}

var Player = function Player(opts){ 
  this.reloading = 0;
}

Player.prototype.draw = function(canvas){
   Sprites.draw(canvas,'player',this.x,this.y);
}


Player.prototype.dead = function(){
  Manager.callbacks['dead']();
}

Player.prototype.step = function(dt){
  if(Manager.keys['left']){ 
  	this.x -= 100 * dt; 
  }
  
  if(Manager.keys['right']){
  	this.x += 100 * dt;
  }

  if(this.x < 0){
  	this.x = 0;
  }
  
  if(this.x > Manager.width-this.w){
  	this.x = Manager.width-this.w;
  }

  this.reloading--;

  if(Manager.keys['shoot'] && this.reloading <= 0 && this.board.missiles < 3){
    this.board.addSprite('missile',
                          this.x + this.w/2 - Sprites.map.missile.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.missiles++;
    this.reloading = 10;
  }
  return true;
}


var Missile = function Missile(opts){
   this.dy = opts.dy;
   this.player = opts.player;
}

Missile.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile',this.x,this.y);
}

Missile.prototype.step = function(dt){
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy){ 
     enemy.dead();
     return false;
   }
   return (this.y < 0 || this.y > Manager.height) ? false : true;
}

Missile.prototype.dead = function(){
  if(this.player){
  	this.board.missiles--;
  }
  
  if(this.board.missiles < 0){
  	this.board.missiles=0;
  }
  
   this.board.remove(this);
}
