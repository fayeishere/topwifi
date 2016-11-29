$(document).foundation()
        getLocation();

            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    x.innerHTML = "Geolocation is not supported by this browser.";
                }
            }
            function showPosition(position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                // latitude = 47.0425;
                // longitude = -122.8931;
                // // atlanta
                // latitude = 33.7550;
                // longitude = -84.3900;


                getCity(latitude, longitude);
            }

            function getCity(latitude, longitude){

                var url = "http://api.workfrom.co/places/ll/" + latitude + "," + longitude + "?appid=fayerocks";
                $.getJSON( url, function( data ) {
                    // console.log(data.response[0].alcohol);
                    parseJson(data);

                });
                // Be cool to allow user to toggle upload/download
                function parseJson(data){
                    var places = data.response;
                    if(places.length == 0){
                        var geocoder = new google.maps.Geocoder;

                        var latlng = {lat: latitude, lng: longitude};
                          geocoder.geocode({'location': latlng}, function(results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                              if (results[3]) {
                                // console.log(results[3].address_components[1].long_name);
                                var city = results[3].address_components[1].long_name;
                                getCityAPI(city);
                              } else {
                                window.alert('No results found in your area. Check out workfrom.co to add your favorite work spot to this list.');
                              }
                            } else {
                              window.alert('Geocoder failed due to: ' + status);
                            }
                          });
                    }
                    else{
                        reorder(places);
                    }


     
                }
                $( ".cities" ).click(function(e) {
                    $( "#content" ).empty();
                    getCityAPI($(this).html());
                });
                function getCityAPI(city){
                    var cityUrl = "http://api.workfrom.co/places/city/" + city + "?appid=fayerocks";
                    $.getJSON( cityUrl, function( data ) {
                        cityPlaces = data.response;
                        if(cityPlaces.length == 0){
                            window.alert('Sorry, no results found in ' + city + 'Check out workfrom.co to add your favorite work spot to this list.');
                        }
                        else{
                            reorder(cityPlaces);
                        }
                    });
                }
                function reorder(places){
                    var placesDown = places;
                    var placesUp = places;
                    placesDown.sort(function(a, b){return b.download-a.download});
                    var rank = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];


                    // hard code 10 slots
                    var restrict = 10;
                    for (i = 0; (i < restrict) & (i < places.length); i++) {
                        var rankLow = rank[i].toLowerCase();
                        if(placesDown[i].download > 5){
                            $( "#content" ).append( '<div id=' + rankLow + '><div class="player">' + rank[i] + '</div><div class="player">' + placesDown[i].download + '</div><div class="player"><a href="https://workfrom.co/' + placesDown[i].slug + '">' + placesDown[i].title + '</a></div></div>' );
                        }

                    }
                }
            }