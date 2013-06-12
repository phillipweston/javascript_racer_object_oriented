require 'securerandom'

get '/' do
  erb :index
end

post '/game' do
  content_type 'json'

  @game = Game.create
  params.values.each do |player|
    @game.users << User.find_or_create_by_name(player)
  end
  @game.id.to_json
end

post '/game/update' do
  content_type 'json'

  winner = User.find_by_name(params[:winner])
  game = Game.find(params[:gameid])
  url = SecureRandom.hex(13)

  game.update_attributes(winner_id: winner.id, time: params[:elapsed], url: url)

  { winner: winner.name, url: url, time: game.time }.to_json
end


get '/game/:url' do
  @game = Game.find_by_url(params[:url])
  @user = User.find(@game.winner_id)
  erb :stats
end
