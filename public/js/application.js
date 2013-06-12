
function Player(name, keycode) {
  this.name = name;
  this.position = 0;
  this.keycode = keycode;
  // this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
}

Player.prototype.advance = function() {
    return ++this.position;  
}


function DOMRenderer() {

  this.renderBoard = function(players, trackLength) {
    var that = this;
    players.forEach(function(player) {
      $('.racer_table').append(that.renderLane(player, trackLength));
      $('#' + player.name).css('background-color', player.color);
    });
  }

  this.renderLane = function(player, trackLength){
    var track = '<tr id="' + player.name + '"><td class="active">';
    for (var i = 0; i < trackLength; i++){
        track = track + "<td></td>";
    }
    track = track + "</tr>";
    return track;
  }

  this.renderPosition = function(players) {
    this.players = players;
    this.players.forEach(function(player) {
      $('#' + player.name).find('.active').removeClass('active');
      $('#' + player.name + ' td:nth-child(' + (player.position+1) + ')').addClass('active');
    });
  }
}


function Game(players, length, renderer) {

  this.players = players;
  this.length = length;
  this.renderer = renderer;
  this.game_id;

  // create the game
  this.create = function(){
    var playerData = {};
    this.players.forEach(function(player,i) {
      playerData["player" + i] = player.name;
    });

    this.renderer.renderBoard(this.players, this.length)

    var that = this;
    $.ajax({ method: 'post', url: '/game', data: playerData
      }).done(function(game_id){
        that.game_id = game_id;
        console.log(game_id);
    });
  }

  // play the game
  this.play = function(keyPressed){
    var that = this;
    this.players.forEach(function(player){
      switch(keyPressed) {
        case player.keycode:
          that.checkWinner(player);
          that.renderer.renderPosition(that.players);
          break;
      }
    });
  }

  // check the winner
  this.checkWinner = function(player){
    var position = player.advance();

    if (position == this.length) {
      this.finish(player.name);
      $(document).unbind('keyup');
    }
  }

  // finish the game
  this.finish = function(winner){
    var that = this;
    $('#gamedata').append('The winner is ' + winner + '!');
    $.ajax({
        method: 'post',
        url: '/game/update',
        data: {'winner': winner, 'gameid': this.game_id, 'time': 'fake time'}
      }).done(function(response){
          console.log(response);
        });
    }
}

//  READ THE FORM AND CREATE THE GAME

$(document).ready(function(){
  $('#add_player').on('click', function(){
      $('#player_names').append('<input class="player_name" type="text" placeholder="Player Name">');
  });

  var players = [];
  var game;

  $('#submit_count').on('click', function(){
    $('.player_name').each(function(i){
      players.push( new Player($(this).val(),i.toString().charCodeAt()));
    });
    var trackLength = $('#board_length').val();
    
    board = new DOMRenderer();
    game = new Game(players, trackLength, board);
    game.create();

    $(document).on('keyup', function(e){
      game.play(e.which)
    });
  });
});
