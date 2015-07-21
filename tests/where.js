/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    isOdd =    function(){"use strict"; return this % 2;},
    getIndex = function(){"use strict"; return this.index;},
    getValue = function(){"use strict"; return this.value;},
    emptyQuery = Query([]);

describe("where", function(){
    "use strict";
    it("empty", function(){
        expect(emptyQuery.where(function(){ return this;}).count()).to.equal(0);
    });
    it("more", function(){
        var res = [3,4,5].where(isOdd).each();
        expect(res.length).to.equal(2);
        expect(res[0]).to.equal(3);
        expect(res[1]).to.equal(5);
    });
});