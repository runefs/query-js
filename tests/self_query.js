/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;},
    emptyQuery = Query([]);

describe("query", function(){
    "use strict";
    it ("simple",function() {
        var res = [1,2,3].query().each();
        expect(res[0]).to.equal(1);
        expect(res[1]).to.equal(2);
        expect(res[2]).to.equal(3);
    });
    it("referential integrity",function(){
        var arr = [1,2,3];
        expect(arr.query()).to.equal(arr.query());
    })
});