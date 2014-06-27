(function () {

var w = 600, h = 800;
var wi = 300, hi = 150;

var proj = d3.geo.mercator()
  .center([128.0, 35.9])
  .scale(6500)
  .translate([w/2, h/2]);

var fill = d3.scale.linear()
             .domain([0, 9.1])
             .range([d3.rgb('#e0ffd4'), d3.rgb('#267114')]);

var path = d3.geo.path().projection(proj);

var $info = $('#info');

var years, unemploymentRates;

var svg = d3.select("#canvas").append("svg")
  .attr("width", w)
  .attr("height", h);

function renderMap(provinces) {
  svg.selectAll('path')
      .data(provinces.features)
    .enter().append('path')
      .attr('class', 'province')
      .attr('id', function (d) { return d.properties.Name; })
      .attr('d', path)
}

function renderLabels(provinces) {
  svg.selectAll("text")
      .data(provinces.features)
    .enter().append("text")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", function(d) {
          // 라벨 위치 보정
          switch (d.properties.Name) {
          case '경기도':
            return '3.25em';
          case '인천광역시':
            return '-.35em';
          case '서울특별시':
            return '.5em';
          }
          return '0';
      })
      .text(function(d) { return d.properties.Name; });
}

function loadRates() {
  var dataUrl = $('link[rel="datasheet"]').attr('href');
  $.getJSON(dataUrl, function (data) {
    years = data.years;
    unemploymentRates = data.items;
    createSlider();
    coloring(years[0]);
  });
}

function createSlider() {
  var slider = d3.slider().axis(true).min(years[0]).max(years[years.length - 1]).step(1);
  slider.on('slide', function (evt, value) {
    coloring(value);
  });
  d3.select('#slider').call(slider);
}

function coloring(year) {
  $.each(unemploymentRates, function (name, rates) {
    var rate = rates[year+''];
    $('#'+name).attr('fill', fill(rate));
  });
}

d3.json("skorea-provinces.topo.json", function(error, kor) {
  var provinces = topojson.feature(kor, kor.objects['skorea-provinces.geo']);
  renderMap(provinces);
  renderLabels(provinces);
  loadRates();
});

}());
