/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    emptyQuery = Query([]);
    
describe("aggregate",function(){
    "use strict";
    it("empty",function(){
        var s = {};
        expect(emptyQuery.aggregate(function(seed){return seed;},s)).to.equal(s);
    });
    it("empty no seed",function(){
        expect(emptyQuery.aggregate(function(seed){return seed;})).to.equal(undefined);
        expect(isNaN([1,2,3,4,5].aggregate(function(seed){return seed + this;}))).to.equal(true);
    });
    
    it("With seed",function(){
        expect([1,2,3,4,5].aggregate(function(seed){return seed + this;},0)).to.equal(15);
    });
});
