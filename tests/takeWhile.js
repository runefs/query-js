 /**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    emptyQuery = Query([]);

 
 describe("takeWhile",function(){
    "use strict";
    it("Simple",function(){
        var arr = [1,3,2,4,5],
            res = arr.takeWhile(function(){
                return this < 4;
            }).each();
        expect(res.length).to.equal(3);
        expect(res[0]).to.equal(arr[0]);
        expect(res[1]).to.equal(arr[1]);
        expect(res[2]).to.equal(arr[2]);
    });
});  