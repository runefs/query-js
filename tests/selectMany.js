/**
 * Created by Rune on 01-07-2015.
 */
var Query = require("./../query.js"),
    expect = require("chai").expect,
    emptyQuery = Query([]);
    
describe("selectMany", function() {
    //it("empty", function () {
    //    expect(emptyQuery.selectMany().count()).to.equal(0);
    //    expect(emptyQuery.selectMany("val").count()).to.equal(0);
    //    expect(emptyQuery.selectMany("val","index").count()).to.equal(0);
    //});
    //
    //it("straight element projection",function(){
    //    var res = [[1,2],[3],[4]].selectMany(function(){ return this*this;}).each();
    //    expect(res[0]).to.equal(1);
    //    expect(res[3]).to.equal(16);
    //
    //    res = [[{val: 1},{val: 2}],[{val: 3}],[{val: 4}]].selectMany("val").each();
    //    expect(res[0]).to.equal(1);
    //    expect(res[3]).to.equal(4);
    //})
});