/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;};
    var emptyQuery = Query([]);

    describe("groupBy",function(){
        "use strict";
        it("all same key",function(){
            var arr = [{index : "a",value : 0},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(){ return this.index});
            
            expect(res.a.length).to.equal(arr.length);
            expect(res.a[1].value).to.equal(1);
        });
        
        it("more keys",function(){
            var arr = [{index : "b",value : 0},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(){ return this.index});
                
            expect(res.a.length).to.equal(arr.length - res.b.length);
            expect(res.b[0].value).to.equal(0);
            expect(res.a[0].value).to.equal(1);
        });
        
        
        it("custom value",function(){
            var arr = [{index : "b",value : 0},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(){ return this.index}, getValue),
                a = res.a.sum(),
                b = res.b.sum(),
                sum = arr.sum(getValue);
                
            expect(a).to.equal(3);
            expect(sum - a).to.equal(b);
        });
        
        it("As Query",function(){
            var arr = [{index : "b",value : 5},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(){ return this.index});
            expect(res.single(function(){
                                return this.key ==="b";
                                })
                      .value
                      .single()
                      .value)
            .to.equal(5);
            expect(res.select(function(){return this.value.sum(getValue);}).sum()).to.equal(8);
            expect(res.where(function(){return this.key === "a";}).select(function(kv){return kv.value.sum(getValue);}).sum()).to.equal(3);
        });
    });
    