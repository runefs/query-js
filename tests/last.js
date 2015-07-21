/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    emptyQuery = new Query([]);
    undef = {};
    
    describe("last",function(){
        it("OrDefault return default",function(){
            expect(emptyQuery.lastOrDefault(undef)).to.equal(undef);
        });
        
        it("Should throw on empty",function(){
            expect(function(){emptyQuery.last()}).to.throw(emptyQuery.last.empty);
        });
    
        it("One and only",function(){
            expect(Query([1]).lastOrDefault(undef)).to.equal(1);
        });
    
        it("many more",function(){
            expect(Query([2,1,3]).last()).to.equal(3);
        });
    });
    