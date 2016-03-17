class AddApartmentIdToApartmentPhotos < ActiveRecord::Migration
  def change
    add_column :apartment_photos, :apartment_id, :integer
  end
end
