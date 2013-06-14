
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0]]};

  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 23, h: 18, cls: Space, frames: 2 },
    'alien2': { sx: 0,  sy: 18, w: 23, h: 18, cls: Space, frames: 2 },
    'player': { sx: 0,  sy: 36, w: 26, h: 17, cls: Player },
    'missile': { sx: 0,  sy: 86, w: 3,  h: 14, cls: Missile },
    'scoreboard': { sx: 0,  sy: 86, w: 3,  h: 14, cls: Scoreboard },
  }

  function startGame() {  	
  	socketConnector.socket.on('start_the_game', function(){	
        Manager.loadBoard(new GameBoard(1));    
		}); 	
				
    var screen = new ManageScreen("Space Invaders","(press space to start)",
                                 function(){
                                     Manager.loadBoard(new GameBoard(1));
                                     socketConnector.socket.emit('game_start');
                                 });
    Manager.loadBoard(screen);
    Manager.loop();
  }
  
   function waitGame() {				
    var screen = new ManageScreen("Space Invaders","Waiting for other players!",
                                 function(){});
    Manager.loadBoard(screen);
    Manager.loop();
  }
  
  function endGame() {
    var screen = new ManageScreen("Game Over","(press space to restart)",
                                 function(){
                                     Manager.loadBoard(new GameBoard(1));;
                                 });
    Manager.loadBoard(screen);
  }

  function winGame() {
    var screen = new ManageScreen("You Win!","(press space to restart)",
                                 function(){
                                     Manager.loadBoard(new GameBoard(1));
                                 });
    Manager.loadBoard(screen);
  }
  
  function drawGame() {
    var screen = new ManageScreen("It was a tie!","(press space to restart)",
                                 function(){
                                 		 Manager.loadBoard(new GameBoard(1));
                                 });
    Manager.loadBoard(screen);
  }

  $(function(){
  		Manager.initialize("#playCanvas", levelData, spriteData,
                     { "start": startGame,
                       "dead"  : endGame,
                       "win"  : winGame,
                       "wait" : waitGame,
                       "draw" : drawGame});      
   });


