var request = require("request"),
    Query = require("../query.js"),
    url = "https://inforegio.azure-westeurope-prod.socrata.com/resource/j8wb-jxec.json?$offset=0";
    
request.get(url,function(error, response, body){
   var data = JSON.parse(body),
       byCountry = new Query(data).groupBy(function(d){ return d.nuts_id.substr(0,2); }),
       regionsWithIncomRegions= byCountry.select(function(kv){
           return kv.value.where(function(e){return parseFloat(e.ipps28_2011) > 150;}).each();
       });
       regionsWithIncomRegions.iterate(console.log);
});
