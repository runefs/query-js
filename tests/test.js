/* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect;
   
describe("Query",function(){
    var emptyQuery = Query([]);
    
    describe("count",function(){
        it("Counting nothing",function(){
            expect(emptyQuery.count()).to.equal(0);
            
        });
        it("Counting",function(){
            expect(Query([1,2,3,4,5]).count()).to.equal(5);
            
        });
        it("Counting with where",function(){
            expect(Query([1,2,3,4,5]).where(function(e){return e % 2;}).count()).to.equal(3);
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
            expect(Query([2,1,3]).first(function(e){return e % 2;})).to.equal(1);
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
                verify([2,1,3],function(e){return e % 2;});
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
    
    describe("all",function(){
        var pred = function(e){return !e};
        it("Empty",function(){
            expect(emptyQuery.all(pred)).to.equal(true);
        });
        
        it("Empty",function(){
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
                predicate = function(e){ return e % 2; },
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
    
    describe("when",function(){
        
        it("Simple",function(){
            
            var arr = [1,3,2,4,5],
                res = arr.when(function(e){return e < 4;}).each();
            expect(res.length).to.equal(3);
            expect(res[0]).to.equal(arr[0]);
            expect(res[1]).to.equal(arr[1]);
            expect(res[2]).to.equal(arr[2]);
        })
    });
    
    describe("distinct",function(){
        it("one",function(){
            
            var arr = [1],
                res = Query(arr).distinct().each();
                
            expect(res[0]).to.equal(1);
        });
        
        if("Custom  comparison", function(a,b){
            var first = {index : 1, value : 4},
                res = [first, {index : 4, value : 4},{index : 2, value : 3}].distinct(function(a,b){ return a.index === b.index }).each();
            expect(res[0]).to.equal(first);
        })
        
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
            var undef = {}, seq = emptyQuery;
            expect(emptyQuery.singleOrDefault(undef)).to.equal(undef);
            expect(emptyQuery.singleOrDefault(function(){return true;},undef)).to.equal(undef);
            expect(emptyQuery.singleOrDefault(function(){return true;})).to.equal(null);
            expect(emptyQuery.singleOrDefault()).to.equal(null);
        });
        
        it("one",function(){
            var undef = {};
            expect(Query([1]).singleOrDefault()).to.equal(1);
            expect(Query([1,2]).singleOrDefault(function(e){return e%2;})).to.equal(1);
            expect(Query([1]).singleOrDefault(function(e){return e%2;})).to.equal(1);
        });
        
        it("more than one",function(){
            var verify = function(arr,predicate){
                var seq = Query(arr);
                   expect(function(){seq.singleOrDefault(predicate)}).to.throw(seq.singleOrDefault.throws.tooMany);
            };
            verify([1,2]);
            verify([1,2,3],function(e){return e%2;});
        });
        
         it("None satisfying predicate",function(){
             var undef = {}
             expect([1,2,3].singleOrDefault(function(e){return e > 3;},undef)).to.equal(undef);
             expect([1,2,3].singleOrDefault(function(e){return e > 3;})).to.equal(null);
         });
        
    });
    
    describe("single",function(){
        var verify = function(seq,message,predicate){
                expect(function(){seq.single(predicate)}).to.throw(message);
            };
        it("empty",function(){
            var seq = emptyQuery,
                errMsg = seq.single.throws.empty;
                
            verify(seq,errMsg);
            verify(seq,errMsg,function(e){return e%2;});
            verify(Query([2]),errMsg,function(e){return e%2;});
        });
        it("Too many",function(){
            var seq = Query([1,2,3]),
                errMsg = seq.single.throws.tooMany;
                
            verify(seq,errMsg);
            verify(seq,errMsg,function(e){return e % 2;});
        }) 
    });
    
    describe("groupBy",function(){
        it("all same key",function(){
            var arr = [{index : "a",value : 0},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(e){ return e.index});
            expect(res.a.length).to.equal(arr.length);
            expect(res.a[1].value).to.equal(1);
        });
        
        it("more keys",function(){
            var arr = [{index : "b",value : 0},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(e){ return e.index});
            expect(res.a.length).to.equal(arr.length - res.b.length);
            expect(res.b[0].value).to.equal(0);
            expect(res.a[0].value).to.equal(1);
        });
        
        
        it("custom value",function(){
            var arr = [{index : "b",value : 0},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(e){ return e.index}, function(e){return e.value;}),
                a = res.a.sum(),
                b = res.b.sum(),
                sum = arr.sum(function(a){return a.value;});
                
            expect(a).to.equal(3);
            expect(sum - a).to.equal(b);
        });
        
        it("As Query",function(){
            var arr = [{index : "b",value : 5},{index : "a",value : 1},{index : "a",value : 2}],
                seq = Query(arr),
                res = seq.groupBy(function(e){ return e.index});
            expect(res.single(function(kv){return kv.key ==="b";}).value.single().value).to.equal(5);
            expect(res.select(function(kv){return kv.value.sum(function(kv){return kv.value;});}).sum()).to.equal(8);
            expect(res.where(function(kv){return kv.key === "a";}).select(function(kv){return kv.value.sum(function(kv){return kv.value;});}).sum()).to.equal(3);
        });
    });
    
     describe("aggregate",function(){
        it("empty",function(){
            var s = {};
            expect(emptyQuery.aggregate(function(seed,e){return seed;},s)).to.equal(s);
        });
        it("empty no seed",function(){
            expect(emptyQuery.aggregate(function(seed,e){return seed;})).to.equal(undefined);
            expect(isNaN([1,2,3,4,5].aggregate(function(seed,e){return seed + e;}))).to.equal(true);
        });
        
        it("With seed",function(){
            expect([1,2,3,4,5].aggregate(function(seed,e){return seed + e;},0)).to.equal(15);
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
            expect([{value :1 } ,{value : 2 } ,{value : 3 } ,{value : 4 } ,{value : 5}].product(function(e){return e.value;})).to.equal(120);
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
            expect([{value :1 } ,{value : 2 } ,{value : 3 } ,{value : 4 } ,{value : 5}].sum(function(e){return e.value;})).to.equal(15);
        });
     });
     
     describe("take", function(){
         it("empty", function(){
             expect(emptyQuery.take(1).count()).to.equal(0);
         });
         it("taken more than we have", function(){
             var arr =[1,2,3,4,5], 
                 res = arr.take(10) 
             expect(res.count()).to.equal(5);
         });
         
         it("taken less than we have", function(){
             var arr =[1,2,3,4,5];
             expect(arr.skip(1).take(1).single()).to.equal(arr[1]);
         });
     })
     
     describe("select", function(){
         it("empty", function(){
             expect(emptyQuery.select(function(e){ return e;}).count()).to.equal(0);
         });
         it("more", function(){
             expect([3,4,5].select(function(e){ return e * 10;}).sum()).to.equal(120);
         });
         
         it("with property name", function(){
             expect([{val: 3},{val: 4},{val: 5}].select("val").sum()).to.equal(12);
         });
       });
       
       describe("where", function(){
         it("empty", function(){
             expect(emptyQuery.where(function(e){ return e;}).count()).to.equal(0);
         });
         it("more", function(){
             expect([3,4,5].where(function(e){ return e % 2;}).sum()).to.equal(8);
         });
       });
       
       describe("min", function(){
         it("empty", function(){
             expect(function(){emptyQuery.min()}).to.throw(emptyQuery.first.throws.empty);
         });
         
         it("one", function(){
             var elem = 4;
             expect([elem].min()).to.equal(elem);
         });
         
         it("more", function(){
             var elem = 4;
             expect([5,10,elem,5].min()).to.equal(elem);
         });
         
         it("more", function(){
             var elem = {index:2};
             expect([elem,{index:5}].min(function(e){return e.index;})).to.equal(elem);
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
             expect([elem,{index:5}].max(function(e){return e.index;})).to.equal(elem);
         });
         
         
       });
       
        describe("iterate", function(){
         it("empty", function(){
             [].iterate(function(){ throw Error("should not happen")});
             expect(true).to.equal(true);
         });
         
         it("more", function(){
             var res = "";
             [1,4,5].iterate(function(e){res += e });
             expect(res).to.equal("145");
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

    describe("selectMany", function() {
        it("empty", function () {
            expect(emptyQuery.selectMany().count()).to.equal(0);
            expect(emptyQuery.selectMany("val").count()).to.equal(0);
            expect(emptyQuery.selectMany("val","index").count()).to.equal(0);
        });

        it("straight element projection",function(){
            var res = [[1,2],[3],[4]].selectMany(function(e){ return e*e;}).each();
            expect(res[0]).to.equal(1);
            expect(res[3]).to.equal(16);

            res = [[{val: 1},{val: 2}],[{val: 3}],[{val: 4}]].selectMany("val").each();
            expect(res[0]).to.equal(1);
            expect(res[3]).to.equal(4);
        })
    });
});
