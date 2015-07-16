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
                                                     .each()
                                                     .toString()
                                                     .replace(/,/g,'');
                                      },function(){
                                        return this.toString()
                                                   .replace(/,/g,'');
                                      });
            
            expect(map.ailss.length).to.equal(2);
            expect(map.cop).to.equal(undefined);
            expect(map.aails).to.equal(undefined);
            expect(map.ailss[0]).to.equal("salis");
            expect(map.loop.length).to.equal(1);
        });
    });
});

