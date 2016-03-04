json.array!(@apartments) do |apartment|
  json.extract! apartment, :id, :description, :floor, :price, :rooms, :area
  json.url apartment_url(apartment, format: :json)
end
