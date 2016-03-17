class CreateApartmentPhotos < ActiveRecord::Migration
  def change
    create_table :apartment_photos do |t|
      t.string :photo

      t.timestamps null: false
    end
  end
end
