/**
 * Created by Rune on 08-06-2015.
 */
var getSeq = function(seq,projection){
    return projection ? seq.select(projection) : seq;
};
module.exports = function(proto) {
    proto.average = function (projection) {
        return this.sum(projection)/this.count();
    };

    proto.median = function(projection){
        var seq = getSeq(this,projection),
            half, i, current;
        half = seq.count() / 2;
        seq.reset();

        for(i = 0;i < half; seq.next() && i++){}
        current = seq.current();
        seq.next();
        return (current + seq.current())/2;
    };

    proto.variance = function(projection, mapper){
        var seq = getSeq(this,projection),
            avg = undefined, diff, i = 0,
            sumDiff = 0;
        if(!mapper) { avg = seq.average(); }
        seq.iterate(function(){
            diff = seq.current() - (avg || mapper(seq.current(),i));
            sumDiff += diff * diff;
            i++;
        });
        return sumDiff / seq.count();
    };

    proto.standardDeviation = function(projection, mapper){
        return Math.sqrt(this.variance(projection, mapper));
    };

    proto.standardError = function(projection, mapper){
        return this.standardDeviation(projection, mapper) / Math.sqrt(this.count());
    };

    proto.errorMarginAt95 = function(projection, mapper){
        return 1.96 * this.standardError(projection, mapper);
    };
};