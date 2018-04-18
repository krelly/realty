# README
Application uses Yandex maps API, so make sure if its not blocked in your country 

### Requirements
These are required to run it as Docker containers:
 - docker
 - docker-compose

### Run it with docker compose:
`docker-compose up`

`docker-compose run web rake db:create db:migrate`

What is currently done:
- Server-side geocoding by address
- Address autocomplete in browser when creating apartment
- Image upload and deletion on edit/destroy actions(carrierwave)
- Marker clustering (Yandex Maps ObjectManager)
- Markers is loaded only for visible part of the map + dynamically updated on zoom
