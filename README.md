Query-js is a module, that adds sequence operations to javascript. It's inspired by the operations available in LINQ,
but is not meant as a port. The methods are generally evaluating lazily when possible.

### <a name="aggregate"></a>aggregate ###
Aggregate is what is also known as a left fold. It applies a function to the element one at a time and passes the result onto the next iteration. If you do not provide a seed undefined is used as seed


**Example**
   ```JavaScript
   var arr = [1,2,3,4,5],
       //will be (0)+1+2+3+4+5 aka 15
       sum = arr.aggregate(function (sum, elem) { return sum + elem; }, 0);
   ```
   
### <a name="all"></a>all ###
Test wheter all elements in a sequence satisfies the given predicate. To be more precise it tests whether there are no elements that doesn't satisfy the predicate (See last example)
**Example**
   ```JavaScript
   var arr = [1,2,3,4,5],
       willBeFalse = arr.all(function(e){return e < 5;}),
       willBeTrue = arr.all(function(e){return e < 6;});
       willAlsoBeTrue = [].all(function(e){return false;});
   ```
   
### <a name="any"></a>any ###
Test wheter any elements in a sequence satisfies the given predicate
**Example**
   ```JavaScript
   var arr = [2,4,6],
       willBeFalse = arr.any(function(e){return e % 2 !== 0;}),
       willBeTrue = arr.any(function(e){return e === 4;});
   ```
   
### <a name="average"></a>any ###
Computes the aevrage of the elements in the sequence
**Example**
   ```JavaScript
        //will be 4
    var avg = [2,4,6].average();
        //wil also be 4
        avg = [{value : 2},{value : 4},{value : 6}].average(function(e){return e.value;});
   ```
   
### <a name="count"></a>count ###
Returns the count of elements in the sequence

**Example**
   ```JavaScript
   var arr=[1,2,3],
       //there's three numbers in the sequence
       willBeThree = arr.count(),
       //but only two of the numbers are odd
       willBeTwo = arr.count(function(e){return e % 2;});
   ```
### <a name="current"></a>current ###
Returns the current element in the sequence. Should generally not be used and might very well be removed from the API in a future release

### <a name="distinct"></a>distinct ###
Filters out all duplicates, if no comparer is passed then a simple comparison is used. If custom comparison is required a compare can be passed
**Example**
   ```JavaScript
   //will be an array [1,2,3,4,5]
   var res = [1,1,2,2,3,3,4,4,5,5].distinct();
   res = [{index : 1, value : 4}, {index : 4, value : 4},{index : 2, value : 3}].distinct(function(a,b){ return a.index === b.index });
   ```

### <a name="each"></a>each ###
Is very similar to [select](#select) but instead of returning a lazily evaluated sequence it's evaluated upfront and returned in an array
**Example**
```JavaScript
   var seq = Sequence([1,2,3,4,5]).where(function(e){return e % 2;}),
       //[1,3,5]
       arr = seq.each();
       //[1,9,25]
       arr = seq.each(function(e){return e * e;});
```
   
### <a name="first"></a>first ###
Returns the first element of the sequence or if a predicate is provided the first element that meets the criteria
if no elements can be found it will throw an exception (See [firstOrDefault](#firstOrDefault) if this is not warrented)

**Example**
```JavaScript
    var arr = [2,3,4];
         //simply get the list element in the sequence
         willBeTwo = arr.first();
         //get the first element, that satisfy the predicate
         willBeThree = arr.first(function(e){ return e % 2; });
```
    
### <a name="firstOrDefault"></a>firstOrDefault ###
Like [first](#first) but instead of throwing if no elements are found will return a default value. null is returned as default but a specific value can be passed as a paramter
    
**Example**

 ```JavaScript
    var //will be null
        defaultValue = [].firstOrDefault();
        //will be 4
        defaultValueSpecified = [].firstOrDefault(4);
        //With predicate
        defaultValueSpecified = [2,4,6,8].firstOrDefault(function(e){return e % 2;},4);
```
    
### <a name="groupBy"></a>groupBy ###
groupBy groups the sequence based on a key for each element. The result can be treated like any other JS object or you can chain additional query operators to the result, treating it as a sequence of key-value pairs
Yopu can pass a second function which can be use to project the value of the element into a new element
**Example**
```JavaScript
   var arr = [{name:"John", age:"Middel"}, 
              {name:"Peter", age:"young"}, 
              {name:"Jack", age:"Old"},
              {name:"Christine", age:"young"},
              {name."Juliet", age : "Middel"}];
       //{
       //  "Middel" : [{name:"John", age:"Middel"},{name."Juliet", age : "Middel"}],
       //  "young"  : [{name:"Peter", age:"young"},{name:"Christine", age:"young"}],
       //  "Old"    : [{name:"Jack", age:"Old"}]
       //}
       ageGroups = arr.groupBy(function(e){return e.age;})
   ```

### <a name="iterate"></a>iterate ###
Iterate does exactly want the name implies. It iterates over the sequence of elements. Passing each element to the function as a parameter.

**Example**
```JavaScript
   // prints 1 2 3 to the console
   [1,2,3].iterates(console.log);
   ```
### <a name="last"></a>last ###
Pick the last element of a sequence. If a predicate is specified, the last element that satisfy the predicate is returned. It will throw if the sequence is empty. If that's not warrented then use [lastOrDefault](#lastOrDefault) instead

**Example**
```JavaScript
   var arr = [1,2,3,4];
       //simply get the last element of the sequence
       willBeFour = arr.last();
       //get the last element that satisfy the predicate
       wiilBeThree = arr.last(function(e){ return e % 2;});
   ```
### <a name="lastOrDefault"></a>lastOrDefault ###
   
Works like [last](#last) except that it will return a default value if there are no elements in the sequence that satisfy the predicate

**Example**
```JavaScript
   var arr = [1,2,3,4];
       //simply get the last element of the sequence
       willBeFour = arr.last();
       //get the last element that satisfy the predicate
       wiilBeThree = arr.last(function(e){ return e % 2;});
```
   

### <a name="max"></a>max ###
Returns the maximal value of the sequence. The method accepts a function as the only argument. If a projection is provided the elements will be projected before compared
**Example**
   ```JavaScript
   var arr = [{index : 1, value 4},{index : 2, value : 3}];
       //will be {index : 1, value 4}
       max = arr.max(function(e){return e.value;});
       //will be 5
       max = [1,3,5,4,2].max();
   ```
### <a name="min"></a>min ###
Returns the minimal value of the sequence. The method accepts a function for projection of the elements, as the only argument. If a projection is provided the elements will be projected before compared
**Example**
   ```JavaScript
   var arr = [{index : 1, value 4},{index : 2, value : 3}];
       //will be {index : 2, value 3}
       min = arr.min(function(e){return e.value;});
       //will be 1
       max = [1,3,5,4,2].min();
   ```

### <a name="next"></a>next ###
Move the iteration to the next ele in the sequence. This is meant for internal use and should generally not be used


### <a name="orderBy"></a>orderBy ###
orderBy sorts the sequence of elements. If no projection is provided then simple comparison of the individual elements is used.
**Example**
```JavaScript
   var arr = [1,4,2,5,3],
       //will be [1,2,3,4,5]
       res = arr.orderBy()
       //will be [{index:0,count: 4},{index : 1, count : 3},{index : 2, count : 2}]
       res = [{index:1,count: 3},{index : 0, count : 4},{index : 2, count : 2}].orderBy(function(e){return e.index;});
   ```

### <a name="product"></a>product ###
Will take the product of all the elements
**Example**
```JavaScript
   var arr [1,2,3,4,5]
       //will be 120 (1*2*3*4*5)
       res = arr.product();
       //will also be 120
       res = [{value : 1},{value : 2},{value : 3},{value : 4},{value : 5}].product(function(e){return e.value;});
   ```


### <a name="reset"></a>reset ###
Will restart the iteration of the sequence. Is meant for internal use an should generally not be used

### <a name="reverse"></a>reverse ###
Reverses the sequence
**Example**
```JavaScript
   var arr = [1,2,3,4],
       //will be [4,3,2,1]
       res = arr.reverse();
   ```


### <a name="select"></a>select ###
This method lets you project the elements of sequence into a sequence of new values
**Example**
```JavaScript
   var arr = [{value : 1},{value : 2},{value : 3},{value : 4},{value : 5}],
       //will be [1,2,3,4,5]
       res = arr.select(function(e){return e.value;})
   ```

### <a name="single"></a>single ###
Works pretty much the same way as [first](#first). However if more than one elements are present it will throw an exception. 
To be able to know whether or not multiple elements satifying the predicate are present it will have to iterate the entire collection

**Example**
   ```JavaScript
   var arr = [1,2,3];
       //will fail because multiple valid elements exists
       error = arr.single();
       //will return because only one element satisfy the predicate
       willBeTwo = arr.single(function(e){return e % 2 === 0;});
   ```

### <a name="singleOrDefault"></a>singleOrDefault ###
Where [single](#single) works similar to [first](#first). This works similar to [firstOrDefault](#firstOrDefault). If no elements are present it will return a default value. 
Just like [single](#single), if multiple elements are present an exception will be thrown


**Example**
   ```JavaScript
    var arr = [1,2,3];
       //will fail because multiple valid elements exists
       error = arr.singleOrDefault();
       //will return because only one element satisfy the predicate
       willBeTwo = arr.singleOrDefault(function(e){return e % 2 === 0;});
       //will return null because no default are specified
       willBeNull = arr.singleOrDefault(function(e){ return e > 3;});
       //will return null because no default are specified
       willReturnTheDefaultOfFour = arr.singleOrDefault(function(e){ return e > 3;},4);
   ```
### <a name="skip"></a>skip ###
Skip a number of elements
**Example**
```JavaScript
    var arr = [1,2,3,4,5],
        //we be [2,3,4,5]
        res = arr.skip(1).each();
   ```   
### <a name="sum"></a>sum ###
Sums up the elements of the sequence
**Example**
```JavaScript
    var arr = [1,2,3,4,5]
        //will be 15
        res = arr.sum();
        //will also be 15
        res = [{value : 1},{value : 2},{value : 3},{value : 4},{value : 5}].sum(function(e){return e.value;});
   ```
### <a name="take"></a>take ###
Takes a number of elements

**Example**
```JavaScript
    var arr = [1,2,3,4,5],
        //will be [1,2,3]
        res = arr.take(3).each();
   ```
### <a name="when"></a>where ###
Takes elements from the sequence as long as the predicate is satisfied
**Example**
```JavaScript
    var arr = [1,2,3,4,5],
        //will be [1,3,5]
        res = arr.where(function(e){ return e < 4; });
   ```
   
### <a name="where"></a>where ###
Filters the sequence based on a predicate
**Example**
```JavaScript
    var arr = [1,2,3,4,5],
        //will be [1,3,5]
        res = arr.where(function(e){ return e % 2; });
   ```