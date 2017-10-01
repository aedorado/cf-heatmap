var results;
var user;
var sentname, gotname;

function checkUser(user, cb) {
    var url = 'http://codeforces.com/api/user.info?handles=' + user;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          var response = JSON.parse(xhttp.responseText); 
          if (response.status === "OK") {
            cb();
          } else if (response.status === "FAILED"){
            document.getElementById('heat-map-div').innerHTML = response.comment;
          } else if (xhttp.status == 400) {
              document.getElementById('heat-map-div').innerHTML = 'Call failed.';
          }
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function apicall(username) {
    var success = false;
    user = username
    window.location.hash = '#' + user;
    document.getElementById('loading-gif').style.display = 'inline';
    document.getElementById('heat-map-div').innerHTML = '';
    document.getElementById('linechart-div').innerHTML = '';
    document.getElementById('line-year').innerHTML = '';
    document.getElementById('stats').innerHTML = '';
    checkUser(user, function() {
        var url = 'http://codeforces.com/api/user.status?handle=' + user;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
              if ((JSON.parse(xhttp.responseText)).status === "OK") {
                    gotname = username;
                    if (sentname == gotname) {
                        success = true;
                        results = (JSON.parse(xhttp.responseText)).result;
                        process(results);
                        linechart(results);
                    }
              } else if (xhttp.status == 400) {
                  document.getElementById('heat-map-div').innerHTML = 'Call failed.';
              }
          }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
        sentname = username;
        setTimeout(function() {
            if (!success) {
                // document.getElementById('loading-gif').style.display = 'none';
                document.getElementById('heat-map-div').innerHTML = 'Request is taking too long. Either the handle is invalid or the connection is slow.';
            }
        }, 18000);
    })
}

function process(results) {
    var count = {};
    var minYear, maxYear;

    maxYear = (new Date(results[0].creationTimeSeconds * 1000)).getUTCFullYear();
    minYear = (new Date(results[results.length - 1].creationTimeSeconds * 1000)).getUTCFullYear();

    results = results.filter(function(result) {
        return result.verdict === "OK";
    });

    results.forEach(function(result) {
        var date = new Date(result.creationTimeSeconds * 1000);
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth();
        if (month < 9) {
            month = '0' + (month + 1);
        } else {
            month = month + 1;
        }
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        count[year + '' + month + '' + day] = (count[year + '' + month + '' + day] + 1) || 1;
    });

    document.getElementById('loading-gif').style.display = 'none';
    mapdata(count, minYear, maxYear);
}

document.getElementById('username-input').addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        apicall(this.value);
    }
}, false);

function mapdata(count, minYear, maxYear) {
    var width = 900,
        height = 105,
        cellSize = 12; // cell size
    week_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y%m%d");
    parseDate = d3.time.format("%Y%m%d").parse;


    var svg = d3.select(".calender-map").selectAll("svg")
        .data(d3.range(minYear, maxYear + 1))
        .enter().append("svg")
        .attr("width", '100%')
        .attr("data-height", '0.5678')
        .attr("viewBox", '0 0 900 105')
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

    svg.append("text")
        .attr("transform", "translate(-38," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d;
        });

    for (var i = 0; i < 7; i++) {
        svg.append("text")
            .attr("transform", "translate(-5," + cellSize * (i + 1) + ")")
            .style("text-anchor", "end")
            .attr("dy", "-.25em")
            .text(function(d) {
                return week_days[i];
            });
    }

    rect = svg.selectAll(".day")
        .data(function(d) {
            return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter()
        .append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            return week(d) * cellSize;
        })
        .attr("y", function(d) {
            return day(d) * cellSize;
        })
        .attr("fill", '#fff')
        .datum(format);

    var legend = svg.selectAll(".legend")
        .data(month)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + (((i + 1) * 50) + 8) + ",0)";
        });

    legend.append("text")
        .attr("class", function(d, i) {
            return month[i];
        })
        .style("text-anchor", "end")
        .attr("dy", "-.25em")
        .text(function(d, i) {
            return month[i];
        });

    svg.selectAll(".month")
        .data(function(d) {
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("class", "month")
        .attr("id", function(d, i) {
            return month[i];
        })
        .attr("d", monthPath);


    var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip');

    d3.selectAll('rect').on('mouseover', function(d) {
            if (this.getAttribute('data-title') != null) {
                tooltip.style('display', 'block');
                tooltip.html(this.getAttribute('data-title'))
                    .style('left', (d3.event.pageX + 5) + 'px')
                    .style('top', (d3.event.pageY) + 'px');
            }
        })
        .on('mouseout', function(d) {
            tooltip.style('display', 'none');
        });

    document.querySelector('input[type=radio]').checked = true;
    plotHM(count);

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0),
            w0 = +week(t0),
            d1 = +day(t1),
            w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
            "H" + w0 * cellSize + "V" + 7 * cellSize +
            "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
            "H" + (w1 + 1) * cellSize + "V" + 0 +
            "H" + (w0 + 1) * cellSize + "Z";
    }
}

function getStats(data) {
    var stats = [];
    stats['maxsub'] = 0;
    stats['maxsub'] = Math.max.apply(stats['maxsub'], Object.keys(data).map(function(e) {
        return data[e];
    }));
    
    stats['sum'] = 0;
    for (key in data) {
        stats['sum'] += data[key];
    }
    stats['avg'] = (stats['sum'] / Object.keys(data).length).toPrecision(4);
    stats['numdays'] = Object.keys(data).length;

    document.getElementById('stats').innerHTML = user + ' has made ' + stats['sum'] + ' submissions over a period of ' + stats['numdays'] + ' different days.';
    document.getElementById('stats').innerHTML += '<br>Average number of submissions are ' + stats['avg'];
    document.getElementById('stats').innerHTML += '<br>Max Submissions in a day are ' + stats['maxsub'];
    return stats;
}

// plot data on the map
function plotHM(data) {
    var stats = getStats(data);
    var color = d3.scale.linear().range(["#d6e685", '#1e6823']).domain([1, stats['maxsub']]);
    rect.transition().duration(750).
    attr("fill", function(d) {
        return (d in data) ? color(data[d]): 'white';
    }).attr("data-title", function(d) {
        return (d in data) ? (d.substring(6) + '/' + d.substring(4, 6)) + " Submissions: " + data[d]: null;
    });
}

if (window.location.hash) {
    apicall(window.location.hash.substring(1));
}

var radiobuttons = document.querySelectorAll('input[type=radio]');
for (var i = 0; i < radiobuttons.length; i++) {
    radiobuttons[i].addEventListener('click', function() {
        if (this.value === 'A') {
            plotHM(filterNormally(results));
        } else if (this.value == 'C') {
            plotHM(filterParticipantType(results, "CONTESTANT"));
        } else if (this.value == 'P') {
            plotHM(filterParticipantType(results, "PRACTICE"));
        } else if (this.value == 'V') {
            plotHM(filterParticipantType(results, "VIRTUAL"));
        }
    }, false);
}
