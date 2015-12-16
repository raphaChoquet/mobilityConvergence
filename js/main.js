function geolocalisation() {
    if ("geolocation" in navigator) {
        var watchID = navigator.geolocation.watchPosition(watchPosition);
    } else {
        alert("Le service de géolocalisation n'est pas disponible sur votre ordinateur.");
    }

    function watchPosition(position) {
        isArrivedInResto(position);
    }

    function round4Digits(number) {
        return Math.round(number * 10000) / 10000;
    }

    function printPosition(position) {
        /*document.getElementById('lat').innerHTML = position.coords.latitude;
        document.getElementById('lng').innerHTML = position.coords.longitude;*/
    }

  function isArrivedInResto(position) {

        var latResto = 48.8656;
        var lngResto = 2.3790;

        var currentLat = round4Digits(position.coords.latitude);
        var currentLng = round4Digits(position.coords.longitude);

        if (latResto === currentLat && lngResto === currentLng) {
            console.log('Tu es arrivé');
        } else {
            console.log('tu n\'es pas arrivé :/ ')
        }
    }
}



//Init Local Forage
localforage.config({
    driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: 'myApp',
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description: 'some description'
});

var meet = localforage.createInstance({
    name: "_meetings"
});

var pubNub = PUBNUB.init({
    publish_key: 'pub-c-9cf9add4-0dbe-4dfb-b9b0-23c0007fab9a',
    subscribe_key: 'sub-c-37c4cafc-a3d9-11e5-9196-02ee2ddab7fe'
});

Parse.initialize("WX10p6tFNHBr9WAiJhRMf18GHKZATrpLsF5mvjUB", "wonBWvqCg9dAzGVSzCHEt9Ry5oPAxPlF5Mpsks1t");
function storeMeeting(date, hour, place,contact,lat,long) {
    var obj = {date: date, hour: hour, place: place, contact: contact,lat:lat,long:long,role:true};
    console.log(obj);
    var random = '' + Math.round(Math.random() * 10000);

    var meetingObject = Parse.Object.extend("Meetings");
    var meetingObject = new meetingObject();

    meet.getItem(random, function (err, value) {
        if (err) {
            console.log('error');
        }
        else {
            if (!!value) {
                console.log('error');
            } else {
                meet.setItem(random,obj, function(err, result) {
                    if(result){
                        meetingObject.save(obj).then(function(object){
                            meet.getItem(random,function(err, value){
                                if(value){
                                    value.idParse = object.id;
                                    meet.setItem(random,value);
                                    pubNub.subscribe({
                                        channel: object.id,
                                        message: function(m){console.log(m)}
                                    });
                                }
                            });

                            $('#dateShowLink').append('<a href="confirmLink.html?' + object.id + '">copie</a>');
                        });
                    }
                });
                showDateCreated();
            }
        }
    });
}


function showDateCreated(){
    $("#newDate").hide();
    $("#dateCreated").show();
}

var coordinates = {};
function initAutocomplete() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var btn = document.getElementById('createRDV');
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(btn);

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    $('#createRDV').click(function (e) {
        e.preventDefault() && e.stopPropagation();
        $('#page-home').hide();
        $('#page-createDate').show();
        $('#address').val(input.value);
        coordinates = markers[0].getPosition();
    });
}

function storeMeetingData(){
    var date = document.getElementById('date').value;
    var hour = document.getElementById('time').value;
    var place = document.getElementById('address').value;
    var contact = document.getElementById('contact').value;

    storeMeeting(date,hour,place,contact,coordinates.lat(), coordinates.lng());
}


$(function(){
    $('#storeMeet').on('click',function(e){
        e.preventDefault() && e.stopPropagation();
        storeMeetingData();
    });
});