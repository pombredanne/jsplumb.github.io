### Interceptors
Interceptors are basically event handlers from which you can return a value that tells jsPlumb to abort what it is that it was doing.  There are currently two interceptors supported - `beforeDrop`, which is called when the user has dropped a Connection onto some target, and `beforeDetach`, which is called when the user is attempting to detach a Connection. 

Interceptors can be registered via the `bind` method on jsPlumb just like any other event listeners, and they can also be passed in to the `jsPlumb.addEndpoint`, `jsPlumb.makeSource` and `jsPlumb.makeTarget` methods.  

Note that binding `beforeDrop` (as an example) on jsPlumb itself is like a catch-all: it will be called every time a Connection is dropped on _any_ Endpoint, unless that Endpoint has its own `beforeDrop` interceptor. But passing a beforeDrop callback into an Endpoint constrains that callback to just the Endpoint in question.  		

#### beforeDrop
This event is fired when a new or existing connection has been dropped. Your callback is passed a JS object with these fields:

- **sourceId** - the id of the source element in the connection
- **targetId** - the id of the target element in the connection
- **scope** - the scope of the connection
- **connection** - the actual Connection object.  You can access the 'endpoints' array in a Connection to get the Endpoints involved in the Connection, but be aware that when a Connection is being dragged, one of these Endpoints will always be a transient Endpoint that exists only for the life of the drag. To get the Endpoint on which the Connection is being dropped, use the 'dropEndpoint' member.
- **dropEndpoint** - this is the actual Endpoint on which the Connection is being dropped.  This **may be null**, because it will not be set if the Connection is being dropped on an element on which makeTarget has been called. 


If you return false (or nothing) from this callback, the new Connection is aborted and removed from the UI.

#### beforeDetach
This is called when the user has detached a Connection, which can happen for a number of reasons: by default, jsPlumb allows users to drag Connections off of target Endpoints, but this can also result from a programmatic 'detach' call.  Every case is treated the same by jsPlumb, so in fact it is possible for you to write code that attempts to detach a Connection but then denies itself!  You might want to be careful with that. 

Note that this interceptor is passed the actual Connection object; this is different from the beforeDrop interceptor discussed above: in this case, we've already got a Connection, but with beforeDrop we are yet to confirm that a Connection should be created.

Returning false - or nothing - from this callback will cause the detach to be abandoned, and the Connection will be reinstated or left on its current target.