 /* global describe it require*/

var Query = require("./../query.js"),
    expect = require("chai").expect,
    emptyQuery = new Query([]);
 
 describe("take", function(){
         it("empty", function(){
             expect(emptyQuery.take(1).count()).to.equal(0);
         });
         
         it("take more than we have", function(){
             var arr =[1,2,3,4,5], 
                 res = arr.take(10).each();
                 
             expect(res.length).to.equal(5);
             expect(res[0]).to.equal(arr[0]);
             expect(res[4]).to.equal(arr[4]);
         });
         
         it("take less than we have", function(){
             var arr =[1,2,3,4,5],
                 res = arr.skip(1).take(1);
             expect(res.single()).to.equal(arr[1]);
         });
     });
 