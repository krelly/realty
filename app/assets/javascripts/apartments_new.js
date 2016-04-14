$('#new_apartment').ready(function() {

})

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
}

$(() => {

    ymaps.ready(mapReady);
});
