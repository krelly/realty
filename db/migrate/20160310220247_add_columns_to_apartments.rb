class AddColumnsToApartments < ActiveRecord::Migration
  def change
    add_column :apartments, :address, :string
    add_column :apartments, :total_floors, :integer
    add_column :apartments, :living_area, :decimal, precision: 8, scale: 2
  end
end
