/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;};

describe("Regression tests",function(){
    "use strict";
    var emptyQuery = Query([]);
    describe("anagram",function(){
        it("",function(){
            var start = "poultry outwits ants",
                MD5 = "4624d200580677270a54ccff86b9610e",
                array = ["salis", "alias", "cop", "loop", "silas"].select(function(){
                         return this.trim()
                                    .split('');}),
                filtered = array.where(function(){
                             return this.all(function(state){
                                        var len = state.length;
                                        state = state.replace(this,"");
                                        return len-1 === state.length && state;
                                 },start);
                             return res;
                     });
                var map = filtered.groupBy(function(){
                                        return this.orderBy()
                                                     .aggregate(function(st){st.push(this); return st;},[])
                                                     .toString()
                                                     .replace(/,/g,'');
                                      },function(){
                                        return this.toString()
                                                   .replace(/,/g,'');
                                       });
                console.log(map);
            expect(map.ailss.length).to.equal(2);
            expect(map.cop).to.equal(undefined);
            expect(map.aails).to.equal(undefined);
            expect(map.ailss[0]).to.equal("salis");
            expect(map.loop.length).to.equal(1);
        });
    });
    
    var seq = [{key : 0, value : "a"},
                       {key : 1, value : "b"},
                       {key : 2, value : "c"},
                       {key : 3, value : "d"}];
          
     var test = function(first,second,f){
        var res = [];
        first = first.getEnumerator();
        second = second.getEnumerator();
        while(first.next()  && second.next()){
                f(first,second,res);
            }

            expect(seq.length).to.equal(res.length);
            for(var i = 0; i < seq.length; i++){
                expect(seq[i].key).to.equal(res[i].key);
                expect(seq[i].value).to.equal(res[i].value);
            }
     };
     
     describe("multiple usage",function(){
        it("double select",function(){
            var keys = seq.select(function(){ return this.key; }),
                values = seq.select(function(){ return this.value; });
                
            test(keys, values, function(first,second,res){
                res.push({
                    key   : first.current,
                    value : second.current
                });
              });
        });
     
       it("where we select equally",function(){
           var keys = seq.select(function(){ return this.key; }),
               values = seq.where(function(){ return this.key < 4;} );
               
           test(keys, values, function(first,second,res){
              res.push({
                  key   : first.current,
                  value : second.current.value
              });
          });
       });
           
       
       it("select and filter",function(){
              var seq = [{key : 0, value : "a"},
                         {key : 1, value : "b"},
                         {key : 2, value : "c"},
                         {key : 3, value : "d"}],
                  keys = seq.select(function(){ return this.key; }),
                  values = seq.where(function(){ return this.key < 4;} );
               
           test(keys, values, function(first,second,res){
              res.push({
                  key   : first.current,
                  value : second.current.value
              });
          });
       });
       
       it("lots of wheres",function(){
              var low  = seq.where(function(){ return this.key <= 3; }),
                  high = seq.where(function(){ return this.value >= 'a'; });
               
           test(low, high, function(first,second,res){
              res.push({
                  key   : first.current.key,
                  value : second.current.value
              });
           });
       });
   });
});