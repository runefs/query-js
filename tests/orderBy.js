 /**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect;
 
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