var Tree, Query = function (arr) {
    var undef = {},
        index = -1,
        getSequqneceAndDefault = function(seq,predicate,def){
            var _this = typeof predicate === "function" ? seq.where(predicate) : seq;
            def = (typeof predicate === "function" ? def : predicate) || null;
            return { _this : _this,
                    def : def };
        },
        idProjection = function (obj) { return obj; },
        FilteredQuery = function (_this) {
            var base = _this, n,
                FilteringQuery =
                function (predicate) {
                    predicate = predicate || function () { return true; };
                    this.next = function () {
                        while ((n = base.next())) {
                            if (predicate(base.current())) return n;
                        }
                        return n;
                    };
                };
            FilteringQuery.prototype = base;
            return FilteringQuery;
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
            var res = FilteredQuery(this);
            res.prototype = this;
            return new res(predicate);
        },
        select: function (projection) {
            var res = ProjectedQuery(this);
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
            //and we have a simple Query however currently the filtering Querys would break this
            var projection = p || idProjection,
                res = [], 
                projected;
    	    if (this.__values__){
    		    if(this.__values__[p]) {
    		        return this.__values__[p];
    		    }
    	    } else {
    		    this.__values__ = {};
    	    }
            this.reset();
            while (this.next()) {
                projected = projection(this.current(), index);
                res.push(projected);
            }
            return this.__values__[p] = res;
        },
        skip: function (count) {
            var res = SkipQuery(this, function (i) { index = i; });
            return new res(count);
        },
        take: function (count) {
            var res = TakeQuery(this);
            return new res(count);
        },
        sum: function (p) {
            var sum = 0, projection = p || idProjection;
            sum = this.aggregate(function (sum, elem) { return sum + projection(elem); }, sum);
            return sum;
        },
        product: function (p) {
            var product = 1, projection = p || idProjection;
            this.reset();
            if(!this.any()) return 0;
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
            valueSelector = valueSelector || function (obj) {return obj;};
            this.reset();
            while (this.next()) {
                obj = this.current();
                key = keySelector(obj);
                if(!res.hasOwnProperty(key)){
                    res[key] = [];
                }
                res[key].push(valueSelector(obj));
            }
            return KeyValueQuery(res)();
        },
        orderBy: function (projection) {
            var res = OrderedQuery(this,projection);
            return new res();
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
        lastOrDefault: function (predicate, def) {
            var seqAndDef = getSequqneceAndDefault(seq, predicate,def), 
                _this = seqAndDef._this,
                c = seqAndDef.def;
            
            _this.reset();
            
            if (!_this.next()) {
                return c;
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
        last : function(predicate){
            var res = predicate ? this.lastOrDefault(predicate,undef) : this.lastOrDefault(undef);

            if(res === undef) throw new Error(this.last.throws.empty);
            return res;
        },
        singleOrDefault : function(predicate,def){
            var _this = typeof predicate === "function" ? this.where(predicate) : this,
                res = _this.firstOrDefault(predicate,undef);
            def = (typeof predicate === "function" ? def : predicate) || null;
            if(res === undef) return def;
            _this.reset();
            if(_this.skip(1).any()) throw new Error(this.single.throws.tooMany);
            
            return res;
        },
        single : function(predicate){
            var res = predicate ? this.singleOrDefault(predicate,undef) : this.singleOrDefault(undef);

            if(res === undef) throw new Error(this.single.throws.empty);
            return res;
        },
        first: function (predicate) {
            var _this;
            this.reset();
            
            _this = typeof predicate === "function" ? this.where(predicate) : this;
            if (_this.next()) {
                return _this.current();
            } else {
                throw new Error(this.first.throws.empty);
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
			    return this.first(predicate, undef) !== undef && true;
            } catch (e){
                return false;
            }
	    },
	    all: function(predicate){
	        if(!predicate) throw new Error(this.all.throws.noPredicate);
	        this.reset();
	        while(this.next()){
	            if(!predicate(this.current())) return false;
	        }
	        return true;
	    }
    };
    seq.single.throws = {
        empty   : "Query is empty",
        tooMany : "Expecting only one element"
    };
    seq.singleOrDefault.throws = {
        tooMany : seq.single.throws.tooMany
    };
    seq.first.throws = {
        empty : seq.single.throws.empty
    };
    seq.last.throws = seq.first.throws;
    seq.all.throws = {
        noPredicate : "No predicate specified"
    };
    return seq;
},
RangeQuery = function (start, count, step) {
    step = step || 1;
    var base = new Query(),
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
                var res = SkipQuery(this, function (i) {
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
TakeQuery = function (_this) {
    var base = _this,
        TakeQuery =
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
    TakeQuery.prototype = base;
    return TakeQuery;
},
ProjectedQuery = (function (_this) {
        var base = _this,
            ProjectingQuery = function (projection) {
                projection = projection || function (d) { return d };
                this.current = function () {
                    return projection(base.current());
                };
            };
        ProjectingQuery.prototype = base;
        return ProjectingQuery;
    }),
OrderedQuery = (function(seq, projection){
        if(Tree === undefined) Tree = require("functional-red-black-tree");
        var tree = Tree(),
        current;
        seq = projection ? seq.select(function(e){ return {key : projection(e), value : e};}) 
                         : seq.select(function(e){ return {key : e,             value : e};});
        
        while(seq.next()){
            current = seq.current();
            tree = tree.insert(current.key,current.value);
        }
        var base = Query(tree.keys),
            SortedKeyQuery = function(){
                this.current = function(){
                    return tree.get(base.current());
                };
            };
        SortedKeyQuery.prototype = base;
        return SortedKeyQuery;
}),
KeyValueQuery = (function (obj) {
        var base = Query(obj.keys()),
            KeyValueQuery = function () {
                this.current = function () {
                    var key = base.current();
                    return { key : key, value: obj[key]};
                };
            };
        KeyValueQuery.prototype = base;
        return function(){
            var res = new KeyValueQuery(),prop;
            for(prop in obj){
                    if(obj.hasOwnProperty(prop)
                       && !res.hasOwnProperty(prop)){
                        res[prop] = obj[prop];
                    }
            }
            return res;
        };
    }),
SkipQuery = (function (_this) {
        var base = _this,
            SkipQuery = function (count) {
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
        SkipQuery.prototype = base;
        return SkipQuery;
    });
Query.patch = function (proto) {
    var f, it = new Query([]);
    for (f in it) {
        if (it.hasOwnProperty(f) && !proto.hasOwnProperty(f)) {
            (function (f) {
                proto[f] = function () {
                    var it = Query(this);
                    return it[f].apply(it, arguments);
                };
            })(f);
        }
    }

    Query.range = function (start, count, step) {
        var rangeQuery = RangeQuery(start, count, step);
        return new rangeQuery();
    };
    return proto;
};
Query.patch(Array.prototype);
Query.generate = function(generator, seed){
    var arr = [],
        QueryGenerator = (function (_this) {
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
    })(new Query(arr));
    return new QueryGenerator(generator);
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

module.exports = function(arr){ return Query(arr);};