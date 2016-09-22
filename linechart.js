// createLCStructure();

function linechart(data) {
	createLCStructure(data);
	// console.log(weeklyData);
}

function createLCStructure(data) {

  data = weekifyData(data);
  console.log(data);
	var margin = {top: 40, right: 40, bottom: 40, left: 40};
	var height = 320 - margin.top - margin.bottom,
		width = 1000 - margin.left - margin.right;

	var svgContainer = d3.select("#linechart-div").append('svg').attr("width", margin.right + width + margin.left).attr("height", margin.bottom + height + margin.top);

	// console.log();

	var yScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
					         return ((d === undefined) ? 0 : Math.max.apply(null, d));
                })]).range([height, 0]);

  	var xScale = d3.scale.linear()
                .domain([0, 54])
                .range([0, width]);

    var vAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
    var hAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(20);

    var hGuide = svgContainer.append('g').call(hAxis).attr('id', 'x-axis').attr('transform', 'translate(' + margin.left + ',' + (margin.top + height) + ')');
    hGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
    hGuide.selectAll('line').style({stroke: '#000'});

    var vGuide = svgContainer.append('g').call(vAxis).attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    vGuide.selectAll('path').style({fill: 'none', stroke: '#000'})
    vGuide.selectAll('line').style({stroke: '#000'});

    lineFunction = d3.svg.line()
                    .x(function(d, i) { console.log(i, d);return xScale(i); })
                    .y(function(d, i) { return yScale(d); })
                    .interpolate("linear");

    var svgGroup = svgContainer.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    						
    lineGraph = svgGroup.append("path")
                        .attr("d", lineFunction(data[new Date().getUTCFullYear()]))
                        .attr("stroke", "#000")
                        .attr("stroke-width", 3)
                        .attr("fill", "none");
    var totalLength = lineGraph.node().getTotalLength();

    lineGraph
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(3000)
      .ease("quad")
      .attr("stroke-dashoffset", 0);

    document.getElementById('line-year').addEventListener('change', populateLineChartWithData, false);
    function populateLineChartWithData() {
  		lineGraph.transition().attr("d", lineFunction(data[this.value]))
  	}

}