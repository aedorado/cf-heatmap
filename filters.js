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
