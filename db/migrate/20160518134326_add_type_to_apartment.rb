class AddTypeToApartment < ActiveRecord::Migration
  def change
    add_column :apartments, :apartment_type, :integer
  end
end
