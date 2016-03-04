class CreateApartments < ActiveRecord::Migration
  def change
    create_table :apartments do |t|
      t.text :description
      t.integer :floor
      t.decimal :price, precision: 8, scale: 2
      t.integer :rooms
      t.decimal :area, precision: 7, scale: 2

      t.timestamps null: false
    end
  end
end
