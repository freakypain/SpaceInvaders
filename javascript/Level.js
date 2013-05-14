
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,2,2,0,0,0,0],
          [0,0,0,0,0,1,1,0,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
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
    'missile': { sx: 0,  sy: 86, w: 3,  h: 14, cls: Missile }
  }

  function startGame() {
    var screen = new ManageScreen("Space Invaders","press space to start",
                                 function() {
                                     Manager.loadBoard(new GameBoard(1));
                                 });
    Manager.loadBoard(screen);
    Manager.loop();
  }

  function endGame() {
    var screen = new ManageScreen("Game Over","(press space to restart)",
                                 function() {
                                     Manager.loadBoard(new GameBoard(1));
                                 });
    Manager.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("You Win!","(press space to restart)",
                                 function() {
                                     Manager.loadBoard(new GameBoard(1));
                                 });
    Manager.loadBoard(screen);
  }

  $(function(){
  		Manager.initialize("#playCanvas", levelData, spriteData,
                     { "start": startGame,
                       "dead"  : endGame,
                       "win"  : winGame });      
   });



