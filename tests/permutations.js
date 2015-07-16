/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect;

describe("permutations",function(){
    "use strict";
    it("one",function(){
        var res = [1].permutations().each();
        console.log(res);
        expect(res.length).to.equal(1);
        expect(res[0].each()[0]).to.equal(1);
    });
    
    it("two",function(){
        var res = [1,2].permutations().each();

        console.log(res);
        expect(res.length).to.equal(2);
        expect(res[0].first()).to.equal(res[1].last());
        expect(res[1].first()).to.equal(res[0].last());
        
    });
    
    it("more",function(){
        var res = [1,2,3].permutations().each();
        console.log(res);
        expect(res.length).to.equal(6);
    });
    
    //it("long",function(){
    //    var permutations = "poultry outwits ants".split('')
    //                                             .permutations();
    //    expect(permutations.length).to.equal("a lot");
    //});
});