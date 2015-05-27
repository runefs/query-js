Query-js is a module, that adds sequence operations to javascript. It's inspired by the operations available in LINQ,
but is not meant as a port.

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
**Example**
   ```JavaScript
   ```

### <a name="distinct"></a>distinct ###
Filters out all duplicates, if no comparer is passed then a simple comparison is used. If custom comparison is required a compare can be passed
**Example**
   ```JavaScript
   //will be an array [1,2,3,4,5]
   var res = [1,1,2,2,3,3,4,4,5,5].distinct();
   res = [{index : 1, value : 4}, {index : 4, value : 4},{index : 2, value : 3}].distinct(function(a,b){ return a.index === b.index });
   ```

### <a name="each"></a>each ###

**Example**
   ```JavaScript
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

**Example**
   ```JavaScript
   ```

### <a name="iterate"></a>iterate ###

**Example**
   ```JavaScript
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

**Example**
   ```JavaScript
   ```
### <a name="min"></a>min ###

**Example**
   ```JavaScript
   ```

### <a name="next"></a>next ###

**Example**
   ```JavaScript
   ```

### <a name="orderBy"></a>orderBy ###

**Example**
   ```JavaScript
   ```

### <a name="product"></a>product ###

**Example**
   ```JavaScript
   ```


### <a name="reset"></a>reset ###
**Example**
   ```JavaScript
   ```
   
### <a name="reverse"></a>reverse ###

**Example**
   ```JavaScript
   ```


### <a name="select"></a>select ###

**Example**
   ```JavaScript
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

**Example**
   ```JavaScript
   ```   
### <a name="sum"></a>sum ###

**Example**
   ```JavaScript
   ```
### <a name="take"></a>take ###

**Example**
   ```JavaScript
   ```
   
### <a name="where"></a>where ###

**Example**
   ```JavaScript
   ```