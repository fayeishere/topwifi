$(document).foundation()
        getLocation();

            function getLocation() {
                // Not supported with inseure origin
                // if (navigator.geolocation) {
                //     navigator.geolocation.getCurrentPosition(showPosition);
                // } else {
                //     x.innerHTML = "Geolocation is not supported by this browser.";
                // }

                $('#search-form').keypress(function (e) {
                    var key = e.which;
                    if(key == 13)  // the enter key code
                    {
                        runLocation();
                    return false;  
                    }
                });   
                $( "#location" ).click(function() {
                    runLocation();
                });
                function runLocation(){
                    var userLoc = $("#search-form input").val();
                    getCityAPI(userLoc);
                    $( "#title-city" ).text("Top Scores - " + userLoc).css('textTransform', 'capitalize');
                }

            }

            $( ".cities" ).click(function(e) {
                $('#search-form input').val($(this).html());
                $( "#title-city" ).text("Top Scores - " + $(this).html());
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
                $( "#content" ).empty();
                var placesDown = places;
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