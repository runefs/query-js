console.log("running");
var Sequence = function (arr) {
    var index = -1,
        idProjection = function (obj) { return obj; },
        FilteredSequence = function (_this) {
            var base = _this, n,
                FilteringSequence =
                function (predicate) {
                    predicate = predicate || function () { return true; };
                    this.next = function () {
                        while ((n = base.next())) {
                            if (predicate(base.current())) return n;
                        }
                        return n;
                    };
                };
            FilteringSequence.prototype = base;
            return FilteringSequence;
        };

    var seq = {
        next: function () {
            return ++index < arr.length;
        },
        current: function () {
            return arr[index];
        },
        reset: function () {
            index = -1;
        },
        where: function (predicate) {
            var res = FilteredSequence(this);
            res.prototype = this;
            return new res(predicate);
        },
        select: function (projection) {
            var res = ProjectedSequence(this);
            return new res(projection);
        },
	    iterate: function(p){
	        this.reset();
	        while(this.next()){
		        p(this.current());
	        }
	        return this;
	    },
        max: function (p) {
            var projection = p || idProjection;
            return this.aggregate(function (max, elem) {
                var proj = projection(elem);
                return (projection(max) > proj) ? max : elem;
            }, projection(this.first()));
        },
        min: function (p) {
            var projection = p || idProjection;
            return this.aggregate(function (min, elem) {
                var proj = projection(elem);
                return projection(min) < proj ? min : elem;
            }, projection(this.first()));
        },
        each: function (p) {
            //could return the array directly if there's no predicate
            //and we have a simple sequence however that would make sort inconsistent
            //since sort on array mutates the array and sort would then mutate the original array
            var projection = p || idProjection,
                res = [], projected, i = 0;
    	    if (this.__values__){
    		    if(this.__values__[p]) {
    		        return this.__values__[p];
    		    }
    	    } else {
    		    this.__values__ = {};
    	    }
            this.reset();
            while (this.next()) {
                projected = projection(this.current(), index)
                res.push(projected);
            }
            return this.__values__[p] = res;
        },
        skip: function (count) {
            var res = SkipSequence(this, function (i) { index = i; });
            return new res(count);
        },
        take: function (count) {
            var res = TakeSequence(this);
            return new res(count);
        },
        sum: function (p) {
            var sum = 0, projection = p || idProjection;
            sum = this.aggregate(function (sum, elem) { return sum + projection(elem); }, sum);
            return sum;
        },
        product: function (p) {
            var product = 0, projection = p || idProjection;
            product = this.aggregate(function (prod, elem) { return prod * projection(elem); }, product);
            return product;
        },
        aggregate : function(folder,seed){
            var state = seed;
            this.reset();
            while (this.next()) {
                state = folder(state, this.current());
            }
            return state;
        },
        groupBy: function (keySelector, valueSelector) {
            var res = {}, key, obj;
            valueSelector = valueSelector || (function (obj, value) {
                if (!value) {
                    return [obj];
                } else {
                    value.push(obj);
                    return value;
                }
            });
            this.reset();
            while (this.next()) {
                obj = this.current();
                key = keySelector(obj);
                res[key] = valueSelector(obj, res[key]);
            }
            return KeyValueSequence(res)();
        },
        sort: function (sorter) {
            var res = this.each().sort(sorter);
            return Sequence(res);
        },
        count : function(p){
            var count = 0,projection = p || function(e){ return e !== undefined;};
            while(this.next()){
                count += projection(this.current()) ? 1 : 0;
            }
            return count;
        },
        distinct: function (getter) {
            var keys = {};
            getter = getter || (function (d) { return d });
            return this.where(function (d) {
                var obj = getter(d);
                if (!keys.hasOwnProperty(obj)) {
                    keys[obj] = obj;
                    return true;
                }
                return false;
            }).select(getter);
        },
        reverse: function () {
            return this.each().reverse();
        },
        last: function (predicate) {
            var c, _this;
            this.reset();
            _this = predicate ? _this.where(predicate) : this;
            
            if (!_this.next()) {
                throw _this.last.throws.empty;
            }
            c = _this.current();

            while (true) {
                if (_this.next()) {
                    c = _this.current();
                } else {
                    return c;
                }
            }
        },
        singleOrDefault : function(predicate,def){
            var _this = typeof predicate === "function" ? this.where(predicate) : this,
                undef = {},
                res = _this.firstOrDefault(predicate,undef);
            def = (typeof predicate === "function" ? def : predicate) || null;
            if(res === undef) return def;
            _this.reset();
            if(_this.skip(1).any()) throw this.single.throws.tooMany;
            
            return res;
        },
        single : function(predicate){
            var undef = {},
                res = predicate ? this.singleOrDefault(predicate,undef) : this.singleOrDefault(undef);

            if(res === undef) throw this.single.throws.empty;
            return res;
        },
        first: function (predicate) {
            var _this;
            this.reset();
            
            _this = typeof predicate === "function" ? this.where(predicate) : this;
            if (_this.next()) {
                return _this.current();
            } else {
                throw this.first.throws.empty;
            }
            
        },
        firstOrDefault: function (predicate, def) {
            def = (typeof predicate === "function" ? def : predicate) || null;
            try{
                return this.first(predicate);
            } catch (e) {
                return def;
            }
        },
        any: function(predicate){
            try{
			    return this.first(predicate) !== undefined && true;
            } catch (e){
                return false;
            }
	    }
    };
    seq.single.throws = {
        empty   : "Sequence is empty",
        tooMany : "Expecting only one element"
    };
    seq.singleOrDefault.throws = {
        tooMany : seq.single.throws.tooMany
    };
    seq.first.throws = {
        empty : seq.single.throws.empty
    }
    seq.last.throws = seq.first.throws;
    return seq;
},
RangeSequence = function (start, count, step) {
    step = step || 1;
    var base = new Sequence(),
        ctor = function () {
            var current, c;

            this.reset = function () {
                current = start - step;
                c = count || 0;
            };
            this.next = count ?
                function () {
                    current += step;
                    c -= count ? 1 : 0;
                    return c >= 0;
                } : function () {
                    current += step;
                    return true;
                };
            this.current = function () {
                return current;
            };
            this.setIndex = function (i) {
                if (!count && i >= count) return false;
                current += step * i + start;
                c = count ? count - i : count;
		return true;
            };
            this.skip = function (count) {
                var res = SkipSequence(this, function (i) {
                    c -= i;
                    current += step * i + start;
                });
                return new res(count);
            };

            this.reset();
        };

    ctor.prototype = base;
    return ctor;
},
TakeSequence = function (_this) {
    var base = _this,
        TakeSequence =
        function (count) {
            var c = count;
            this.next = function () {
                return (base.next() && c--);
            };
            this.reset = function () {
                base.reset();
                c = count;
            };
        };
    TakeSequence.prototype = base;
    return TakeSequence;
},
    ProjectedSequence = (function (_this) {
        var base = _this,
            ProjectingSequence = function (projection) {
                projection = projection || function (d) { return d };
                this.current = function () {
                    return projection(base.current());
                };
            };
        ProjectingSequence.prototype = base;
        return ProjectingSequence;
    }),
    KeyValueSequence = (function (obj) {
        var base = Sequence(obj.keys()),
            KeyValueSequence = function () {
                this.current = function () {
                    var key = base.current();
                    return { key : key, value: obj[key]};
                };
            };
        KeyValueSequence.prototype = base;
        return function(){
            var res = new KeyValueSequence(),prop;
            for(prop in obj){
                    if(obj.hasOwnProperty(prop)
                       && !res.hasOwnProperty(prop)){
                        res[prop] = obj[prop];
                    }
            }
            return res;
        };
    }),
    SkipSequence = (function (_this) {
        var base = _this,
            SkipSequence = function (count) {
                var c;
                this.reset = function () {
                    c = count;
                };

                this.next = function() {
                    for (; c > 0; c--) {
                        if (!base.next()) return false;
                    }
                    return base.next();
                };
                this.reset();
            };
        SkipSequence.prototype = base;
        return SkipSequence;
    });
Sequence.patch = function (proto) {
    var f, it = new Sequence([]);
    for (f in it) {
        if (it.hasOwnProperty(f) && !proto.hasOwnProperty(f)) {
            (function (f) {
                proto[f] = function () {
                    var it = Sequence(this);
                    return it[f].apply(it, arguments);
                };
            })(f);
        }
    }

    Sequence.range = function (start, count, step) {
        var rangeSequence = RangeSequence(start, count, step);
        return new rangeSequence();
    };
    return proto;
};
Sequence.patch(Array.prototype);
Sequence.generate = function(generator, seed){
    var arr = [],
        SequenceGenerator = (function (_this) {
	    var sg = function (generator) {
    		var _current = seed;
    		this.next = function(){
    		      _current = generator(_current);
    		      arr.push(_current);
    		      return _current && true;
    		};
    		this.current = function () {
    		    return _current;
    		};
	    };
	    sg.prototype = _this;
	    return sg;
    })(new Sequence(arr));
    return new SequenceGenerator(generator);
};
Object.prototype.keys = function(){ 
    var res = []; 
    for(var prop in this){
       if(this.hasOwnProperty(prop)) {
           res.push(prop);
       }
    }
 return res;
};

module.exports = function(arr){ return Sequence(arr);};