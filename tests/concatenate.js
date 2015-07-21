/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index();},
    getValue = function(){return this.value;},
    emptyQuery = Query([]);
    
describe("concatenate", function(){
    it("empty",function(){
        expect(emptyQuery.concatenate()).to.equal(emptyQuery);
    });
    
    it("Two queries", function(){
        var res = (new Query([3,4,5])).concatenate(new Query([2])).each();
        expect(res.length).to.equal(4);
        expect(res[0]).to.equal(3);
        expect(res[1]).to.equal(4);
        expect(res[2]).to.equal(5);
        expect(res[3]).to.equal(2);
    });
    
    it("Two arrays", function(){
        var res = ([3,4,5]).concatenate([2]).each();
        expect(res.length).to.equal(4);
        expect(res[0]).to.equal(3);
        expect(res[1]).to.equal(4);
        expect(res[2]).to.equal(5);
        expect(res[3]).to.equal(2);
    });
    
    it("One empty", function(){
        expect((new Query([3,4,5])).concatenate(new Query([])).count()).to.equal(3);
    });
    
    it("First one empty", function(){
        
        expect(new Query([]).concatenate(new Query([3,4,5])).count()).to.equal(3);
    });
});
