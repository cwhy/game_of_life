var GOL = {};

GOL.board = function (spec) {
  var that = {};

  // private vars
  var h = spec.height;
  var w = spec.width;
  var dx = spec.dimensions[0];
  var dy = spec.dimensions[1];
  var grid = [];
  var ctx = spec.context;
  var cw = w / dx; // single cell width
  var ch = h / dy; // single cell height
  var running = false;
  var speed = 250;

  // private functions
  var draw = function(x,y){
    var padding = 1;
    switch(grid[x][y])
    {
      case 2:
	// ctx.fillStyle = 'rgb(90, 133, 255)'; 
	// ctx.fillStyle = 'rgb(0, 204, 119)'; 
	ctx.fillStyle = 'rgb(102, 238, 187)'; 
	break;
      case 1:
	ctx.fillStyle = 'rgb(236, 84, 94)'; 
	break;
      default:
	ctx.fillStyle = 'rgb(235, 235, 235)';
    }
    ctx.fillRect(
	x * cw + padding,
	y * ch + padding,
	cw - padding * 2,
	ch - padding * 2
	);
  };
  var refresh = function () {
    for (var x = 0; x < dx; x += 1) {
      for (var y = 0; y < dy; y += 1) {
	draw(x,y);
      }
    }
  };
  var neighbours = function (x, y) {
    var n1 = 0;
    var n2 = 0;
    var rangeX = [];
    var rangeY = [];
    rangeX = [x-1, x, x+1];
    rangeY = [y-1, y, y+1];
    $.each(rangeX, function (ix, vx) {
      $.each(rangeY, function (iy, vy) {
	var px = ((vx % dx) + dx) % dx;
	var py = ((vy % dy) + dy) % dy;
	if (!(ix === 1 && iy === 1)){
	  if(grid[px][py] === 1) {
	    n1 += 1;
	  }
	  else if(grid[px][py] === 2) {
	    n2 += 1;
	  }
	}
      });
    });
    return [n1+n2,n1,n2];
  };
  var run = function () {
    if (running) {
      that.step();
      setTimeout(run, speed);
    }
  };

  // public functions
  that.clear = function () {
    for (var x = 0; x < dx; x += 1) {
      grid[x] = [];
      for (var y = 0; y < dy; y += 1) {
	grid[x][y] = 0;
      }
    }
    refresh();
  };
  that.toggle = function (offset) {
    var x = Math.floor(offset[0] / cw);
    var y = Math.floor(offset[1] / cw);
    grid[x][y] = (grid[x][y]+1)%3;
    draw(x,y);
  };
  that.step = function () {
    var newGrid =  $.extend(true, [], grid);
    for (var x = 0; x < dx; x += 1) {
      for (var y = 0; y < dy; y += 1) {
	var n = neighbours(x, y);
	if (grid[x][y] === 1 && (n[1]<2 || n[2]>2 || n[1]>4)) {
	  newGrid[x][y] = 0;
	}
	else if (grid[x][y] === 2 && (n[2]<2 || n[1]>2 || n[2]>4)) {
	  newGrid[x][y] = 0;
	}
	else if (grid[x][y] === 0 && n[0]>2){
	  if (n[1]>n[2] && n[1]<5) {
	    newGrid[x][y] = 1;
	  }
	  else if (n[2]>n[1] && n[2]<5) {
	    newGrid[x][y] = 2;
	  }
	}
      }
    }
    grid = newGrid;
    refresh();
  };
  that.randomize = function () {
    for (var x = 0; x < dx; x += 1) {
      grid[x] = [];
      for (var y = 0; y < dy; y += 1) {
	if (Math.random() >= 0.75) {
	  if (Math.random() >= 0.5) {
	    grid[x][y] = 2;
	  }
	  else{
	    grid[x][y] = 1;
	  }
	} else {
	  grid[x][y] = 0;
	}
      }
    }
    refresh();
  };
  that.run = function () {
    running = true;
    run();
  };
  that.stop = function () {
    running = false;
  };
  that.isRunning = function () {
    return running;
  };
  that.setSpeed = function (ms) {
    speed = ms;
  };
  that.getSpeed = function () {
    return speed;
  };

  // init grid
  that.clear();

  return that;
};


