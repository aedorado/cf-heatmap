function linechart(data) {
	createLCStructure(data);
}

function createLCStructure(data) {
  data = weekifyData(data);
	var margin = {top: 40, right: 40, bottom: 40, left: 40};
	var height = 320 - margin.top - margin.bottom,
		width = 1000 - margin.left - margin.right;

	var linesvg = d3.select("#linechart-div").append('svg').attr("width", margin.right + width + margin.left).attr("height", margin.bottom + height + margin.top);

	var yScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
					         return ((d === undefined) ? 0 : Math.max.apply(null, d));
                })]).range([height, 0]);

  var xScale = d3.scale.linear()
                .domain([0, 53])
                .range([0, width]);

  var vAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
  var hAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(20);

  var hGuide = linesvg.append('g').call(hAxis).attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')');
  hGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
  hGuide.selectAll('line').style({stroke: '#000'});

  var vGuide = linesvg.append('g').call(vAxis).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  vGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
  vGuide.selectAll('line').style({stroke: '#000'});

  lineFunction = d3.svg.line()
                    .x(function(d, i) { return xScale(i); })
                    .y(function(d, i) { return yScale(d); })
                    .interpolate("linear");

  var svgGroup = linesvg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  lineGraph = svgGroup.append("path")
                        // .attr("d", lineFunction()
                        .attr("d", lineFunction(data[Object.keys(data)[0]]))
                        .attr("stroke", "#000")
                        .attr("stroke-width", 3)
                        .attr("fill", "none");
  totalLength = lineGraph.node().getTotalLength();
  totalLength = 4000;

  lineGraph.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease("quad")
        .attr("stroke-dashoffset", 0);

  var ctooltip = d3.select('#linechart-div').append('div')
                  .attr('class', 'tooltip');

  var circles = svgGroup.selectAll("circle")                                    
          .data(data[Object.keys(data)[0]])
          .enter().append("circle")                            
          .attr("r", 4)
          .attr("z-index", 100)
          .attr("cx", function(d, i) { return xScale(i); })
          .attr("cy", function(d, i) { return yScale(d); })// - yScale(d[1] * 100 / (i + 1)); })
          .attr("data-title", function(d, i) { return "Week: " + i + ", Sub: " + d; })
          .style({stroke:'#fff', visbility: 0})
          
  circles.on("mouseover", function(d, i) {
              tooltipLineX = svgGroup.append("line")
                .attr("x1", xScale(i))
                .attr("y1", yScale(d))
                .attr("x2", xScale(0))
                .attr("y2", yScale(d))
                .attr("class", "tooltip-line")
                .attr("stroke", "#1e6823")
                .attr("stroke-width", 1);
              tooltipLineY = svgGroup.append("line")
                .attr("x1", xScale(i))
                .attr("y1", yScale(d))
                .attr("x2", xScale(i))
                .attr("y2", yScale(0))
                .attr("class", "tooltip-line")
                .attr("stroke", "#1e6823")
                .attr("stroke-width", 1);
              if (this.getAttribute('data-title') != null) {

                ctooltip.style('display', 'block');
                ctooltip.html(this.getAttribute('data-title'))
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY) + 'px');
              }
          })
          .on("mouseout", function(d, i) {
            tooltipLineX.remove('tooltipLineX');
            tooltipLineY.remove('tooltipLineY');
          });

    document.getElementById('line-year').addEventListener('change', populateLineChartWithData, false);
    
    function populateLineChartWithData() {
      lineGraph.transition().duration(1200).ease('elastic').attr("d", lineFunction(data[this.value]));
      circles.data(data[parseInt(this.value)]).transition().ease('back').duration(750).delay(function(d, i) { return i * 45; })
              .attr("cy", function(d, i) { return yScale(d); }).attr("data-title", function(d, i) { return "Week: " + i + ", Sub: " + d; });
      ctooltip.style('display', 'none');
  	}

}