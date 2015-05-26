Sequence is a module that adds sequence operations to JS. It's inspired by the operations available in LINQ
but is not meant as a port. 

Sequence monkey pathes arrays with a list of operations

- first
    Returns the first element of the sequence or if a predicate is provided the first element that meets the criteria
    if no elements can be found it will throw an exception (See firstOrDefault if this is not warrented)

    **Example**
    ```JavaScript
    var arr = [2,3,4];
         //simply get the list element in the sequence
         willBeTwo = arr.first();
         //get the first element, that satisfy the predicate
         willBeThree = arr.first(function(e){ return e % 2; });
    ```
- firstOrDefault
    Like first but instead of throwing if no elements are found will return a default value. null is returned as default but a specific value can be passed as a paramter
    
    **Example**
    ```JavaScript
    var //will be null
        defaultValue = [].firstOrDefault();
        //will be 4
        defaultValueSpecified = [].firstOrDefault(4);
        //With predicate
        defaultValueSpecified = [2,4,6,8].firstOrDefault(function(e){return e % 2;},4);
    ```
- last
    Pick the last element of a sequence. If a predicate is specified, the last element that satisfy the predicate is returned
   ```JavaScript
   var arr = [1,2,3];
       //simply get the last element of the sequence
       willBeFour = arr.last();
       //get the last element that satisfy the predicate
       wiilBeThree = arr.last(function(e){ return e % 2;});
   ```
- any
- select
- where
- distinct 
- ...
 


