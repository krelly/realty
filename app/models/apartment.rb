class Apartment < ActiveRecord::Base
  acts_as_mappable :lat_column_name => :latitude,
                   :lng_column_name => :longitude
  geocoded_by :address
  has_many :apartment_photos, dependent: :destroy
  belongs_to :user

  after_validation :geocode, :if => :address_changed?
  validates :floor, :numericality => { :greater_than_or_equal_to => 1 }
  validates :rooms, :numericality => { :greater_than_or_equal_to => 1 }
  accepts_nested_attributes_for :apartment_photos, :allow_destroy => true
  validates :user_id, presence: true
end
