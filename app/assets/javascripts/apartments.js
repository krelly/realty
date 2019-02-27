$('#new_apartment').ready(function () {
    var droppedFiles = false;

    $boxUpload = $('.box-upload')
    $boxUpload.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function () {
            $boxUpload.addClass('is-dragover');
        })
        .on('dragleave dragend drop', function () {
            $boxUpload.removeClass('is-dragover');
        })
        .on('drop', e => {
            droppedFiles = e.originalEvent.dataTransfer.files;
            showFiles(droppedFiles, $boxUpload.find('.img-preview'));
        });
    $apartmentImage = $('#apartment-image')
    $apartmentImage.on('change', function (e) {
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
    img.onload = function () {
        window.URL.revokeObjectURL(this.src);
    };
    img.src = window.URL.createObjectURL(file);
    $el.append(img);
}


var mapReady = (function () {
    var executed = false;
    return function () {
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
            e.preventDefault();
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

        var myPlacemark = new ymaps.Placemark([lat, lng]);
        myMap.geoObjects.add(myPlacemark);
    }

    if ($(".apartments.map").length) {

        var myMap = new ymaps.Map('map', {
            center: [50.45466, 30.5238],
            zoom: 12,
            behaviors: ['default', 'scrollZoom']
        })

        initObjectManager(myMap)
    }
}

function initObjectManager(myMap) {

    objectManager = new ymaps.LoadingObjectManager('/within_box?bounds=%b', {
        // Чтобы метки начали кластеризоваться, выставляем опцию.
        clusterize: true,
        // ObjectManager принимает те же опции, что и кластеризатор.
        gridSize: 64,
        // Устанавливаем режим открытия балуна.
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // По умолчанию опции балуна balloonMaxWidth и balloonMaxHeight не установлены для кластеризатора,
        // так как все стандартные макеты имеют определенные размеры.
        clusterBalloonMaxHeight: 200,
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
                                <div class="title">Квартира, ${data.rooms} ${pluralize(data.rooms, 'комната', 'комнаты', 'комнат')}, этаж ${data.floor}/${data.total_floors}</div>
                            </a>
                            <div class="description">${data.address}</div>
                            <div class="price">${data.price}$</div>
                        </div>
                        `;
            objectManager.objects.balloon.open(objectId);
        })
    });
    myMap.geoObjects.add(objectManager);
}

function loadBalloonData(id) {
    return fetch(`apartments/${id}.json`).then(res => res.json())
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
        success: function (markers) {
            console.dir(markers);
            objectManager.add(markers);
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

    $('.img-preview .preview').on('click', '.remove', function () {
        var parent = $(this).parent()
        parent.find('input[type="checkbox"]').prop('checked', true)
        parent.hide()
    })
});
