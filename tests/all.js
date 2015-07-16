/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index();},
    getValue = function(){return this.value;},
    emptyQuery = Query([]);

 describe("all",function(){
    "use strict";
        var pred = function(){
            return !this;
        };
        
        it("Empty",function(){
            expect(emptyQuery.all(pred)).to.equal(true);
        });
        
        it("No predicate",function(){
            expect(function(){emptyQuery.all()}).to.throw(emptyQuery.all.throws.noPredicate);
        });
    
        it("One and only",function(){
            expect(Query([false]).all(pred)).to.equal(true);
        });
    
        it("Many more",function(){
            expect(Query([false, false, false]).all(pred)).to.equal(true);
        });
        
        it("Not all",function(){
            expect(Query([false, true, false]).all(pred)).to.equal(false);
        });
    });
    