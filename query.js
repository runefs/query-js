/* require */

var defineProperty = function(obj,name,v){
        Object.defineProperty(obj,name, {
                enumerable : false,
                configurable : false,
                writable : false,
                value : v
        });
    },
    definePublicProperty = function(obj,name,v){
        Object.defineProperty(obj,name, {
                enumerable : true,
                configurable : false,
                writable : false,
                value : v
        });
    },
    defineGetter = function(obj,name,getter){
        Object.defineProperty(obj,name,{
                    enumerable : false,
                    configurable : false,
                    get : getter
                });
    },
    define = {},
    methods = ["next","reset", "clone"],
    getters = ["current","length"],
    create = function(collection, creator){
        var prop;
        for(prop = 0; prop<collection.length; prop++){
            (function(name){    
               define[name] = function(obj,f){
                   creator(obj,name,f);
               };
            })(collection[prop]);
        }    
    };
    
    create(methods,defineProperty);
    create(getters,defineGetter);
    define.unknownLength = function(obj){
        define.length(obj,function(){return null;});
    };
    var Tree,
    idProjection = function(){"use strict"; return this;},
    Query = function (arr) {
    "use strict";
    var undef = {},
        idProjection = function () {
            "use strict";
            return this;
        },
        FilteringEnumerator = function (base,predicate) {
            var _current;

            define.next(this, function () {
                while (base.next()) {
                    if (predicate.call(base.current,base.current)) {
                        _current = base.current;
                        return true;
                    }
                }
                return false;
            });
            define.current(this,function(){return _current;});
            define.unknownLength(this);
            define.reset(this,function(){
                base.reset();
            });
            define.clone(this,function(){
                return new FilteringEnumerator(base.clone(),predicate);
            });
        };
    
    var seq = function(enumerator) {
        if (!enumerator) { throw new Error("No enumerator supplied");}
        var eachCached = false,
            _length = 0;
        defineProperty(this,"createSequence", function() {
            var ctor = arguments[0],
                en = this.getEnumerator(),
                newEnumerator;
                
            switch (arguments.length-1) {
                case 0:
                    newEnumerator = new ctor(en);
                    break;
                case 1:
                    newEnumerator = new ctor(en, arguments[1]);
                    break;
                case 2:
                    newEnumerator = new ctor(en, arguments[1],arguments[2]);
                    break;
                case 3:
                    newEnumerator = new ctor(en, arguments[1],arguments[2],arguments[3]);
                    break;
            }
            return new seq(newEnumerator);
        });
        definePublicProperty(this,"getEnumerator",function(){return enumerator.clone();});
        definePublicProperty(this,"where", function (predicate) {
            return this.createSequence(FilteringEnumerator,predicate);
        });
        definePublicProperty(this,"select", function (projection) {
            return this.createSequence(ProjectingEnumerator,projection);
        });
        definePublicProperty(this,"iterate", function (p) {
            var current, enumerator = this.getEnumerator();
            while (enumerator.next()) {
                current = enumerator.current;
                p.call(current,current);
            }
            return this;
        });
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
        define.length(this,function(){
                if (!eachCached) {
                     this.each();
                }
                return _length;
        })
        definePublicProperty(this,"each", function (p) {
            var res;
            if (p) {
                 res = this.select(p).each();
            } else {
                 if (!eachCached) {
                     enumerator.reset();
                     while (enumerator.next()) {
                         this[_length] = enumerator.current;
                         _length++;
                     }
                     eachCached = true;
                 }
                 res = this;
            }
            return res;
        });
        definePublicProperty(this, "skip",  function (count) {
            return this.createSequence(SkipQuery,count);
        });
        this.take = function (count) {
            return this.createSequence(TakeEnumerator, count);
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
            
            if (!this.any()) return 0;
            return seq.aggregate(function (prod) {
                return prod * this;
            }, 1);
        };
        this.aggregate = function (folder, seed) {
            var state = seed;
            enumerator.reset();
            while (enumerator.next()) {
                var current = enumerator.current;
                state = folder.call(current, state, current);
            }
            return state;
        };
        this.average = function (p) {
            var count = 0,
                sum = 0,
                enumerator = (p ? this.select(p) : this).getEnumerator();

            if (!enumerator.next()) return undefined;
            do {
                count++;
                sum += enumerator.current;
            }
            while (enumerator.next());
            return sum / count;
        };
        definePublicProperty(this,"concatenate", function (other) {
            if (arguments.length === 0) return this;
            if (!other.any()) return this;
            if (!this.any()) return other;
            
            return this.createSequence(ConcatenationEnumerator, other.getEnumerator());
        });
        this.groupBy = function (keySelector, valueSelector) {
            var res = {},
                key,
                index,
                keysEnumerator = this.select(keySelector).getEnumerator(),
                valuesEnumerator = (valueSelector ?
                                    this.select(valueSelector)
                                    : this.select(idProjection)).getEnumerator();

            while (keysEnumerator.next() && valuesEnumerator.next()) {
                    key = keysEnumerator.current;
                    if (!res.hasOwnProperty(key)) {
                        res[key] = [];
                    }
                    res[key].push(valuesEnumerator.current);
            }
            
            var seq = this.createSequence(function(temp,res){return new KeyValueEnumerator(res);}, res);
            var prop;
            for(prop in res){
                    if(res.hasOwnProperty(prop)
                       && !seq.hasOwnProperty(prop)){
                        seq[prop] = res[prop];
                    }
            }
            return seq;
        };
        definePublicProperty(this, "orderBy", function (projection) {
            return this.createSequence(OrderedEnumerator, projection);
        });
        definePublicProperty(this,"count", function (p) {
            var count = 0,
                predicate = p || function (e) {
                    return e !== undefined;
                };
            
            return this.select(predicate).length;
        });
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
        definePublicProperty(this,"reverse", function () {
            return this.aggregate(function(st){st.push(this); return st;},[]).reverse();
        });
        this.lastOrDefault = function (predicate, def) {
            var p = arguments.length == 2
                    || typeof predicate === 'function' ? predicate : undefined,
                enumerator = (p ? this.where(p) : this).getEnumerator(),
                c;
            def = def || predicate;
            enumerator.reset();
            if (def === undefined) {
                throw new Error("Must supply a default");
            }

            if (!enumerator.next()) {
                return def;
            }
            c = enumerator.current;
            
            while (true) {
                if (enumerator.next()) {
                    c = enumerator.current;
                } else {
                    return c;
                }
            }
        };
        definePublicProperty(this,"last", function (predicate) {
            var res = predicate ? this.lastOrDefault(predicate, undef) : this.lastOrDefault(undef);

            if (res === undef) throw new Error(this.last.throws.empty);
            return res;
        });
        this.singleOrDefault = function (predicate, def) {
            var _this = typeof predicate === "function" ? this.where(predicate) : this,
                res = _this.firstOrDefault(predicate, undef);
            def = (typeof predicate === "function" ? def : predicate) || null;
            if (res === undef) return def;

            if (_this.skip(1).any()) throw new Error(this.single.throws.tooMany);

            return res;
        };
        this.single = function (predicate) {
            var res = predicate ? this.singleOrDefault(predicate, undef) : this.singleOrDefault(undef);

            if (res === undef) throw new Error("sequence is empty");
            return res;
        };
        this.first = function (predicate) {
            var enumerator = (typeof predicate === "function"
                              ? this.where(predicate)
                              : this).getEnumerator();
            
            if (enumerator.next()) {
                return enumerator.current;
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
            return this.createSequence(TakeWhileEnumerator,predicate);
        };
        definePublicProperty(this,"all", function (predicate,state) {  
            if (typeof predicate === "string") {
                predicate = function(){return this[predicate];};
            }
            if (arguments.length === 0 || typeof predicate !== "function") throw new Error("No predicate provided");

            state = state || true;
            while (enumerator.next()) {
                state = predicate.call(enumerator.current,state);
                if (!state) return false;
            }
            return true;
        });
        this.permutations = function () {
            var res = PermutationQuery(this);
            return new res();
        };
    };
    var en = arr.clone && arr.reset ? arr : new ArrayEnumerator(arr);
    return new seq(en);
};

var ArrayEnumerator = function(array){
    var _index = -1,
        _current;
        
    define.next(this, function(){
        _index++;
        _current = array[_index];
        return _index < array.length;
    });
    
    define.current(this, function(){ return _current; });
    define.length(this, function(){ return array.length; });
    define.reset(this,function(){
        _index = -1;
    });
    define.clone(this,function(){
        return new ArrayEnumerator(array);
    })
},
RangeEnumerator = function (start, count, step) {
    "use strict";
    step = step || 1;
    count = count || null; //we don't won't undefined here
    var c;
    define.reset(this, function () {
        c = -1;
        _current = start - step;
    });

    define.next(this, function () {
            c++;
            _current += step;
            return (!count || count > c);
        });
    define.current(this, function(){return _current;});
    define.length(this, function(){ return count; });
},
TakeEnumerator = function (base,count) {
    "use strict";

    var c = count,
        _current;
        
    define.next(this, function () {
        var n;
        c--;
        n = c >= 0 && base.next();
        _current = n ? base.current : undefined;
        return n;
    });
    
    define.reset(this, function () {
        base.reset();
        c = count;
        _current = undefined;
    });
    define.current(this, function(){ return base.current; });
    define.clone(this,function(){ return new TakeEnumerator(base.clone(),count);});
    if (base.length) {
        define.length(this,function(){return Math.max(count, base.length); });
    } else{
        define.unknownLength(this);
    }
},
ProjectingEnumerator = function (base, p) {
    "use strict";
    var _current;
    p = p || idProjection;
    var projection = typeof p === "function" 
                     ? p
                     : function(){ return this[p];};
    define.current(this,function () { return _current; });
    define.next(this,function(){
            if(base.next()){
                _current = base.current;
                _current = projection.call(_current,_current);
                return true;
            }
            return false;
    });
    define.length(this,function(){return base.length;});
    define.clone(this,function(){return new ProjectingEnumerator(base.clone(),projection);});
    define.reset(this,function(){
        base.reset();
    });
},
ConcatenationEnumerator = function(first, second){
    "use strict";
    var enumerator = first,
        _current;
               
    define.reset(this, function(){
         first.reset();
         second.reset();
    });
    
    define.next(this, function(){
          if(enumerator.next()){
                _current = enumerator.current;
          } else if(enumerator === first){
                enumerator = second;
                return this.next();
          } else {
                _current = undefined;
                return false;
          }
          return true;  
    });
    
    define.current(this,function(){ return _current; });
    define.clone(this,function(){
        new ConcatenationEnumerator(first.clone(),second.clone());
    })
    
    if (first.length !== undefined && second.length !== undefined) {
        define.length(this,
            (first.length === null || second.length === null) ?
              function(){ return null; }
              : function(){ return first.length + second.length; }
        );
    } else{
        define.length(this,function(){return undefined;});
    }
},
TakeWhileEnumerator = function (enumerator,predicate) {
    "use strict";
    define.next(this, function () {
        var current;
        if(enumerator && enumerator.next()) {
            current = enumerator.current;
            return predicate.call(current,current);
        } else {
            enumerator = undefined;
            return false;
        }
    });
    
    define.reset(this,function(){
        enumerator.reset();
    });
    define.clone(this,function(){return new TakeWhileEnumerator(enumerator.clone(),predicate);});   
    define.unknownLength(this);
    define.current(this,function(){
        return enumerator.current;
    })
},
OrderedEnumerator = function(en, projection){
    "use strict";
    if(Tree === undefined) {
        Tree = require("functional-red-black-tree");
    }
    en.next();
    
    var tree = Tree(),
        keys,
        current,
        seq = new Query(en).select(projection ? projection : function(){
                return {key : this, value : this};});
        en = seq.getEnumerator();
        while(en.next()){
            current = en.current;
            tree = tree.insert(current.key,current.value);
        }
        
        keys = new ArrayEnumerator(tree.keys);

    var ctor = function(en){
        var _current;
        define.current(this, function(){
            return _current;
        });
        
        define.next(this,function(){
            var n = keys.next();
            if (n) {
                _current = tree.get(keys.current);
            } else {
                _current = undefined;
            }
            return n;
        });
        
        define.reset(this,function(){
            keys.reset();
        });
        
        define.length(this,function(){
            return keys.length;
        });
        
        define.clone(this,function(){return new ctor(en.clone());});    
    };
    return new ctor(keys);
},
KeyValueEnumerator = function (obj) {
    "use strict";
    var keys = new ArrayEnumerator(obj.keys),
        _current;
    define.next(this, function () {
        if (keys.next()) {
            var key = keys.current;
            _current = { key : key, value: obj[key]};
            return true;
        }
        _current = undefined;
        return false;
    });
    define.current(this,function(){return _current;});
    define.clone(this,function(){return new KeyValueEnumerator(obj)});
    define.reset(this,function(){keys.reset();});
    define.length(this,function(){return keys.length;});
},
PermutationQuery = (function (_this) {
    "use strict";
    var base = _this,
        index,
        permutationQuery = function () {
            
        };
    permutationQuery.prototype = new Query([]);
    return permutationQuery;
}),
SkipQuery = function (base,count) {
    "use strict";
    var _length = base.length ? Math.max(base.length - count,0) : base.length,
        empty = false;
        define.reset(this, function () {
            var c = count;
            if (empty) { return; }
            base.reset();
            for (; c > 0; c--) {
                if(!base.next()){
                    empty = true;
                    break;
                }
            }
        });
        this.reset();
        
        define.next(this, empty ? function() { return false; }
                                : function() { return base.next(); });
        define.current(this,function(){return base.current; });
        define.length(this, function(){ return _length; });
        define.clone(this, function(){ return new SkipQuery(base.clone(),count); });
};
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
    var QueryEnumerator = function () {
	    var sg = function () {
    		var _current = seed;
    		define.next(this,function(){
    		      _current = generator(_current);
    		      return true;
    		});
    		define.current(this, function () { return _current; });
            define.length(this,function(){ return null; });
            define.reset(this,function(){ _current = seed; });
	    };
    }
    return new QueryEnumerator();
};
if(!Object.prototype.keys) {
    defineGetter(Object.prototype,"keys", function () {
        var res = [];
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                res.push(prop);
            }
        }
        return res;
    });
}
module.exports = function(arr){ return Query(arr);};