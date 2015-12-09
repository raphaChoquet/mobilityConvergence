if ("geolocation" in navigator) {
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
        console.log('tu n\'est pas arrivé :/ ')
    }
}
localforage.config({
    driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name        : 'myApp',
    version     : 1.0,
    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
    description : 'some description'
});
var meet = localforage.createInstance({
    name: "_meetings"
});

function testLocalForage(){
    var obj = { value: "hello world" };
    meet.setItem('localforage', obj, function(err, result) { console.log(result.value); });
}
function storeMeeting(date,hour,place){
        var obj = {date : date,hour:hour,place : place};
        var random = Math.round(Math.random()*1000);
       meet.setItem(random,obj, function(err, result) { console.log(result.value); });
}
