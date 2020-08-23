// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";
var circles = [];
var magnitudes = [];

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function selectColor(mag){
  var color = "";
  if (mag < 1.0) {
    color = "white";
  }
  else if (mag < 2.5) {
    color = "green";
  }
  else if (mag < 4.5) {
    color = "yellow";
  }
  else if (mag < 6.0) {
    color = "orange"
  }
  else {
    color = "red";
  }

  console.log(color)
  return color
};

function selectSize(mag){
  return mag * 30000
};

// function getColor(mag) {
//   return mag >= 6.0 ? "black" :
//          mag >= 4.5  ? "red" :
//          mag >= 2.5  ? "orange" :
//          mag >= 1.0  ? "yellow" :
//          mag >= 0   ? "green" 
// };

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

    var lat = feature.geometry.coordinates[1];
    var long = feature.geometry.coordinates[0];

    circles.push(
      L.circle([lat, long], {
        stroke: false,
        fillOpacity: 0.75,
        color: "black",
        fillColor: selectColor(feature.properties.mag),
        radius: selectSize(feature.properties.mag)
      })
    )
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  const earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  });  

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellitemap
  };

  var quakeLayer = L.layerGroup(circles);



  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    
    Earthquakes: quakeLayer    
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [streetmap, quakeLayer]
  });

  var legend = L.control({ position: "bottomright" })

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  
  const grades = [0,1,2.5,4.5,6];
  let labels = ['<strong>Earthquake Magnitude</strong>']


  for (var i = 0; i < grades.length; i++) {
        div.innerHTML += 
        labels.push(
            '<li style="background:' + selectColor(grades[i] ) + '">' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1]  : '+' + '</li> ' 
            )) 
          
          }

          div.innerHTML = labels.join('<br>');
  
  return div;
};
// Adding legend to the map
legend.addTo(myMap);

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// Loop through the cities array and create one marker for each city object
// for (var i = 0; i < earthquakes.length; i++) {

//   // Add circles to map
//   L.circle(earthquakes[i].location, {
//     fillOpacity: 0.75,
//     color: "white",
//     fillColor: selectColor(countries[i].points),
//     // Adjust radius
//     radius: setRadius(countries[i].points)
//   }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
// }

// const legend = L.control({ position: "bottomright" })

// legend.onAdd = function() {
//   const div = L.DomUtil.create("div", "info legend");
  
//   const grades = [0,1,2.5,4.5,6,10];
//   // let labels = [];


//   for (var i = 0; i < grades.length; i++) {
//         div.innerHTML += 
//             '<li style="background:' + selectColor(grades[i + 1] ) + '">' +
//             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1]  : '+' + '</li> ' 
//             ) 
          
//           }
  
//   return div;
// };
// // Adding legend to the map
// legend.addTo(myMap);


