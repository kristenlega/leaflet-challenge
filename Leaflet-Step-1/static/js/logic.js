var myMap = L.map("mapid", {
    center: [37.7749, -122.4194],
    zoom: 5
  });

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
  d3.json(url).then(function(data) {
  
    // console.log(data);
  
    var coordinates = [];
    var cityNames = [];
    var magnitudes = [];
    var depths = [];
    var element = data.features;

    element.forEach(function(location) {
        var geometry = location.geometry;
        coordinates.push([geometry.coordinates[1], geometry.coordinates[0]]);
        cityNames.push(location.properties.title);
        magnitudes.push(location.properties.mag);
        depths.push(geometry.coordinates[2]);

    })
    
    // console.log(coordinates)
    // console.log(cityNames)


    for (var i = 0; i < coordinates.length; i++) {
    var coordinate = coordinates[i];
    var cityName = cityNames[i];
    var magnitude = magnitudes[i];
    var depth = depths[i];

    function getColor(depth) {
        switch (true) {
        case depth > 90:
            return "#FF6133";
        case depth > 70:
            return "#FF9033";
        case depth > 50:
            return "#FFCE33";
        case depth > 30:
            return "#FFEC33";
        case depth > 10:
            return "#ACFF33";
        case depth > -10:
            return "#58FF33";
        default: 
            return "#58FF33";
        }}

    L.circleMarker(coordinate,{
        color: "gray",
        weight: 2,
        fillColor: getColor(depth),
        fillOpacity: 0.75,
        radius: (magnitude*10)
      })
        .bindPopup(cityName)
        .addTo(myMap);
    };

    // Citation: https://leafletjs.com/examples/choropleth/
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90]
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

  });
  