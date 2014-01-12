### Draggable Connections Examples
This is a list of examples of how to use jsPlumb to create Connections using drag and drop.  The basic procedure is:

1. Create Endpoints and register them on elements in your UI, or create a source Endpoint and then make some element a drop target
- Drag and Drop			
			
There are plenty of options you can set when doing this...it will be easier to show you some examples:			

- Define an Endpoint with default appearance, that is both a source and target of new Connections:
<pre>
      var endpointOptions = { isSource:true, isTarget:true }; 
</pre>
				
- Register that Endpoint on window3, specifying that it should be located in the top center of the element:
<pre>
var window3Endpoint = jsPlumb.addEndpoint('window3', { anchor:"TopCenter" }, endpointOptions );  
</pre>
Notice here the usage of the three-argument addEndpoint  - we can reuse `endpointOptions` with a different Anchor for another element.  This is a useful practice to get into.
				
- Register that Endpoint on window4, specifying that it should be located in the bottom center of the element:
<pre>
var window4Endpoint = jsPlumb.addEndpoint('window4', {
  anchor:"BottomCenter" }, endpointOptions );  
</pre>
Now we have two Endpoints, both of which support drag and drop of new Connections.  We can use these to make a programmatic Connection, too, though:
				
- Connect window3 to window4 with a 25px wide yellow Bezier that has a 'curviness' of 175:
<pre>
jsPlumb.connect({ 
	  source:window3Endpoint,
	  target:window4Endpoint,
	  connector: [ "Bezier", { curviness:175 } ],
	  paintStyle:{ lineWidth:25, strokeStyle:'yellow' }
});  
</pre>	

- Define an Endpoint that creates Connections that are 20px wide straight lines, that is both a source and target of new Connections, and that has a `scope` of `blueline`. Also, this Endpoint mandates that once it is full, Connections can no longer be dragged from it (even if `reattach` is specified on a Connection):
<pre>
var endpointOptions = { 
	  isSource:true, 
	  isTarget:true,
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dragAllowedWhenFull:false	 
}; 
</pre>	

- Define an Endpoint that will be anchored to `TopCenter`.  It creates Connections that are 20px wide straight lines, that are both a source and target of new Connections, and that have a `scope` of `blueline`. Also, this Endpoint mandates that once it is full, Connections can no longer be dragged from it (even if `reattach` is specified on a Connection):
<pre>
var endpointOptions = {
	  anchor:"Top", 
	  isSource:true, 
	  isTarget:true,
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dragAllowedWhenFull:false	 
}; 
</pre>
				
- Define an Endpoint that will create a dynamic anchor which can be positioned at `TopCenter` or `BottomCenter`.  It creates Connections that are 20px wide straight lines, it is both a source and target of new Connections, and it has a 'scope' of 'blueline'. Also, this Endpoint mandates that once it is full, Connections can no longer be dragged from it (even if `reattach` is specified on a Connection):
<pre>
var endpointOptions = {
  	anchor:[ "TopCenter", "BottomCenter" ], 
	  isSource:true, 
	  isTarget:true,
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dragAllowedWhenFull:false	 
}; 
</pre>	

- Exactly the same as before, but shows how you can use `anchors` instead of `anchor`, if that makes you feel happier:
<pre>
var endpointOptions = {
  	anchors:[ "TopCenter", "BottomCenter" ], 
  	isSource:true, 
	  isTarget:true,
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dragAllowedWhenFull:false	 
}; 
</pre>	

- Define an Endpoint that is a 30px blue dot, creates Connections that are 20px wide straight lines, is both a source and target of new Connections, has a `scope` of `blueline`, and has an event handler that pops up an alert on drop (note: the event handler name means this example is jQuery - MooTools and YUI3 use different event handler names):
<pre>
var endpointOptions = { 
  	isSource:true, 
  	isTarget:true,
	  endpoint: [ "Dot", { radius:30 } ],
	  style:{fillStyle:'blue'},
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dropOptions:{ 
        drop:function(e, ui) { 
          alert('drop!'); 
        } 
      }	 
}; 
</pre>
				
- Same example as before, but this is for MooTools, and the Endpoint can support up to 5 connections (the default is 1):
<pre>
var endpointOptions = { 
  	isSource:true, 
	  isTarget:true,
	  endpoint: [ "Dot", { radius:30 } ],
	  style:{ fillStyle:'blue' },
	  maxConnections:5,
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dropOptions:{ 
      onDrop:function(e, ui) { 
          alert('drop!'); 
        } 
      }	 
    }; 
</pre>

- Same example again, but `maxConnections` being set to -1 means that the Endpoint has no maximum limit of Connections:
<pre>
var endpointOptions = { 
  	isSource:true, 
  	isTarget:true,
  	endpoint: [ "Dot", {radius:30} ],
  	style:{ fillStyle:'blue' },
  	maxConnections:-1,
  	connector : "Straight",
  	connectorStyle: { lineWidth:20, strokeStyle:'blue' },
  	scope:"blueline",
  	dropOptions:{ 
      onDrop:function(e, ui) { 
          alert('drop!'); 
        } 
      }	 
}; 
</pre>

- Same example again, but for YUI3.  Note the drop callback is "drop:hit":
<pre>
var endpointOptions = { 
  	isSource:true, 
  	isTarget:true,
  	endpoint: [ "Dot", { radius:30 } ],
	  style:{fillStyle:'blue'},
	  maxConnections:-1,
	  connector : "Straight",
	  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
	  scope:"blueline",
	  dropOptions:{ 
        "drop:hit":function(e, ui) { 
             alert('drop!'); 
          } 
      }	 	
}; 
</pre>			
				
- Assign a UUID to the Endpoint options created above, and add as Endpoints to "window1" and "window2":
<pre>
jsPlumb.addEndpoint("window1", { uuid:"abcdefg" }, endpointOptions );
jsPlumb.addEndpoint("window2", { uuid:"hijklmn" }, endpointOptions );
</pre>
	
- Connect the two Endpoints we just registered on "window1" and "window2":
<pre>
jsPlumb.connect({uuids:["abcdefg", "hijklmn"]});
</pre>
	
- Create a source Endpoint, register it on some element, then make some other element a Connection target:
<pre>
var sourceEndpoint = { isSource:true, endpoint:[ "Dot", { radius:50 } ] };
var targetEndpoint = { endpoint:[ "Rectangle", { width:10, height:10 } ] };
jsPlumb.addEndpoint( "window1", sourceEndpoint );
jsPlumb.makeTarget( "window2", targetEndpoint );
</pre>
Notice that the endpoint definition we use on the target window does not include the `isTarget:true` directive.  jsPlumb ignores that flag when creating a Connection using an element as the target; but if you then tried to drag another connection to the Endpoint that was created, you would not be able to.  To permit that, you would set `isTarget:true` on the targetEndpoint options defined above.
	