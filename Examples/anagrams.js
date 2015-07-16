var liner = require("../lineReader"),
    Query = require("../query.js"),
    md5 = require("MD5"),
    wordFile = "./Examples/wordFile",
    fs = require('fs'),
    start = "poultry outwits ants",
    //source = fs.createReadStream(wordFile),
    main = function(map) {
      "use strict";
       var MD5 = "4624d200580677270a54ccff86b9610e",
           sentence;
           
          var words = start.split('')
                           .permutations()
                           .select(function(){
                              return this.join()
                                         .split(' ')
                                         .select(function(){
                                             return this.split('')
                                                        .sort().toString();
                                         });
                           })
                           .where(function(){
                              return this.all(function(){
                                   return map.hasOwnProperty(this);
                              });
                           })
                           .select(function(){
                                        var key = this.sort()
                                                      .toString();
                                        return map[key];
                           }).each();
          console.log(words);
          var first = words[0],
              second = words[1],
              third = words[2],i,j,k,f,s,t,
              combinations;
              for(var i = 0; i < first.length; i++){
                  f = first[i];
                  for(var j = 0; j < second.length; j++){
                      s = second[j];
                      for(var k = 0; k < third.length; k++){
                         t = third[k];
                         combinations = [f,s,t].permutations();
                         console.log(
                              combinations.select(function(){
                                   var sentence = this.each().join(" ");
                                   return {
                                        hash: md5(sentence),
                                        sentence : sentence};
                              }).each()
                         );
                      }
                  }
              }
    };
fs.readFile(wordFile + ".json",function(err,data){
     if (err) {
          fs.readFile(wordFile + ".txt",function(err,data){
               map = data.toString().split('\n')
                               .where(function(){
                                   return this !==  '';
                               })
                               .select(function(){
                                   return this.trim()
                                              .split('');})
                               .where(function(){
                                       return this.all(function(state){
                                                  var len = state.length;
                                                  state = state.replace(this,"");
                                                  return len-1 === state.length && state;
                                           },start);
                                       return res;
                               })
                               .select(function(){
                                       var word = this.toString()
                                                      .replace(/,/g,'')
                                       return {
                                                key: this.orderBy()
                                                         .each()
                                                         .toString(),
                                                word : word};
                               }).groupBy(function(){ return this.key;},function(){return this.word});
               var mapJson = JSON.stringify(map);
               console.log("MAP", mapJson);
               fs.writeFile(wordFile + '.json', mapJson, function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
               });
               main(map);
          });
     } else {
         main(JSON.parse(data.toString()));
     }
});
    
//source.pipe(liner);
//
//liner.on('readable', function () {
//     var line, chars;
//     while ((line = liner.read())) {
//         line = line.trim();
//         chars = line.split('').sort().toString().replace(',','');
//         if (!map.hasOwnProperty(chars)) {
//            map[chars] = [];
//         }
//         map[chars].push(line);
//     }
//});
//
//readable.on('end', );

