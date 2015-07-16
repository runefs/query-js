/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;};

describe("skip",function(){
    "use strict";
     it("empty", function(){
         expect(function(){emptyQuery.skip(1);}).to.throw();
     });
     
     it("one", function(){
         expect([1].skip(1).any()).to.equal(false);
     });
     
     it("two", function(){
        var res = [1,2].skip(1).each();
         expect(res.length).to.equal(1);
         expect(res[0]).to.equal(2);
     });
     
     it("many", function(){
        var res = [1,2,3,4].skip(2);
         expect(res.first()).to.equal(3);
     });
 });