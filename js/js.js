/*
 * fil: js.js
 * purpose: introdction to jQuery
 */
console.log('file: js/js.js loaded');

// A $( document ).ready() block.
$(document).ready(function () { // kører så snart DOM er klar

    console.log("jQuery 3.5.1 running. Alert level green.");


    //her tilføjes mit kort, men den styling jeg har lavet 
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWVmcm9la2lhZXIiLCJhIjoiY2tmcWtxbWtqMGx1YzJybXQ4aHQzdnl3aiJ9.yHsLtkU7zlsztKl5iNnNsg';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mariefroekiaer/ckfxq55t50hia19qry20hpox7', // style URL
        center: [10.169, 56.322], // starting position [lng, lat]
        zoom: 7, // starting zoom
        pitch: 50,

    });


    var size = 200;

    // her tilføjes en markør på Ebeltoft (pulsing dot)
    var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // get rendering context for the map canvas when layer is added to the map
        onAdd: function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        // Her sættes hastigheden på markøren til 2000 mili sekunder
        render: function () {
            var duration = 2000;
            var t = (performance.now() % duration) / duration;

            //her sættes størrelsen på  markøren + ringen omkring makøren (som bevæger sig)
            var radius = (size / 2) * 0.2;
            var outerRadius = (size / 2) * 0.5 * t + radius;
            var context = this.context;

            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );

            //her tilføjes farven på 
            context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fill();

            // draw inner circle
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            context.fillStyle = '#CC0000';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // update this image's data with data from the canvas
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;

            // continuously repaint the map, resulting in the smooth animation of the dot
            map.triggerRepaint();

            // return `true` to let the map know that the image was updated
            return true;
        }
    };

    map.on('load', function () {
        map.addImage('pulsing-dot', pulsingDot, {
            pixelRatio: 2
        });

        map.addSource('points', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [{
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [10.685, 56.200]
                    }
                    }]
            }
        });
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
                'icon-image': 'pulsing-dot'
            }
        });
    });



    //Her tilføjes flyfuktionen - jeg bruger getElementById til at finde den kanp i HTML som skal reagere på eventListener - jeg tilføjer en eventListener med fuktionen click

    document.getElementById('fly').addEventListener('click', function () {
        
        map.flyTo({
            center: [10.685, 56.200], // her tilføjes koordinater for Ebeltoft[lng, lat]
            zoom: 14.72, // starting zoom
            essential: true 
        });
    });



    //Openweathermap tilføjes 

    //her tilføjes mit eget token
    const token = "59081fac2780a036c37d749973f2e40f"; // save your token in this variable

    //her tilføjes API med byen Ebeltoft + sprog og enhed
    const ebeltoft = " http://api.openweathermap.org/data/2.5/weather?q=Ebeltoft,DK&lang=da&units=metric&appid=" +
        token;


    // get the weather data
    fetch(ebeltoft).then(response => {
        return response.json();
    }).then(data => {

        // solnedgang
        var sunsetMs = data.sys.sunset * 1000; // dato-objektet har brug for millisek. Derfor * 1000
        var sunset = new Date(sunsetMs);

        // Datoformattering @URI < https://www.w3schools.com/js/js_date_methods.asp >
        var sunsetTime = sunset.getHours() + ":" + sunset.getMinutes();


        //her tilføjes funktionen append som tilføjer de elementer som kommer efterfølgende med id="result"
        $('#result').append(

            //Her tilføjes en div vejrinformationen
            '<div class="weatherInfo">' +

            ' I dag er der ' +

            //her tilføjes beskrivelsen
            data.weather[0].description +


            ' i ' +

            //Her tilføjes bynavn
            data.name +

            //Her tilføjes vejrsymbolet
            '<figure><img src="http://openweathermap.org/img/w/' +

            data.weather[0].icon +
            '.png" alt="The weather : ' + data.weather[0].main + '"></figure>' +



            // afslutter #weatherInfo taggen
            '</div>');


        //her tilføjes funktionen append som tilføjer de elementer som kommer efterfølgende med id="sunset"
        $('#sunset').append(

            '<div>' +
            //her tilføjes klokkeslet for solnedgang 
            '<p> Oplev solnedgang I Ebeltoft klokken ' +
            sunsetTime + '</p>' +

            '</div>');

    }).catch(err => {
        // Do something for an error here
        console.log('There was an error ...');
    });




}); // denne line må ikke slettes
