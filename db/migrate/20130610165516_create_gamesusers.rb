class CreateGamesusers < ActiveRecord::Migration
  def change
    create_table  :games_users do |t|
      t.references :game
      t.references :user 
    end

    add_index :games_users, [:game_id, :user_id], :unique => true

  end
end
