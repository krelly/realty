task :sample_data => :environment do
  require 'populator'
  require 'faker'
end

namespace :db do

  desc "Fill database with sample data"
  task :populate => :environment do
    ActiveRecord::Base.transaction do
    10_000.times do |a|
      floor = 1+rand(10)
      price = 1+rand(1000)
      rooms = 1+rand(10)
      latitude = Faker::Address.latitude
      longitude = Faker::Address.longitude
      Apartment.create!(floor: floor,
                      price:price,
                      rooms:rooms,
                      latitude:latitude,
                      longitude:longitude)


    end
  end
  end
end
