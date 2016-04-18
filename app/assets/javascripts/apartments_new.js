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
            console.log('---');
            YmapsReady()
        }
    };
})();





function YmapsReady() {
    console.log('calll me');
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
        myMap = new ymaps.Map("map", {
            center: [55.76, 37.64], // Москва
            zoom: 10,
            behaviors: ['default', 'scrollZoom']
        });
        console.dir(myMap)
        showPoints(myMap._bounds)
        myMap.events.add('click', function(e) {
            // Географические координаты точки клика можно узнать
            // посредством вызова .get('coordPosition')
            var position = e.get('coordPosition');
            map.geoObjects.add(new ymaps.Placemark(position));
        });
        myMap.events.add('boundschange', e => showPoints(e.get('newBounds')) )
    }
}
function showPoints(newBounds) {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/within_box",
        data: {
            sw: newBounds[0],
            ne: newBounds[1]
        },
        success: function(points) {
            points.forEach(point => {
                var [lat,lng] = point
                console.log(lat,lng);
                var myPlacemark = new ymaps.Placemark([lat, lng]
                    /*, {
                                    balloonContentBody: ui.item.label,
                                    hintContent: ui.item.label
                                }*/
                );
                myMap.geoObjects.add(myPlacemark);
            })
        }
    });
}
$(() => {

    ymaps.ready(mapReady);
});
