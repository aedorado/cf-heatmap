// createLCStructure();

function linechart(data) {
	createLCStructure(data);
	// console.log(weeklyData);
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
                        .attr("d", lineFunction(data[new Date().getUTCFullYear()]))
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

  circles = svgGroup.selectAll("circle")                                    
          .data(data[new Date().getUTCFullYear()])
          .enter().append("circle")                            
          .attr("r", 4)    
          .attr("z-index", 100)
          .attr("cx", function(d, i) { return xScale(i); })
          .attr("cy", function(d, i) { return yScale(d); })// - yScale(d[1] * 100 / (i + 1)); })
           // Tooltip stuff after this
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
          })
          .on("mouseout", function(d, i) {
            tooltipLineX.remove('tooltipLineX');
            tooltipLineY.remove('tooltipLineY');
              // tooltip.style('display', 'none');
              // d3.select('path#' + name.replace(' ', '-')).attr("stroke-width", 2);
          });

    // var focus = linesvg.append("g").style("display", "none");
    // focus.append("circle")
    //     .attr("class", "y")
    //     .style("fill", "none")
    //     .style("stroke", "blue")
    //     .attr("r", 4)
    // // append the rectangle to capture mouse
    // linesvg.append("rect")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .style("fill", "red")
    //     .style("pointer-events", "all")
    //     .on("mouseover", function() { focus.style("display", null); })
    //     .on("mouseout", function() { focus.style("display", "none"); })
    //     .on("mousemove", mousemove);       

    //     var bisectData = d3.bisector(function(d) {

    //     });

    //     function mousemove() {                                 // **********
    //     var x0 = x.invert(d3.mouse(this)[0]),              // **********
    //         i = bisectData(data, x0, 1),                   // **********
    //         d0 = data[i - 1],                              // **********
    //         d1 = data[i],                                  // **********
    //         d = x0 - d0.date > d1.date - x0 ? d1 : d0;     // **********

    //     focus.select("circle.y")                           // **********
    //         .attr("transform",                             // **********
    //               "translate(" + x(d.date) + "," +         // **********
    //                              y(d.close) + ")");        // **********
    // }  

    document.getElementById('line-year').addEventListener('change', populateLineChartWithData, false);
    
    function populateLineChartWithData() {
      lineGraph.transition().attr("d", lineFunction(data[this.value]));
      console.log(circles, data[this.value]);
      circles.attr("d", data[this.value]).attr("cy", function(d, i) { console.log(d, yScale(d));return yScale(d); });
  	}

}