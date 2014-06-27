(function () {

var w = 600, h = 800;

var proj = d3.geo.mercator()
  .center([128.0, 35.9])
  .scale(6500)
  .translate([w/2, h/2]);

var path = d3.geo.path().projection(proj);

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
      /*
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
      */
      .text(function(d) { return d.properties.Name; });
}

d3.json("skorea-provinces.topo.json", function(error, kor) {
  var provinces = topojson.feature(kor, kor.objects['skorea-provinces.geo']);
  renderMap(provinces);
  renderLabels(provinces);
});

}());
