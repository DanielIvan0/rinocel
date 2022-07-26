mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsaXZhbjAiLCJhIjoiY2wxYmdwbG44MGRpMTNkczZpYmczbDh2aCJ9.iBAhaSDz61NtUc5P8c-1sw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-99.90891, 16.84942], // starting position [lng, lat]
    zoom: 10 // starting zoom
});

const marker = new mapboxgl.Marker();