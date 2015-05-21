var Sequence = require("../Sequence.js"),
    expect = require("chai").expect;
   
describe("Sequence",function(){
    describe("count",function(){
    it("Counting nothing",function(){
        expect(Sequence([]).count()).to.equal(0);
        
    });
    it("Counting",function(){
        expect(Sequence([1,2,3,4,5]).count()).to.equal(5);
        
    });
    it("Counting with where",function(){
        expect(Sequence([1,2,3,4,5]).where(function(e){return e % 2;}).count()).to.equal(3);
    });
    });
    describe("first",function(){
        it("Should throw on empty",function(){
            var msg = "";
            try{
              var f = Sequence([]).first();
            } catch (e){
              msg = e;    
            }
            expect(msg).to.equal("No elements");
        });
    
        it("One and only",function(){
            expect(Sequence([1]).first()).to.equal(1);
        });
    
        it("many more",function(){
            expect(Sequence([2,1,3]).first()).to.equal(2);
        });
        
        it("with predicate",function(){
            expect(Sequence([2,1,3]).first(function(e){return e % 2;})).to.equal(1);
        });
    });
    
    describe("any",function(){
        it("Should throw on empty",function(){
            expect(Sequence([]).any()).to.equal(false);
        });
    
        it("One and only",function(){
            expect(Sequence([false]).any()).to.equal(true);
        });
    
        it("Many more",function(){
            expect(Sequence([false, false]).any()).to.equal(true);
        });
    });
    
    describe("last",function(){
        it("Should throw on empty",function(){
            var msg = "";
            try{
              var f = Sequence([]).last();
            } catch (e){
              msg = e;    
            }
            expect(msg).to.equal("No elements");
        });
    
        it("One and only",function(){
            expect(Sequence([1]).last()).to.equal(1);
        });
    
        it("many more",function(){
            expect(Sequence([2,1,3]).last()).to.equal(3);
        });
    });
    
    describe("each",function(){
        it("empty",function(){
            var arr = [],
                res = Sequence(arr).each();
            expect(res.length).to.equal(arr.length);
        });
        
        it("several",function(){
            var i,
                arr = [1,5,3],
                res = Sequence(arr).each();

           expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                expect(res[i]).to.equal(arr[i]);
            }
        });
        
        it("several with predicate",function(){
            var i,
                arr = [1,5,3],
                predicate = function(e){ return e % 2; },
                res = Sequence(arr).each(predicate);
                
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
                res = Sequence(arr).reverse().each();
            arr.reverse();    
            expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                   expect(res[i]).to.equal(arr[i]);
            }
        })
    });
    
    describe("distinct",function(){
        it("one",function(){
            
            var arr = [1],
                res = Sequence(arr).distinct().each();
                
            expect(res[0]).to.equal(1);
        });
        
        it("all the same",function(){
            
            var arr = [1,1,1],
                res = Sequence(arr).distinct().each();
                
            expect(res[0]).to.equal(1);
            expect(res.length).to.equal(1);
        });
        
        it("Mixed",function(){
            var i,arr = [1,2,1,2,3,4,3,4,5],
                res = Sequence(arr).distinct().each();
            arr = [1,2,3,4,5];    

            expect(res.length).to.equal(arr.length);
            for(i = 0;i<arr.length; i += 1){
                   expect(res[i]).to.equal(arr[i]);
            }
        });
    });
    
    describe("sort",function(){
        it("simple",function(){
            
            var arr = [1,2,5,3,4],
                res = Sequence(arr).sort().each();
            
            expect(res[0]).to.equal(arr[0]);
            expect(res[1]).to.equal(arr[1]);
            expect(res[2]).to.equal(arr[3]);
            expect(res[3]).to.equal(arr[4]);
            expect(res[4]).to.equal(arr[2]);
        });
    });
});
