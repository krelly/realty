class Apartment < ActiveRecord::Base
  geocoded_by :address
  after_validation :geocode, :if => :address_changed?
  validates :floor, :numericality => { :greater_than_or_equal_to => 1 }
  validates :rooms, :numericality => { :greater_than_or_equal_to => 1 }

  has_many :apartment_photos
  accepts_nested_attributes_for :apartment_photos
end
