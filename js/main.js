/*if ("geolocation" in navigator) {
    var watchID = navigator.geolocation.watchPosition(watchPosition);
} else {
    alert("Le service de géolocalisation n'est pas disponible sur votre ordinateur.");
}

function watchPosition(position) {

    printPosition(position);
    isArrivedInResto(position);
}


function printPosition(position) {
    document.getElementById('lat').innerHTML = position.coords.latitude;
    document.getElementById('lng').innerHTML = position.coords.longitude;
}

function round4Digits(number) {
    return Math.round(number * 10000) / 10000;
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
}*/


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



//Init Parse
Parse.initialize("WX10p6tFNHBr9WAiJhRMf18GHKZATrpLsF5mvjUB", "wonBWvqCg9dAzGVSzCHEt9Ry5oPAxPlF5Mpsks1t");
function storeMeeting(date, hour, place,contact) {
    var obj = {date: date, hour: hour, place: place, contact: contact};
    var random = '' + Math.round(Math.random() * 10000);

    var meetingObject = Parse.Object.extend("Meetings");
    var meetingObject = new meetingObject();

    meet.getItem(random, function (err, value) {
        if (err) {
            console.log('error');
        }
        else {
            if (!!value) {
            } else {
                meet.setItem(random,obj, function(err, result) {
                    if(result){
                        meetingObject.save(obj).then(function(object){
                            meet.getItem(random,function(err, value){
                                if(value){
                                    value.idParse = object.id;
                                    meet.setItem(random,value);
                                }
                            });
                            $('#dateLink').append('<a href="confirmLink.html?' + object.id +'"> lien</a>');
                        });
                    }
                });
                //showDateCreated();
            }
        }
    });
}

function showPage(){

}

function showDateCreated(){
    $("#newDate").hide();
    $("#dateCreated").show();
}
