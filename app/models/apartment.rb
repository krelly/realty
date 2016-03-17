class Apartment < ActiveRecord::Base
  geocoded_by :address
  after_validation :geocode, :if => :address_changed?

  has_many :apartment_photos
  accepts_nested_attributes_for :apartment_photos
end
