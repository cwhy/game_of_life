// For html and controls only, not the simulation
// Selectively load script
window.onload = function(){
  function loadScript(url, callback)
  {
    // adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // then bind the event to the callback function
    // there are several events for cross browser compatibility
    script.onreadystatechange = callback;
    script.onload = callback;

    // fire the loading
    head.appendChild(script);
  }

  var life = document.location.href.split("#")[1];
  switch(life)
  {
    case "extended":
      loadScript("./life2_extended.js",life2_ui);
      break;
    case "competition":
      loadScript("./life2_competition.js",life2_ui);
      break;
    default:
      loadScript("./life2_original.js",life2_ui);
  }

}


// buttons, sliders
function life2_ui() {
  var e = $('.board canvas');
  var width = e.attr('width');
  var height = e.attr('height');
  var ctx = e.get(0).getContext('2d');
  var board = GOL.board({
    context: ctx,
    width: width,
    height: height,
    dimensions: [100, 75]
  });
  e.click(function (e) {
    var offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
    var offY  = (e.offsetY || e.clientY - $(e.target).offset().top);
    board.toggle([offX, offY]);
    return false;
  });
  $('#step').click(function () {
    board.step();
  });
  $('#clear').click(function () {
    board.clear();
  });
  $('#randomize').click(function () {
    board.randomize();
  });
  $('#run').click(function () {
    if (!board.isRunning()) {
      board.run();
      $(this).find('span').text('Pause');
      $('#step').addClass('deactivated');
    } else {
      board.stop();
      $(this).find('span').text('Run');
      $('#step').removeClass('deactivated');
    }
  });
  $('#slider').slider({
    value: 1500 - board.getSpeed(),
    min: 0,
    max: 1500,
    step: 50,
    slide: function(event, ui) {
      board.setSpeed(1500 - ui.value);
    }
  });
}


