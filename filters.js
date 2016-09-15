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


function weekifyData(results) {
    var weekOfYear = function(date){
        var d = new Date(+date);
        d.setHours(0,0,0);
        d.setDate(d.getDate()+4-(d.getDay()||7));
        return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
    };

    var count = [];
    results.forEach(function(result) {
        if (result.verdict === "OK") {  
            var date = new Date(result.creationTimeSeconds * 1000);
            var year = date.getUTCFullYear();
            count[year] = (count[year] == undefined) ? (Array.apply(null, Array(54)).map(Number.prototype.valueOf,0)): (count[year]);
            var week = weekOfYear(result.creationTimeSeconds * 1000);
            ++count[year][week];
            // if (week == 53) {
            //     console.log(date);
            // }
            // count[year + '' + week] = (count[year + '' + week] + 1) || 1;
        }
    });
    return count;
}