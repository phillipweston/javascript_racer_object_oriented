class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string  :url
      t.string  :time
      t.integer :winner_id
      t.timestamps
    end
  end
end
