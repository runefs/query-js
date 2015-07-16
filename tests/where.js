/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;},
    emptyQuery = Query([]);

describe("where", function(){
    it("empty", function(){
        expect(emptyQuery.where(function(){ return this;}).count()).to.equal(0);
    });
    it("more", function(){
        expect([3,4,5].where(isOdd).sum()).to.equal(8);
    });
});