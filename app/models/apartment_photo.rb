class ApartmentPhoto < ActiveRecord::Base
  #TODO resizing (thum,big)
  #TODO removing in edit form
  #TODO simplify (remove this table and use array or ?)
  mount_uploader :photo, ImageUploader
  belongs_to :apartment
end
