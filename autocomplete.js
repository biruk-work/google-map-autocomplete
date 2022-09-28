function initializeAutocomplete(id) {
  var element = document.getElementById(id);
  if (element) {
    var autocomplete = new google.maps.places.Autocomplete(element, {
      types: ["geocode"],
    });
    google.maps.event.addListener(
      autocomplete,
      "place_changed",
      onPlaceChanged
    );
  }
}

function onPlaceChanged() {
  var place = this.getPlace();

  // console.log(place);  // Uncomment this line to view the full object returned by Google API.

  for (var i in place.address_components) {
    var component = place.address_components[i];
    for (var j in component.types) {
      // Some types are ["country", "political"]
      var type_element = document.getElementById(component.types[j]);
      if (type_element) {
        type_element.value = component.long_name;
      }
    }
  }
}

google.maps.event.addDomListener(window, "load", function () {
  initializeAutocomplete("user_input_autocomplete_address");
});

function initMap() {
  // A couple of places
  var brunchPos = { lat: 8.95997, lng: 38.7119 };
  var faboritPos = { lat: 8.9831, lng: 38.8101 };

  // Create map, draw it in the targetElem and sets the cameraPosition
  var targetElem = document.getElementById("map");
  var cameraPosition = { zoom: 13, center: faboritPos };
  var map = new google.maps.Map(targetElem, cameraPosition);

  // We have already displayed the map, let's add markers

  // Create markers in the map
  var marker1 = new google.maps.Marker({ map: map, position: faboritPos });
  var marker2 = new google.maps.Marker({ map: map, position: brunchPos });

  // Now let's setup the autocomplete input, with which we can add more markers

  // Autocomplete input
  var input = document.getElementById("searchTextField");
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // Listen to autocomplete input
  autocomplete.addListener("place_changed", function () {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert(
        "No details available for input: '" +
          place.name +
          "'. Select one of the results."
      );
      return;
    }

    // Add marker in map
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
    });
  });
}
