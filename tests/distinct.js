/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;};

describe("distinct",function(){
    "use strict";
        it("one",function(){
            
            var arr = [1],
                res = Query(arr).distinct().each();
                
            expect(res[0]).to.equal(1);
        });
        
        it("Custom  comparison", function(){
            var first = {index : 1, value : 4},
                res = [first, {index : 4, value : 4},{index : 2, value : 3}].distinct(function(){
                    return this.index;
                }).each();
            expect(res[0]).to.equal(first);
        });
        
        it("all the same",function(){
            
            var arr = [1,1,1],
                res = Query(arr).distinct().each();
                
            expect(res[0]).to.equal(1);
            expect(res.length).to.equal(1);
        });
        
        it("Mixed",function(){
            var i,arr = [1,2,1,2,3,4,3,4,5],
                res = Query(arr).distinct().each();
            arr = [1,2,3,4,5];    

            expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                   expect(res[i]).to.equal(arr[i]);
            }
        });
    });
    