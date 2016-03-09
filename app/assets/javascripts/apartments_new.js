$('#new_apartment').ready(function() {
    $('#address').geocomplete({details:'#address-details',detailsAttribute: "data-geo"});
})
