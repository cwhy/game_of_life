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
    ctx.fillStyle = (grid[x][y]) ? 'rgb(236, 84, 94)' : 'rgb(235, 235, 235)';
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
    var n = 0;
    var rangeX = [];
    var rangeY = [];
    rangeX = [x-2, x-1, x, x+1, x+2];
    rangeY = [y-2, y-1, y, y+1, y+2];
    $.each(rangeX, function (ix, vx) {
      $.each(rangeY, function (iy, vy) {
	var px = ((vx % dx) + dx) % dx;
	var py = ((vy % dy) + dy) % dy;
	
	if (!(ix === 2 && iy === 2) && grid[px][py]) {
	  n += 1;
	}
      });
    });
    return n;
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
	grid[x][y] = false;
      }
    }
    refresh();
  };
  that.toggle = function (offset) {
    var x = Math.floor(offset[0] / cw);
    var y = Math.floor(offset[1] / cw);
    grid[x][y] = !grid[x][y];
    draw(x,y);
  };
  that.step = function () {
    var newGrid = $.extend(true, [], grid);
    for (var x = 0; x < dx; x += 1) {
      for (var y = 0; y < dy; y += 1) {
	var n = neighbours(x, y);
	if (n < 5) {
	  newGrid[x][y] = false;
	} else if (n > 16) {
	  newGrid[x][y] = false;
	} else if (!grid[x][y] && n>10 && n<16) {
	  newGrid[x][y] = true;
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
	  grid[x][y] = true;
	} else {
	  grid[x][y] = false;
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


