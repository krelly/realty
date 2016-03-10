$('#new_apartment').ready(function() {

})

function onLoad(ymaps) {
    var opts = {
        provider: 'yandex#map'
    }
    var input = $('#apartment_address')
    var suggestView = new ymaps.SuggestView('apartment_address');
    suggestView.events.add('select', e => {
        var address = e.get('item').value
        input.val(address)
    })
}
