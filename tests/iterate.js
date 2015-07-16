 /* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    getIndex = function(){return this.index;},
    emptyQuery = Query([]);

describe("iterate", function(){
    "use strict";
  it("empty", function(){
      [].iterate(function(){ throw Error("should not happen")});
      expect(true).to.equal(true);
  });
  
  it("more", function(){
      var res = "";
      [1,4,5].iterate(function(){res += this });
      expect(res).to.equal("145");
  });
});