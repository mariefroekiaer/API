/*
 * fil: js.js
 * purpose: introdction to jQuery
 */
console.log('file: js/js.js loaded');

// A $( document ).ready() block.
$(document).ready(function () { // kører så snart DOM er klar

    console.log("jQuery 3.5.1 running. Alert level green.");


    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaWVmcm9la2lhZXIiLCJhIjoiY2tmcWtxbWtqMGx1YzJybXQ4aHQzdnl3aiJ9.yHsLtkU7zlsztKl5iNnNsg';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mariefroekiaer/ckfxq55t50hia19qry20hpox7', // style URL
        center: [10.169, 56.322], // starting position [lng, lat]
        zoom: 7, // starting zoom
        pitch: 50,
       
    });


    var size = 200;

    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
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

        // called once before every frame where the icon will be used
        render: function () {
            var duration = 2000;
            var t = (performance.now() % duration) / duration;

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



//flyfuktionen
document.getElementById('fly').addEventListener('click', function () {
        // Fly to a random location by offsetting the point -74.50, 40
        // by up to 5 degrees.
        map.flyTo({
            center: [10.685, 56.200], // starting position [lng, lat]
            zoom: 14.72, // starting zoom
            //pitch: 55,
            //bearing: 45
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    });


    
    
    //openweathermap tilføjes 
    
    //her tilføjes mit eget token
     const token = "59081fac2780a036c37d749973f2e40f"; // save your token in this variable

    //her tilføjes API
        const ebeltoft = " http://api.openweathermap.org/data/2.5/weather?q=Ebeltoft&lang=da&units=metric&appid,DK&appid=" +
            token;



            // get the weather data
            fetch(ebeltoft).then(response => {
                return response.json();
            }).then(data => {

                // Work with JSON data here
                console.log(data); // show what's in the json

                //her tilføjes funktionen append som tilføjer de elementer som kommer efterfølgende
                $('#result').append(
                    
                    //Her tilføjes vejrinformationen
                    '<div class="weatherInfo">' +
                    
                    ' I dag er der ' + 
                    data.weather[0].description +
                    ' i ' + data.name +
                    
                    //Her tilføjes vejrsymbolet
                    '<figure><img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="The weather : ' 
                    
                    + data.weather[0].main +
                    '"></figure>' +
                    
                    '</div>');
                

                // here are the icons: https://openweathermap.org/weather-conditions 

            }).catch(err => {
                // Do something for an error here
                console.log('There was an error ...');
            });

      
    

}); // denne line må ikke slettes
