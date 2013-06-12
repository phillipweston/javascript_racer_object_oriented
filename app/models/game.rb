class Game < ActiveRecord::Base
  has_many :games_users
  has_many :users, :through => :games_users 
  validate :two_players?

  def two_players?
    self.users.length == 2
  end

end
