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
        expect(emptyQuery.select(function(){ return this;}).count()).to.equal(0);
    });
    it("simple selection", function(){
        
        var res = [3,4,5].select(function(c){
            return c * 10;}).each();
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
describe("selectMany", function() {
    it("empty", function () {
        expect(emptyQuery.selectMany().count()).to.equal(0);
        expect(emptyQuery.selectMany("val").count()).to.equal(0);
        expect(emptyQuery.selectMany("val","index").count()).to.equal(0);
    });

    it("straight element projection",function(){
        var res = [[1,2],[3],[4]].selectMany(function(){ return this*this;}).each();
        expect(res[0]).to.equal(1);
        expect(res[3]).to.equal(16);

        res = [[{val: 1},{val: 2}],[{val: 3}],[{val: 4}]].selectMany("val").each();
        expect(res[0]).to.equal(1);
        expect(res[3]).to.equal(4);
    })
});
