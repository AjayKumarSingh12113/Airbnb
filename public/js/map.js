// console.log(mapToken); // Debug — should print token

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12', // ✅ valid style
  projection: 'globe',                         // works with v12
  center: listing.geometry.coordinates,                  // Delhi
  zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

map.on('style.load', () => {
  map.setFog({}); // nice atmospheric effect
});


//console.log(coordinates); // Debug — should print coordinates array
const marker = new mapboxgl.Marker({color: 'red'})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4><p>Location will provide after booking</p>`))
  .addTo(map);