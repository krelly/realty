$('#new_apartment').ready(function() {
    var droppedFiles = false;
    // el.addEventListener('')
    $boxUpload = $('.box-upload')
    $boxUpload.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $boxUpload.addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $boxUpload.removeClass('is-dragover');
        })
        .on('drop', e => {
            droppedFiles = e.originalEvent.dataTransfer.files;
            showFiles(droppedFiles, $boxUpload.find('.img-preview'));
        });
    $apartmentImage = $('#apartment-image')
    $apartmentImage.on('change', function(e) {
        var files = this.files
        console.dir(files);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /^image\//;
            if (!imageType.test(file.type)) {
                continue;
            }
            showFile(file, $boxUpload.find('.img-preview'));
        }

        // showFiles(this.files, $boxUpload.find('.img-preview'));
    })
})

function showFile(file, $el) {
    console.log(file);
    console.log(window.URL.createObjectURL(file))
    var img = document.createElement('img');
    img.onload = function() {
        window.URL.revokeObjectURL(this.src);
    };
    img.src = window.URL.createObjectURL(file);
    $el.append(img);
}



var mapReady = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            YmapsReady()
        }
    };
})();





function YmapsReady() {
    if ($(".apartments.new, .apartments.edit").length) {
        var input = $('#apartment_address')
        var suggestView = new ymaps.SuggestView('apartment_address');
        suggestView.events.add('select', e => {
            var address = e.get('item').value
            input.val(address)
        })

    }

    if ($(".apartments.show").length) {
        $map = $("#interactive-map")
        lat = $map.data('latitude')
        lng = $map.data('longitude')
        myMap = new ymaps.Map("interactive-map", {
            center: [lat, lng],
            zoom: 16,
            behaviors: ['default', 'scrollZoom']
        });

        var myPlacemark = new ymaps.Placemark([lat, lng]
            /*, {
                            balloonContentBody: ui.item.label,
                            hintContent: ui.item.label
                        }*/
        );
        myMap.geoObjects.add(myPlacemark);
        // myMap.setCenter([longlat[1], longlat[0]], 13);
    }

    if ($(".apartments.map").length) {

        var myMap,
            defaultMapOptions = {
                center: [55.751574, 37.573856],
                zoom: 11,
                behaviors: ['default', 'scrollZoom']
            },
            createMap = function(options) {
                return new ymaps.Map('map', options);
            },
            onSuccess = function(res) {
                var geoObject = res.geoObjects.get(0),
                    mapOptions = geoObject && {
                        bounds: geoObject.properties.get('boundedBy')
                    };
                if (geoObject) {
                    console.log('point');
                    defaultMapOptions.center = geoObject.geometry._coordinates
                    myMap = createMap(defaultMapOptions)
                } else {
                    console.log('no point');
                    myMap = createMap(mapOptions)
                }
            }
        onError = function(err) {
            console.log(err);
            myMap = createMap(defaultMapOptions);
        }

        ymaps.geolocation.get({
                autoReverseGeocode: true
            })
            .then(onSuccess, onError)
            .then(() => {
                objectManager = new ymaps.LoadingObjectManager('/within_box?bounds=%b', {
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 64
                });

                // Чтобы задать опции одиночным объектам и кластерам,
                // обратимся к дочерним коллекциям ObjectManager.
                objectManager.objects.options.set('preset', 'islands#greenDotIcon');
                objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
                myMap.geoObjects.add(objectManager);


                // showPoints(myMap._bounds, myMap)
                myMap.events.add('click', function(e) {
                    // Географические координаты точки клика можно узнать
                    // посредством вызова .get('coordPosition')
                    var position = e.get('coordPosition');
                    map.geoObjects.add(new ymaps.Placemark(position));
                });
                // myMap.events.add('boundschange', e => showPoints(e.get('newBounds'), myMap))
            })
    }
}

function showPoints(newBounds, myMap) {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/within_box",
        data: {
            sw: newBounds[0],
            ne: newBounds[1]
        },
        success: function(markers) {
            console.dir(markers);
            objectManager.add(markers);
            // points.forEach(point => {
            //     var [lat, lng] = point
            //     console.log(lat, lng);
            //     var myPlacemark = new ymaps.Placemark([lat, lng]
            //         /*, {
            //                         balloonContentBody: ui.item.label,
            //                         hintContent: ui.item.label
            //                     }*/
            //     );
            //     myMap.geoObjects.add(myPlacemark);
            // })
        }
    });
}
$(() => {

    ymaps.ready(mapReady);
});



var data = `{
    "type": "FeatureCollection",
    "features": [
        { "id": 0, "geometry": {"type": "Point", "coordinates": [55.831903, 37.411961]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 1, "geometry": {"type": "Point", "coordinates": [55.763338, 37.565466]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 2, "geometry": {"type": "Point", "coordinates": [55.763338, 37.565466]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 3, "geometry": {"type": "Point", "coordinates": [55.744522, 37.616378]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 4, "geometry": {"type": "Point", "coordinates": [55.780898, 37.642889]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 5, "geometry": {"type": "Point", "coordinates": [55.793559, 37.435983]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 6, "geometry": {"type": "Point", "coordinates": [55.800584, 37.675638]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 7, "geometry": {"type": "Point", "coordinates": [55.716733, 37.589988]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 8, "geometry": {"type": "Point", "coordinates": [55.775724, 37.56084]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 9, "geometry": {"type": "Point", "coordinates": [55.822144, 37.433781]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 10, "geometry": {"type": "Point", "coordinates": [55.87417, 37.669838]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 11, "geometry": {"type": "Point", "coordinates": [55.71677, 37.482338]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 12, "geometry": {"type": "Point", "coordinates": [55.78085, 37.75021]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 13, "geometry": {"type": "Point", "coordinates": [55.810906, 37.654142]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 14, "geometry": {"type": "Point", "coordinates": [55.865386, 37.713329]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 15, "geometry": {"type": "Point", "coordinates": [55.847121, 37.525797]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 16, "geometry": {"type": "Point", "coordinates": [55.778655, 37.710743]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 17, "geometry": {"type": "Point", "coordinates": [55.623415, 37.717934]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 18, "geometry": {"type": "Point", "coordinates": [55.863193, 37.737]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 19, "geometry": {"type": "Point", "coordinates": [55.86677, 37.760113]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 20, "geometry": {"type": "Point", "coordinates": [55.698261, 37.730838]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 21, "geometry": {"type": "Point", "coordinates": [55.6338, 37.564769]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 22, "geometry": {"type": "Point", "coordinates": [55.639996, 37.5394]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 23, "geometry": {"type": "Point", "coordinates": [55.69023, 37.405853]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 24, "geometry": {"type": "Point", "coordinates": [55.77597, 37.5129]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 25, "geometry": {"type": "Point", "coordinates": [55.775777, 37.44218]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 26, "geometry": {"type": "Point", "coordinates": [55.811814, 37.440448]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 27, "geometry": {"type": "Point", "coordinates": [55.751841, 37.404853]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 28, "geometry": {"type": "Point", "coordinates": [55.627303, 37.728976]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 29, "geometry": {"type": "Point", "coordinates": [55.816515, 37.597163]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 30, "geometry": {"type": "Point", "coordinates": [55.664352, 37.689397]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 31, "geometry": {"type": "Point", "coordinates": [55.679195, 37.600961]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 32, "geometry": {"type": "Point", "coordinates": [55.673873, 37.658425]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 33, "geometry": {"type": "Point", "coordinates": [55.681006, 37.605126]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 34, "geometry": {"type": "Point", "coordinates": [55.876327, 37.431744]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 35, "geometry": {"type": "Point", "coordinates": [55.843363, 37.778445]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 36, "geometry": {"type": "Point", "coordinates": [55.875445, 37.549348]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 37, "geometry": {"type": "Point", "coordinates": [55.662903, 37.702087]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 38, "geometry": {"type": "Point", "coordinates": [55.746099, 37.434113]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 39, "geometry": {"type": "Point", "coordinates": [55.83866, 37.712326]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 40, "geometry": {"type": "Point", "coordinates": [55.774838, 37.415725]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 41, "geometry": {"type": "Point", "coordinates": [55.871539, 37.630223]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 42, "geometry": {"type": "Point", "coordinates": [55.657037, 37.571271]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 43, "geometry": {"type": "Point", "coordinates": [55.691046, 37.711026]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 44, "geometry": {"type": "Point", "coordinates": [55.803972, 37.65961]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 45, "geometry": {"type": "Point", "coordinates": [55.616448, 37.452759]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 46, "geometry": {"type": "Point", "coordinates": [55.781329, 37.442781]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 47, "geometry": {"type": "Point", "coordinates": [55.844708, 37.74887]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 48, "geometry": {"type": "Point", "coordinates": [55.723123, 37.406067]}, "properties": {"balloonContent": "Содержимое балуна"}},
        { "id": 49, "geometry": {"type": "Point", "coordinates": [55.858585, 37.48498]}, "properties": {"balloonContent": "Содержимое балуна"}}
    ]
}`
