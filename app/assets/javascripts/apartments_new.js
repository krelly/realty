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
                zoom: 12,
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
                    defaultMapOptions.center = geoObject.geometry._coordinates
                    myMap = createMap(defaultMapOptions)
                } else {
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
                var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
                // Выводим в цикле список всех геообъектов.
                  `<ul class=list>
                  {% for geoObject in properties.geoObjects %}
                      <li><a href=# data-placemarkid="{{ geoObject.properties.placemarkId }}" class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>
                  {% endfor %}
                  </ul>`);
                objectManager = new ymaps.LoadingObjectManager('/within_box?bounds=%b', {
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 64,
                    clusterDisableClickZoom: true,
                    clusterOpenBalloonOnClick: true,
                    // Устанавливаем режим открытия балуна.
                    // В данном примере балун никогда не будет открываться в режиме панели.
                    clusterBalloonPanelMaxMapArea: 0,
                    // По умолчанию опции балуна balloonMaxWidth и balloonMaxHeight не установлены для кластеризатора,
                    // так как все стандартные макеты имеют определенные размеры.
                    clusterBalloonMaxHeight: 200,
                    // Устанавливаем собственный макет контента балуна.
                    clusterBalloonContentLayout: customBalloonContentLayout
                });

                // Чтобы задать опции одиночным объектам и кластерам,
                // обратимся к дочерним коллекциям ObjectManager.
                objectManager.objects.options.set('preset', 'islands#greenDotIcon');
                objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
                objectManager.objects.events.add('click', function (e) {
                    var objectId = e.get('objectId');
                    loadBalloonData(objectId).then(function (data) {

                        var obj = objectManager.objects.getById(objectId);
                        console.dir(data)
                        obj.properties.balloonContent = `
                        <div class="apartment-card">
                            <div class="photo"><img src="${data.photo}"></div>
                            <a href="/apartments/${data.id}">
                                <div class="title">Квартира, ${data.rooms} ${pluralize(data.rooms,'комната','комнаты','комнат')}, этаж ${data.floor}/${data.total_floors}</div>
                            </a>
                            <div class="description">${data.address}</div>
                            <div class="price">${data.price}$</div>
                        </div>
                        `;
                        objectManager.objects.balloon.open(objectId);
                        // loadBalloonData(objectId).then(function (data) {
                        //
                        // });
                        // if (hasBalloonData(objectId)) {
                        //     objectManager.objects.balloon.open(objectId);
                        // } else {
                        //
                        // }
                    })
                });
                myMap.geoObjects.add(objectManager);
            })
    }
}
function loadBalloonData(id) {
    return fetch(`apartments/${id}.json`).then(res => res.json())
    // return new Promise(function (resolve,reject) {
    //     resolve
    // })
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
    $('.img-preview .preview').hover(function () {
        $(this).append('<div class="remove"></div>')
    }, function () {
        $(this).find('.remove').remove()
    })

    $('.img-preview .preview').on('click', '.remove' ,function () {
        var parent = $(this).parent()
        parent.find('input[type="checkbox"]').prop('checked', true)
        parent.hide()
    })

});
