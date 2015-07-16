/* require */
var Tree, Query = function (arr) {
    "use strict";
    var undef = {},
        getSequqneceAndDefault = function(seq,predicate,def){
            var _this = typeof predicate === "function" ? seq.where(predicate) : seq;
            def = (typeof predicate === "function" ? def : predicate) || null;
            return { _this : _this,
                    def : def };
        },
        idProjection = function () {
            "use strict";
            return this;
        },
        FilteredQuery = function (_this) {
            var base = _this,
                FilteringQuery =
                function (predicate) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    this.next = function () {
                        var n;
                        while ((n = base.next())) {
                            if (predicate.call(base.current())) {
                                return true;
                            }
                        }
                        return n;
                    };
                };
            FilteringQuery.prototype = base;
            return FilteringQuery;
        };
    
    var seq = function() {
        
        var $this = this,
            index = -1;
        Object.defineProperty(this,"index",{
            enumerable : false,
            configurable : false,
            value : function(val){
                if(arguments.length === 1) { index = val; }
                return index;
                }
        });
        this.current = function(){
            return arr[this.index()];
        };

        this.reset = function(){
            this.index(-1);
        };
        this.index(-1);
        
        this.next = function(){
                $this.index($this.index()+1);
                return $this.index() < arr.length;
        };
        this.where = function (predicate) {
            var res = FilteredQuery(this);
            res.prototype = this;
            return new res(predicate);
        };
        this.select = function (projection) {
            var res = ProjectedQuery(this);
            return new res(projection);
        };
        this.selectMany = function (localProjection, elementProjection) {
            return this.concatenate(localProjection, elementProjection);
        };
        this.iterate = function (p) {
            var current
            this.reset();
            while (this.next()) {
                current = this.current();
                p.call(current,current);
            }
            return this;
        };
        var comparer = function(comp){
            return function (p) {
                var projection = p || idProjection,
                    first = this.first();
                return this.aggregate(function (min) {
                    var proj = projection.call(this, this);
                    return comp(projection.call(min,min), proj) ? min : this;
                }, projection.call(first,first));
            };
        };
        this.max = comparer(function (a,b) {
            return a > b;
        });
        this.min = comparer(function (a,b) {
            return a < b;
        });
        this.each = function (p) {
            var projection = p || idProjection,
                res = [],
                projected;
            if (this.__values__) {
                if (this.__values__[p]) {
                    return this.__values__[p];
                }
            } else {
                this.__values__ = {};
            }
            this.reset();
            while (this.next()) {
                projected = projection.call(this.current());
                res.push(projected);
            }
            return this.__values__[p] = res;
        };
        this.skip = function (count) {
            this.reset();
            var res = SkipQuery(this, function (i) {
                index = i;
            });
            return new res(count);
        };
        this.take = function (count) {
            var res = TakeQuery(this);
            return new res(count);
        };
        this.sum = function (projection) {
            var sum = 0,
                seq = arguments.length ? this.select(projection) : this;
            sum = seq.aggregate(function (sum) {
                return sum + this;
            }, sum);
            return sum;
        };
        this.product = function (projection) {
            var seq = projection ? this.select(projection) : this;
            this.reset();
            if (!this.any()) return 0;
            return seq.aggregate(function (prod) {
                return prod * this;
            }, 1);
        };
        this.aggregate = function (folder, seed) {
            var state = seed;
            this.reset();
            while (this.next()) {
                var current = this.current();
                state = folder.call(current, state, current);
            }
            return state;
        };
        this.average = function (p) {
            var count = 0,
                sum = 0,
                _this = p ? this.select(p) : this;


            _this.reset();
            if (!_this.next()) return undefined;
            do {
                count++;
                sum += _this.current();
            }
            while (_this.next());
            return sum / count;
        };
        this.concatenate = function (localProjection, elementProjection) {
            var res = ConcatenationQuery(this);
            if (arguments.length === 0) {
                return new res();
            } else if (arguments.length === 1 || (arguments.length === 2 && !elementProjection)) {
                return new res(localProjection);
            } else {
                return new res(localProjection, elementProjection);
            }
        };
        this.groupBy = function (keySelector, valueSelector) {
            var res = {},
                key,
                keys = this.select(keySelector).each(),
                values = valueSelector ? this.select(valueSelector || idProjection) : this;

            keys.reset();
            values.reset();
            while (keys.next()) {
                if (values.next()) {
                    key = keys.current();

                    if (!res.hasOwnProperty(key)) {
                        res[key] = [];
                    }
                    res[key].push(values.current());
                }
            }
            return KeyValueQuery(res)();
        };
        this.orderBy = function (projection) {
            var res = OrderedQuery(this, projection);
            return new res();
        };
        this.count = function (p) {
            var count = 0, predicate = p || function (e) {
                    return e !== undefined;
                };
            this.reset();
            while (this.next()) {
                count += predicate(this.current()) ? 1 : 0;
            }
            return count;
        };
        this.distinct = function (getter) {
            var keys = {};
            getter = getter || (function () {
                    return this;
                });
            return this.where(function () {
                var obj = getter.call(this,this);
                if (!keys.hasOwnProperty(obj)) {
                    keys[obj] = obj;
                    return true;
                }
                return false;
            });
        };
        this.reverse = function () {
            return this.each().reverse();
        };
        this.lastOrDefault = function (predicate, def) {
            var seqAndDef = getSequqneceAndDefault(seq, predicate, def),
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
        };
        this.last = function (predicate) {
            var res = predicate ? this.lastOrDefault(predicate, undef) : this.lastOrDefault(undef);

            if (res === undef) throw new Error(this.last.throws.empty);
            return res;
        };
        this.singleOrDefault = function (predicate, def) {
            var _this = typeof predicate === "function" ? this.where(predicate) : this,
                res = _this.firstOrDefault(predicate, undef);
            def = (typeof predicate === "function" ? def : predicate) || null;
            if (res === undef) return def;
            _this.reset();
            if (_this.skip(1).any()) throw new Error(this.single.throws.tooMany);

            return res;
        };
        this.single = function (predicate) {
            var res = predicate ? this.singleOrDefault(predicate, undef) : this.singleOrDefault(undef);

            if (res === undef) throw new Error(this.single.throws.empty);
            return res;
        };
        this.first = function (predicate) {
            var _this;
            this.reset();

            _this = typeof predicate === "function" ? this.where(predicate) : this;
            if (_this.next()) {
                return _this.current();
            } else {
                throw new Error(this.first.throws.empty);
            }

        };
        this.firstOrDefault = function (predicate, def) {
            def = (typeof predicate === "function" ? def : predicate) || null;
            try {
                return this.first(predicate);
            } catch (e) {
                return def;
            }
        };
        this.any = function (predicate) {
            try {
                return this.first(predicate, undef) !== undef && true;
            } catch (e) {
                return false;
            }
        };
        this.takeWhile = function (predicate) {
            if (arguments.length === 0 || !(typeof predicate === "function" || typeof predicate === "string")) throw new Error(this.all.throws.noPredicate);
            var res = TakeWhileQuery(this);
            return new res(predicate);
        };
        this.all = function (predicate,state) {
            if (typeof predicate === "string") {
                predicate = function(){return this[predicate];};
            }
            if (arguments.length === 0 || typeof predicate !== "function") throw new Error(this.all.throws.noPredicate);
            this.reset();
            state = state || true;
            while (this.next()) {
                state = predicate.call(this.current(),state);
                if (!state) return false;
            }
            return true;
        };
        this.permutations = function () {
            var res = PermutationQuery(this);
            return new res();
        };
    };
    seq =  new seq();
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
    "use strict";
    step = step || 1;
    var ctor = function () {
            var current, c;

            //noinspection JSPotentiallyInvalidUsageOfThis
            this.reset = function () {
                current = start - step;
                c = count || 0;
            };
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.next = count ?
                function () {
                    current += step;
                    c -= count ? 1 : 0;
                    return c >= 0;
                } : function () {
                    current += step;
                    return true;
                };
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.current = function () {
                return current;
            };
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.setIndex = function (i) {
                if (!count && i >= count) return false;
                current += step * i + start;
                c = count ? count - i : count;
		        return true;
            };
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.skip = function (count) {
                var res = SkipQuery(this, function (i) {
                    c -= i;
                    current += step * i + start;
                });
                return new res(count);
            };
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.reset();
        };

    ctor.prototype = new Query();
    return ctor;
},
TakeQuery = function (_this) {
    "use strict";
    var base = _this,
        TakeQuery =
        function (count) {
            var c = count;
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.next = function () {
                return (base.next() && c--);
            };
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.reset = function () {
                base.reset();
                c = count;
            };
        };
    TakeQuery.prototype = base;
    return TakeQuery;
},
ProjectedQuery = (function (_this) {
    "use strict";
        var base = _this,
            ProjectingQuery = function (p) {
                p = p || idProjection;
                var projection = typeof p === "function" 
                                 ? p
                                 : function(){ return this[p];};
                this.current = function () {
                    var current = base.current();
                    return projection.call(current,current);
                };
            };
        ProjectingQuery.prototype = base;
        return ProjectingQuery;
}),
ConcatenationQuery = (function(_this){
    "use strict";
    var base = _this,
        ConcatenationQuery = function(localProjection, elementProjection){
           var sequences,sequence;
           if(arguments.length === 1){
               elementProjection = localProjection;
               localProjection = undefined;
           }
           sequences = localProjection  ? base.select(localProjection) : base;
           if(!sequences.next()){
               return Query([]);
           }
           this.reset = function(){
                sequences.reset();
                sequences.next();
                sequence = sequences.current();
                sequence.reset();
                sequence = elementProjection ? sequence.select(elementProjection) : sequence;
           };
           this.next = function(){
               while(!sequence || !sequence.next()) {
                   if(sequences.next()){
                       sequence = sequences.current();
                       sequence.reset();
                       sequence = elementProjection ? sequence.select(elementProjection) : sequence;
                   } else {
                       return false;
                   }
           }
           return true;
        };
        this.current = function(){
            return sequence.current();
        };
    };
    ConcatenationQuery.prototype = base;
    return ConcatenationQuery;
}),
TakeWhileQuery = (function (_this) {
    "use strict";
        var base = _this,
            TakeWhileQuery = function (predicate) {
                this.next = function () {
                    var current;
                    if(base.next()) {
                        current = base.current();
                        return predicate.call(current,current);
                    } else {
                        return false;
                    }
                };
            };
        TakeWhileQuery.prototype = base;
        return TakeWhileQuery;
}),
OrderedQuery = (function(seq, projection){
    "use strict";
        if(Tree === undefined) {
            Tree = require("functional-red-black-tree");
        }
        var tree = Tree(),
        current;
        seq = projection ? seq.select(function(){ return {key : projection.call(this), value : this};})
                         : seq.select(function(){ return {key : this,             value : this};});
        
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
    "use strict";
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
PermutationQuery = (function (_this) {
    "use strict";
    var base = _this,
        permutationQuery = function () {
            var head,
                tail,
                onlyHead,
                array;

            if (base.any()) {
                this.reset = function () {
                    array = base.select(function(){return this;}).each();
                    head = [array.shift()];
                    if (array.length) {
                        tail = array.permutations();
                        onlyHead = false;
                    } else {
                        onlyHead = true;
                    }
                };
                this.reset();
                if (onlyHead) {
                    console.log("only head", head);
                    this.next = function() {
                        var res = onlyHead;
                        if(!onlyHead){
                            head = undefined;
                        }
                        onlyHead = false;
                        return res;
                    };
                    
                    this.current = function(){
                        return head;
                    }
                } else {
                    console.log("got tail", array);
                    this.next = function(){
                        return tail.next();
                    }
                    this.current = function(){
                        console.log("head", head, "tail", tail.current().each())
                        return head.concatenate(tail.current());
                    }
                }
            } else {
                throw new Error("Query is empty")
            }
            
        };
    permutationQuery.prototype = base;
    return permutationQuery;
}),
SkipQuery = (function (_this) {
    "use strict";
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
    "use strict";
    var f, it = new Query([]);
    for (f in it) {
        if (it.hasOwnProperty(f) && !proto.hasOwnProperty(f)) {
            (function (f) {
                proto[f] = function () {
                    var query = this.query();
                    return query[f].apply(query, arguments);
                };
            })(f);
        }
    }
    proto.query = function(){
        var query =  new Query(this);
        Object.defineProperty(this,"query",{
            enumerable : false,
            configurable : false,
            value : function(){return query;}
        });
        return this.query();
    };
    return proto;
};

Query.range = function (start, count, step) {
    "use strict";
        var rangeQuery = RangeQuery(start, count, step);
        return new rangeQuery();
};
    
Query.patch(Array.prototype);
Query.generate = function(generator, seed){
    "use strict";
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
if(!Object.prototype.keys) {
    Object.prototype.keys = function () {
        var res = [];
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                res.push(prop);
            }
        }
        return res;
    };
}
module.exports = function(arr){ return Query(arr);};