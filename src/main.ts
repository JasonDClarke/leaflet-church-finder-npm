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
  ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`
  : `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=${myAPIKey}`;

// Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
L.tileLayer(mapURL, {
  attribution: 'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenMapTiles © OpenStreetMap contributors',
  // @ts-ignore
  apiKey: myAPIKey,
  mapStyle: "osm-bright-smooth", // More map styles on https://apidocs.geoapify.com/docs/maps/map-tiles/
  maxZoom: 20
}).addTo(map);


// Cluster group logic start
var markers = L.markerClusterGroup({showCoverageOnHover: false, removeOutsideVisibleBounds: true});

// custom Icon
const markerIcon = L.icon({
  iconUrl: `/mappinyellow.svg`,
  iconSize: [31, 46], // size of the icon
  iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
});



exampleLocations.forEach((location) => {
    // console.log(location)
    const detailsPopup = L.popup().setContent(`<h2>${location['Church or Organisation']}</h2><p>${location['Church Address']}</p><p>${location['Location / City']}</p><p>${location['Church Postcode / ZIP Code']}</p><a href="${location['Church Website URL']}"><img src="./url.svg" />${location['Church Website URL']}</a><p><img src="./phone.svg" />${location['Church Contact number / email']}</p><p><img src="./church.svg" />${location['Church Denomination']}</p>`)
    const marker = L.marker(new L.LatLng(location.lat, location.lng), {
        title: location['Church or Organisation'],
        icon: markerIcon
      })
    marker.bindPopup(detailsPopup);

    markers.addLayer(marker);
})

map.addLayer(markers)
// cluster group logic end

// user location logic
// map.locate({setView: true, maxZoom: 16});

// @ts-ignore
// function onLocationFound(e) {
//     var radius = e.accuracy;

//     L.marker(e.latlng, {icon: markerIcon}).addTo(map)
//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

//     L.circle(e.latlng, radius).addTo(map);
// }

// map.on('locationfound', onLocationFound);

// // @ts-ignore
// function onLocationError(e) {
//     alert(e.message);
// }

// map.on('locationerror', onLocationError);

// Add Geoapify Address Search control

// @ts-ignore
const addressSearchControl = L.control.addressSearch(myAPIKey, {
    position: 'topleft',
    mapViewBias: true,
    className: 'geoapify-control',
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