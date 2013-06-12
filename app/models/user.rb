class User < ActiveRecord::Base
  has_many :games_users
  has_many :games, :through => :games_users

  # Remember to create a migration!
end
