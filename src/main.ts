import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import '@geoapify/leaflet-address-search-plugin';
import '@geoapify/leaflet-address-search-plugin/dist/L.Control.GeoapifyAddressSearch.min.css';
import './main.css'

import { exampleLocations } from './exampleLocations'

const map = L.map('map', { zoomControl: false }).setView([53.505, -0.09], 6);
const env = await import.meta.env;
const myAPIKey = env.VITE_GEOAPIFY_API_KEY; // Get an API Key on https://myprojects.geoapify.com
const mapURL = L.Browser.retina
  ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey={apiKey}`
  : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey={apiKey}`;

// Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
L.tileLayer(mapURL, {
  attribution: 'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenMapTiles © OpenStreetMap contributors',
  apiKey: myAPIKey,
  mapStyle: "osm-bright-smooth", // More map styles on https://apidocs.geoapify.com/docs/maps/map-tiles/
  maxZoom: 20
}).addTo(map);


// Cluster group logic start
var markers = L.markerClusterGroup();

exampleLocations.forEach((location) => {
    // console.log(location)
    const title = location.key
    const marker = L.marker(new L.LatLng(location.location.lat, location.location.lng), {
        title: title
      })
    marker.bindPopup(title);

    markers.addLayer(marker);
})

map.addLayer(markers)
// cluster group logic end

// user location logic
map.locate({setView: true, maxZoom: 16});

// @ts-ignore
function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

// @ts-ignore
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

// Add Geoapify Address Search control

// @ts-ignore
const addressSearchControl = L.control.addressSearch(myAPIKey, {
    position: 'topleft',
    // @ts-ignore
    resultCallback: (selectedAddress) => {
      // console.log(selectedAddress);
      if (selectedAddress) {
        map.flyTo([selectedAddress.lat, selectedAddress.lon], 8)
      }
    },
    // @ts-ignore
    suggestionsCallback: (suggestions) => {
      // console.log(suggestions);
    }
  });
  map.addControl(addressSearchControl);
  L.control.zoom({ position: 'bottomright' }).addTo(map);