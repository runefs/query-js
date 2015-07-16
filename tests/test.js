/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd = function(){return this % 2;},
    getIndex = function(){return this.index;},
    getValue = function(){return this.value;};

describe("Query",function(){
    "use strict";
    var emptyQuery = Query([]);
    describe("count",function(){
        it("Counting nothing",function(){
            expect(emptyQuery.count()).to.equal(0);
            
        });
        it("Counting",function(){
            expect(Query([1,2,3,4,5]).count()).to.equal(5);
            
        });
        it("Counting with where",function(){
            expect(Query([1,2,3,4,5]).where(isOdd).count()).to.equal(3);
        });
    });
    describe("first",function(){
        it("Should throw on empty",function(){
            expect(function(){emptyQuery.first()}).to.throw(emptyQuery.first.empty);
        });

        it("One and only",function(){
            expect(Query([1]).first()).to.equal(1);
        });

        it("many more",function(){
            expect(Query([2,1,3]).first()).to.equal(2);
        });

        it("with predicate",function(){
            expect(Query([2,1,3]).first(isOdd)).to.equal(1);
        });
    });

     describe("firstOrDefault",function(){

        it("Specific value as default",function(){
            expect(emptyQuery.firstOrDefault(12)).to.equal(12);
        });
        it("Specific value as default, predicate",function(){
            expect(emptyQuery.firstOrDefault(function(){return true;},6)).to.equal(6);
        });
        it("Specific value as default, predicate",function(){
            expect([1,2,3,4,5].firstOrDefault(function(){return false;},6)).to.equal(6);
        });
        it("Null as default",function(){
            expect(emptyQuery.firstOrDefault()).to.equal(null);
        });

        it("Compare to first",function(){
            var verify = function(arr,predicate){
                     var seq = Query(arr);
                     expect(seq.first(predicate)).to.equal(seq.firstOrDefault(predicate));
                };
                verify([2]);
                verify([2,1,3]);
                verify([2,1,3],isOdd);
        });
        
     });
    
    describe("any",function(){
        it("Empty",function(){
            expect(emptyQuery.any()).to.equal(false);
        });
    
        it("One and only",function(){
            expect(Query([false]).any()).to.equal(true);
        });
    
        it("Many more",function(){
            expect(Query([false, false]).any()).to.equal(true);
        });
    });
    
    describe("last",function(){
        it("Should throw on empty",function(){
            expect(function(){emptyQuery.last()}).to.throw(emptyQuery.last.empty);
        });
    
        it("One and only",function(){
            expect(Query([1]).last()).to.equal(1);
        });
    
        it("many more",function(){
            expect(Query([2,1,3]).last()).to.equal(3);
        });
    });
    
    describe("each",function(){
        it("empty",function(){
            var arr = [],
                res = Query(arr).each();
            expect(res.length).to.equal(arr.length);
        });
        
        it("several",function(){
            var i,
                arr = [1,5,3],
                res = Query(arr).each();

           expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                expect(res[i]).to.equal(arr[i]);
            }
        });
        
        it("several with predicate",function(){
            var i,
                arr = [1,5,3],
                predicate = isOdd,
                res = Query(arr).each(predicate);
                
            expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                if(predicate(arr)){
                   expect(res[i]).to.equal(arr[i]);
                }
            }
        });
    });
    
    describe("reverse",function(){
        
        it("Reverse",function(){
            
            var i,arr = [1,3,2,4],
                res = Query(arr).reverse().each();
            arr.reverse();    
            expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                   expect(res[i]).to.equal(arr[i]);
            }
        })
    });
     
    describe("orderBy",function(){
        it("simple",function(){
            
            var arr = [1,2,5,3,4],
                res = Query(arr).orderBy();

            res = res.each();

            expect(res[0]).to.equal(arr[0]);
            expect(res[1]).to.equal(arr[1]);
            expect(res[2]).to.equal(arr[3]);
            expect(res[3]).to.equal(arr[4]);
            expect(res[4]).to.equal(arr[2]);
        });
    });
    
    describe("singleOrDefault",function(){
        
        it("empty",function(){
            var undef = {};
            expect(emptyQuery.singleOrDefault(undef)).to.equal(undef);
            expect(emptyQuery.singleOrDefault(function(){return true;},undef)).to.equal(undef);
            expect(emptyQuery.singleOrDefault(function(){return true;})).to.equal(null);
            expect(emptyQuery.singleOrDefault()).to.equal(null);
        });
        
        it("one",function(){
            expect(new Query([1]).singleOrDefault()).to.equal(1);
            expect(new Query([1,2]).singleOrDefault(isOdd)).to.equal(1);
            expect(new Query([1]).singleOrDefault(isOdd)).to.equal(1);
        });
        
        it("more than one",function(){
            var verify = function(arr,predicate){
                var seq =new Query(arr);
                   expect(function(){seq.singleOrDefault(predicate)}).to.throw(seq.singleOrDefault.throws.tooMany);
            };
            verify([1,2]);
            verify([1,2,3],isOdd);
        });
        
         it("None satisfying predicate",function(){
             var undef = {};
             expect([1,2,3].singleOrDefault(function(){return this > 3;},undef)).to.equal(undef);
             expect([1,2,3].singleOrDefault(function(){return this > 3;})).to.equal(null);
         });
        
    });
    
    describe("single",function(){
        var verify = function(seq,message,predicate){
               var f = arguments.length > 2 ? function(){seq.single(predicate)} : function(){seq.single()};
                expect(f).to.throw(message);
            };
        it("empty",function(){
            var seq = emptyQuery,
                errMsg = seq.single.throws.empty;
                
            verify(seq,errMsg);
            verify(seq,errMsg,isOdd);
            verify(Query([2]),errMsg,isOdd);
        });
        it("Too many",function(){
            var seq = Query([1,2,3]),
                errMsg = seq.single.throws.tooMany;
                
            verify(seq,errMsg);
            verify(seq,errMsg,isOdd);
        }) 
    });
    
    describe("groupBy",function(){
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
            expect(res.single(function(){return this.key ==="b";}).value.single().value).to.equal(5);
            expect(res.select(function(){return this.value.sum(getValue);}).sum()).to.equal(8);
            expect(res.where(function(){return this.key === "a";}).select(function(kv){return kv.value.sum(getValue);}).sum()).to.equal(3);
        });
    });
    
     describe("product",function(){
        it("empty",function(){
            expect(emptyQuery.product()).to.equal(0);
        });
        
        it("simple",function(){
            expect([1,2,3,4,5].product()).to.equal(120);
        });
        
        it("with projection",function(){
            expect([{value :1 } ,{value : 2 } ,{value : 3 } ,{value : 4 } ,{value : 5}].product(getValue)).to.equal(120);
        });
     });
     
     describe("sum",function(){
        it("empty",function(){
            expect(emptyQuery.sum()).to.equal(0);
        });
        
        it("simple",function(){
            expect([1,2,3,4,5].sum()).to.equal(15);
        });
        
        it("with projection",function(){
            expect([{value :1 } ,{value : 2 } ,{value : 3 } ,{value : 4 } ,{value : 5}].sum(function(){return this.value;})).to.equal(15);
            expect([{value :1 } ,{value : 2 } ,{value : 3 } ,{value : 4 } ,{value : 5}].sum("value")).to.equal(15);
        });
     });
     
     describe("take", function(){
         it("empty", function(){
             expect(emptyQuery.take(1).count()).to.equal(0);
         });
         it("taken more than we have", function(){
             var arr =[1,2,3,4,5], 
                 res = arr.take(10);
             expect(res.count()).to.equal(5);
         });
         
         it("taken less than we have", function(){
             var arr =[1,2,3,4,5];
             expect(arr.skip(1).take(1).single()).to.equal(arr[1]);
         });
     });
          
       describe("max", function(){
         it("empty", function(){
             expect(function(){emptyQuery.max()}).to.throw(emptyQuery.first.throws.empty);
         });
         
         it("one", function(){
             var elem = 4;
             expect([elem].max()).to.equal(elem);
         });
         
         it("more", function(){
             var elem = 11;
             expect([5,10,elem,5].max()).to.equal(elem);
         });
         
         it("more", function(){
             var elem = {index:11};
             expect([elem,{index:5}].max(getIndex)).to.equal(elem);
         });
         
         
       });
       
       describe("average", function(){
         it("empty", function(){
             expect(emptyQuery.average()).to.equal(undefined);
         });
         it("no projection", function(){
             expect([3,4,5].average()).to.equal(4);
         });
         
         it("with property name", function(){
             expect([{val: 3} ,{val:4},{val: 5} ].average("val")).to.equal(4);
         });
       });
       
        describe("concatenate", function(){
         it("empty",function(){
             expect(emptyQuery.concatenate().any()).to.equal(false);
         });
         
         it("Two queries in an array", function(){
             var res = [new Query([3,4,5]),new Query([2])].concatenate().each();
             expect(res.length).to.equal(4);
         });
         
         it("Two arrays in an array", function(){
             var res = [[3,4,5],[2]].concatenate().each();
             expect(res.length).to.equal(4);
             expect(res[0]).to.equal(3);
             expect(res[1]).to.equal(4);
             expect(res[2]).to.equal(5);
             expect(res[3]).to.equal(2);
         });
         
         it("Two queries", function(){
             expect(new Query([new Query([3,4,5]),new Query([2])]).concatenate().count()).to.equal(4);
         });
         
         it("One empty", function(){
             expect(new Query([new Query([3,4,5]),new Query([])]).concatenate().count()).to.equal(3);
         });
       });


});
