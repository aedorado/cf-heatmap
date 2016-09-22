function filterNormally(results) {
    var count = {};
    results.forEach(function(result) {
        if (result.verdict === "OK") {        
            var date = new Date(result.creationTimeSeconds * 1000);
            var year = date.getUTCFullYear();
            var month = date.getUTCMonth();
            if (month < 9) {
                month = '0' + (month + 1);
            } else {
                month = month + 1;
            }
            var day = date.getUTCDate();
            if (day < 10) {
                day = '0' + day;
            }
            count[year + '' + month + '' + day] = (count[year + '' + month + '' + day] + 1) || 1;
        }
    });
    return count;
}

function filterParticipantType(results, type) {
    var count = {};
    results.forEach(function(result) {
        if (result.verdict === "OK" && result.author.participantType === type) {  
            var date = new Date(result.creationTimeSeconds * 1000);
            var year = date.getUTCFullYear();
            var month = date.getUTCMonth();
            if (month < 9) {
                month = '0' + (month + 1);
            } else {
                month = month + 1;
            }
            var day = date.getUTCDate();
            if (day < 10) {
                day = '0' + day;
            }
            count[year + '' + month + '' + day] = (count[year + '' + month + '' + day] + 1) || 1;
        }
    });
    return count;
}


function weekifyData(results, type='') {
    // var weekOfYear = function(date){
    //     var d = new Date(+date);
    //     d.setHours(0,0,0);
    //     d.setDate(d.getDate()+4-(d.getDay()||7));
    //     return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
    // };

    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }

    var attachYearToLineYear = function(year) {     // create drop-down menu
        var op = document.createElement('option');
        op.setAttribute('value', year);
        op.appendChild(document.createTextNode(year));
        document.getElementById('line-year').appendChild(op);
    }

    var count = [];
    results.forEach(function(result) {
        if (result.verdict === "OK") {  
            var date = new Date(result.creationTimeSeconds * 1000);
            var year = date.getUTCFullYear();
            
            if (count[year] === undefined){
                count[year] = Array.apply(null, Array(54)).map(Number.prototype.valueOf,0);
                attachYearToLineYear(year);
            }
            var week = new Date(result.creationTimeSeconds * 1000).getWeek();
            ++count[year][week];
            // count[year + '' + week] = (count[year + '' + week] + 1) || 1;
        }
    });
    return count;
}