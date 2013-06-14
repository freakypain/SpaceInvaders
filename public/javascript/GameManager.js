var Manager = new function() {
	var KEYS = {37:'left', 39:'right', 32: 'shoot'};
	this.keys = {};
	
	this.initialize = function(canvasDom, _levelData, _spriteData, _callbacks){
		
		 this.canvas_elem = $(canvasDom)[0];
		 this.canvas = this.canvas_elem.getContext('2d');
		 this.width = $(this.canvas_elem).attr('width');
		 this.height = $(this.canvas_elem).attr('height');	 
	
		 
		 $(window).keydown(function(event){
		 	if(KEYS[event.keyCode]){
		 		Manager.keys[KEYS[event.keyCode]] = true;
		 	}	
		 });
		 
		  $(window).keyup(function(event){
		 		if(KEYS[event.keyCode]){
		 			Manager.keys[KEYS[event.keyCode]] = false;
		 		}
		 });
		 
		 this.levelData = _levelData;
		 this.callbacks = _callbacks;
		 Sprites.load(_spriteData,this.callbacks['start']);
		};
		
		this.loadBoard = function(_board){
			Manager.board = _board;
		}
		
		this.loop = function(){
			Manager.board.step(30 / 1000);
			Manager.board.render(Manager.canvas);
			setTimeout(Manager.loop,30);
		};
	};
	
	var Sprites = new function(){		
		this.map = {};
		
		this.load = function(_spriteData, _callback){
			this.map = _spriteData;
			this.image = new Image();
			this.image.onload = _callback;
			this.image.src = 'images/sprites.png';
		};
		
		this.draw = function(canvas, _sprite, _x, _y, _frame){
			var sp = this.map[_sprite];
			if(!_frame){
				frame = 0;
			}
			canvas.drawImage(this.image, sp.sx + frame * sp.w, sp.sy, sp.w, sp.h, _x, _y, sp.w, sp.h);
		};
	}
	
	var ManageScreen = function ManageScreen(_text,_text2,_callback){
	  this.step = function(dt) {
	  	if(Manager.keys['shoot'] && _callback){
	  		_callback();
	  	}
	  };
	  
	  this.render = function(canvas){
	    canvas.clearRect(0,0, Manager.width, Manager.height);
	    canvas.font = "bold 40px arial";
	    var measure = canvas.measureText(_text);  
	    canvas.fillStyle = "#FFFFFF";
	    canvas.fillText(_text, Manager.width / 2 - measure.width / 2, Manager.height / 2);
	    canvas.font = "bold 20px arial";
	    var measure2 = canvas.measureText(_text2);
	    canvas.fillText(_text2, Manager.width / 2 - measure2.width / 2, Manager.height / 2 + 40);
  };
};

var GameBoard = function GameBoard(_levelNumber){
  this.removedObjs = [];
  this.missiles = 0;
  this.level = _levelNumber;
  var board = this;

  this.add = function(_obj){
  	_obj.board = this; 
  	this.objects.push(_obj);
  	return _obj; 
  };
  
  this.remove = function(_obj){
  	this.removedObjs.push(_obj); 
  };

  this.addSprite = function(_name,_x,_y,_opts){
    var sprite = this.add(new Sprites.map[_name].cls(_opts));
    sprite.name = _name;
    sprite.x = _x; 
    sprite.y = _y;
    sprite.w = Sprites.map[_name].w; 
    sprite.h = Sprites.map[_name].h;
    return sprite;
  };
  

  this.iterate = function(_func){
     for(var i = 0,len=this.objects.length; i < len;i++){
       _func.call(this.objects[i]);
     }
  };

  this.detect = function(_func){
    for(var i = 0, val = null, len = this.objects.length; i < len; i++){
      if(_func.call(this.objects[i])){
      	return this.objects[i];
      }
    }
    return false;
  };

  this.step = function(_dt){ 
    this.removedObjs = [];
    this.iterate(function(){ 
        if(!this.step(_dt)){
        	this.dead();
        }
    }); 

    for(var i = 0, len = this.removedObjs.length; i < len; i++){
      var idx = this.objects.indexOf(this.removedObjs[i]);
      if(idx != -1) this.objects.splice(idx,1);
    }
  };

  this.render = function(canvas){
    canvas.clearRect(0,0,Manager.width,Manager.height);
    this.iterate(function(){
    	this.draw(canvas); 
    });
  };

  this.collision = function(o1,o2){
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  this.collide = function(_obj){
    return this.detect(function(){
      if(_obj != this && !this.invulnrable)
       return board.collision(_obj,this) ? this : false;
    });
  };

  this.loadLevel = function(_level){
    this.objects = [];
    this.player = this.addSprite('player', // Sprite
                                 Manager.width / 2, // X
                                 Manager.height - Sprites.map['player'].h - 10); // Y
    var flock = this.add(new SpaceFlock());
    for(var y = 0, rows = _level.length; y < rows; y++){
      for(var x = 0,cols = _level[y].length; x < cols; x++){
        var alien = Sprites.map['alien' + _level[y][x]];
        if(alien){ 
          this.addSprite('alien' + _level[y][x], // Which Sprite
                         (alien.w + 10) * x,  // X
                         alien.h * y,       // Y
                         { flock: flock }); // Options
        }
      }
    }
  };

  this.nextLevel = function() { 
    return Manager.levelData[_levelNumber + 1] ? (_levelNumber + 1) : false 
  };
 
  this.loadLevel(Manager.levelData[_levelNumber]);
};


   


		
		
	
	
		
		 
		 
