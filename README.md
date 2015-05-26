Sequence is a module that adds sequence operations to JS. It's inspired by the operations available in LINQ
but is not meant as a port. 

Sequence monkey pathes arrays with a list of operations

- first
    Returns the first element of the sequence or if a predicate is provided the first element that meets the criteria
    if no elements can be found it will throw an exception (See firstOrDefault if this is not warrented)

    **Example**
    ```
    var arr = [2,3,4];
         willBeTwo = arr.first();
         willBeThree = arr.first(function(e){ return e % 2; });
    ```
- firstOrDefault
    Like first but instead of throwing if no elements are found will return a default value. null is return as default but a specific value can be passed as a paramter
- last
- any
- select
- where
- distinct 
- ...
 


