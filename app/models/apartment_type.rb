class ApartmentType < ActiveRecord::Base
  has_many :apartments
end
