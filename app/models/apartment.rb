class Apartment < ActiveRecord::Base
  # TODO dont use enums for apartment_type (single table inheritanse or separate table ?)
  # http://www.justinweiss.com/articles/creating-easy-readable-attributes-with-activerecord-enums/
  # http://lindsaar.net/2008/3/12/multi-table-inheritance-in-rails-when-two-tables-are-one
  # http://hakunin.com/mti
  # http://eewang.github.io/blog/2013/03/12/how-and-when-to-use-single-table-inheritance-in-rails/
  # https://about.futurelearn.com/blog/refactoring-rails-sti/
  enum apartment_type: [ :buy, :rent]
  acts_as_mappable :lat_column_name => :latitude,
                   :lng_column_name => :longitude
  geocoded_by :address
  has_many :apartment_photos, dependent: :destroy
  belongs_to :user

  after_validation :geocode, :if => :address_changed?
  validates :floor, :numericality => { :greater_than_or_equal_to => 1 }
  validates :rooms, :numericality => { :greater_than_or_equal_to => 1 }
  accepts_nested_attributes_for :apartment_photos, allow_destroy: true
  validates_presence_of :total_floors, :address
end
