function playGame(keypress) {
    var player1 = $('tr').first().attr('id');
    var player2 = $('tr').last().attr('id');
    
    switch(keypress) {
      case 65:
        checkWinner(player1);
        break;
      case 66:
        checkWinner(player2);
        break;
    }
}

function checkWinner(player) {
  var playerLocation = advancePlayer(player);

  switch(playerLocation) {
    case 1:
      startTime = new Date();
      console.log(startTime);
      break;
    case 17:
      var endTime = new Date();
      var elapsed = (endTime.getTime() - startTime.getTime())/1000;
      console.log(elapsed)
      $(document).unbind('keyup');
      printWinner(player, elapsed);

  }
}

function advancePlayer(player){
  player = '#' + player + ' .active';
  $(player).removeClass('active').next().addClass('active');
  return $(player).index();
}

function printWinner(player, elapsed) {

  $('#gamedata').append('<input type="hidden" name="elapsed" value="' + elapsed + '">');
  $('#gamedata').append('<input type="hidden" name="winner" value="' + player + '">');

  $.ajax({
    type: 'post',
    url: '/game/update',
    data: $('#gamedata').serialize()
  }).done(function(response) {
    $('#winner').html('The winner is ' + response['winner'] + ' in ' + response['time'] + ' seconds!');
    $('#winner').append('Your URL is http://localhost:9393/' + response['url']);
  })
}


$(document).ready(function() {

  

  var startTime;

  $(document).on('keyup', function(event) {
    playGame(event['which']);
  });
});
