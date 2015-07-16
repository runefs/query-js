 /* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    getIndex = function(){return this.index;},
    emptyQuery = Query([]);
     
     describe("min", function(){
        "use strict";
         it("empty", function(){
             expect(function(){emptyQuery.min()}).to.throw(emptyQuery.first.throws.empty);
         });
         
         it("one", function(){
             var elem = 4;
             expect([elem].min()).to.equal(elem);
         });
         
         it("more", function(){
             var elem = 4;
             expect([5,10,elem,6].min()).to.equal(elem);
         });
         
         it("objects", function(){
             var elem = {index:2};
             expect([elem,{index:5}].min(getIndex)).to.equal(elem);
         });
         
         
       });
  