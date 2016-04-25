class AddIndexToAppartmentsLatitudeLongitude < ActiveRecord::Migration
  def change
    add_index :apartments, [:latitude, :longitude]
  end
end
