// Instantiate the map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-73.59009, 40.75189],
    zoom: 9.53
});

map.on('load', () => {
    // Add a GeoJSON source containing the data
    map.addSource('nassauCounty', {
        'type': 'geojson',
        'data': '/update-assignment-4/data/Nassau_County_2022.geojson'
    });

    // Define the layer for the polygons with manually assigned fill colors
    map.addLayer({
        'id': 'nassauCountyPolygons',
        'type': 'fill',
        'source': 'nassauCounty',
        'paint': {
            'fill-color': [
                'match',
                ['get', 'NAME'],  // Ensure this matches the property in your GeoJSON
                'Freeport', '#fde0e0',  // Very light red
                'Valley Stream', '#faccce',  // Lighter red
                'Lynbrook', '#f7b9bd',  // Light red
                'Hempstead', '#f3a5ab',  // Moderate light red
                'Levittown', '#f0929a',  // Medium red
                'Westbury', '#ec7e88',  // Medium dark red
                'Massapequa', '#e96b76',  // Darker red
                'Glen Cove', '#e55765',  // Deep red
                'Oyster Bay', '#e14453',  // Deeper red
                'Mineola', '#dd3142',  // Very deep red
                'Long Beach', '#d91d30',  // Nearly darkest red
                'Rockville Centre', '#d50a1f',  // Darker red
                'Garden City', '#d00000',  // Darkest red
                '#ccc'  // Default color if no match is found
            ],
            'fill-opacity': 0.6
        }
    });

    // Add a black outline around the polygons for better visibility
    map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'nassauCounty',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1.5
        }
    });

    // Event listener for clicks on the map within the polygon layer to show popups with city names and market prices
    map.on('click', 'nassauCountyPolygons', function(e) {
        if (e.features.length > 0) {
            const feature = e.features[0];
            const cityName = feature.properties.NAME;

            // Data object with city names and prices
            const cityData = {
                'Valley Stream': '$597,000',
                'Westbury': '$668,618',
                'Hempstead': '$620,000',
                'Long Beach': '$840,636',
                'Freeport': '$564,325',
                'Garden City': '$1,176,125',
                'Lynbrook': '$614,144',
                'Glen Cove': '$710,078',
                'Mineola': '$761,240',
                'Hicksville': '$683,466',
                'Levittown': '$632,027',
                'Massapequa': '$704,137',
                'Oyster Bay': '$760,950',
                'Rockville Centre': '$881,623'
            };

            const popupContent = `<h3>${cityName}</h3><p>Market Price 2022: ${cityData[cityName]}</p>`;

            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(popupContent)
                .addTo(map);

          // Calculate the centroid of the clicked polygon to use as the center for zooming
          const centroid = turf.centroid(feature);
          map.flyTo({
              center: centroid.geometry.coordinates,
              zoom: 13
          });    
                
        }
    });



    
    // Change cursor to pointer on hover over the polygons
    map.on('mouseenter', 'nassauCountyPolygons', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Reset cursor on mouse leave
    map.on('mouseleave', 'nassauCountyPolygons', function() {
        map.getCanvas().style.cursor = '';
    });
});


