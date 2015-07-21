/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index();},
    getValue = function(){return this.value;},
    emptyQuery = Query([]);

describe("select", function(){
    "use strict";
    it("empty", function(){
        var res = emptyQuery.select(function(){ return this;});
        expect(res.count()).to.equal(0);
    });
    it("simple selection", function(){
        
        var res = [3,4,5].select(function(){
            return this * 10;
        }).each();
        expect(res[0]).to.equal(30);
        expect(res[1]).to.equal(40);
        expect(res[2]).to.equal(50);
    });

    it("with property name", function(){
        var res = [{val: 3},{val: 4},{val: 5}].select("val").each();
        expect(res[0]).to.equal(3);
        expect(res[1]).to.equal(4);
        expect(res[2]).to.equal(5);
    });
});