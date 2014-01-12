## 1.5.5

### Changes between 1.5.4 and 1.5.5

#### Issues

- **138** - allow for connection type to be derived from connection params AND endpoint params.

## 1.5.4

### Changes between 1.5.3 and 1.5.4

#### Issues
- **105** - Blank endpoint cleanup fails
- **116** - Assign anchors wont connect
- **117** - Assign anchors fail on source
- **127** - Docs on making elements draggable should note required CSS
- **128** - expose original event on `connectionDragStop` callback
- **129** - connection event fired twice by makeTarget with parent option.

#### New Functionality

- `"Assign"` anchors now work with the `makeSource` method.
- The `connectionDragStop` event now supplies the original event as the second argument to the callback function.

#### Miscellaneous

  - fixed an issue causing SVG gradients to fail when a BASE tag is present in the document.

## 1.5.3
### Changes between 1.5.2 and 1.5.3

#### Backwards Compatibility

- The fix for issue 112 involved making a change to the circumstances under which a `connectionDetached` event is fired. When you drag the source or target of an existing connection to some other endpoint, `connectionDetached` is no longer fired. Instead, a `connectionMoved` event is fired, containing the connection that was moved, the index of the endpoint that changed (0 for source, 1 for target), and the original and new source and target endpoints.

#### Issues

- **77** - Endpoint types should support Anchor parameter         
- **88** - reinstate labelStyle parameter on Label overlay.
- **90** - overlay setVisible not working (SVG/VML)
- **95** - Nested element positions not updated
- **100** - add setParent function
- **101** - JS error when detaching connection during connection callback
- **103** - IE8: connector hide does not hide overlays or background lines
- **107** - remove the necessity to set isSource/isTarget in order to make an endpoint draggable
- **108** - strange anchor orientation behaviour
- **109** - Dropping new connections on overlapping elements leads to crash after connection is deleted
- **111** - Absolute positioned arrow in wrong location
- **112** - Deleting a connection after changing its source endpoint causes failure.
- **113** - IE8 - state machine - loops are not displayed

#### New Functionality
- A setParent function was added. jsPlumb changes the parent of some element and updates its internal references accordingly (issue 100).
- Endpoint types now support the anchor parameter (issue 77)
- The `labelStyle` parameter on Label overlays has made a comeback (issue 88). The argument went along the lines of it being useful if you wanted to programmatically generate a label style.
- jsPlumb now automatically updates the internal offsets of some element that has draggable children (obviating the need for you to call `recalculateOffsets` yourself).
- When making a programmatic connection to an endpoint that was not marked `isSource:true` or `isTarget:true`, if the connection is detachable then the endpoint is made draggable, in order to allow users to drag the connection to detach it. Connections dragged off of source or target endpoints in this way can be dropped back onto their original endpoint or onto other endpoints with the same scope, but you cannot subsequently drag a new connection from an endpoint that has been made draggable by this method.
- `connectionMoved` event added. This is fired whenever the source or target of an existing connection is dragged to some other Endpoint.


#### Miscellaneous

- An issue was fixed that was preventing the ability to supply a dynamic anchor with parameters, eg

    `[ [ [ 1,0,0,1], [1,1,1,1] ], { selector:function() { ... } } ]`


## 1.5.2
### Changes between 1.5.1 and 1.5.2

#### Backwards Compatibility

- Issue 86, fixed in 1.5.2, changes the priority in which parameters are applied to a connection. The documentation has always stated that source takes priority, but in fact the code was the other way round, with target taking priority. Now source does take priority.

#### Issues

- **84** - jsPlumb 1.5.1 Arrow Disappears on IE8 when connector is straight
- **85** - dragging target endpoints created by makeTarget not working
- **86** - Connection parameters override order

#### Miscellaneous

- An issue that caused the SVG renderer to paint overlays before the connector was ready when the types API was used was also fixed.

## 1.5.1
### Changes between 1.5.0 and 1.5.1

#### Issues

- **81** - Uncaught TypeError: Cannot read property 'uuid' of null
- **82** - Blank endpoint doesn't cleanup properly
- **83** - for connections made with makeTarget originalEvent is not set

## 1.5.0
### Changes between 1.4.1 and 1.5.0

Release 1.5.0 contains several bugfixes and one or two minor enhancements, but the biggest change since 1.4.1 is the way jsPlumb handles inheritance internally - it has switched from a 'module pattern' architecture to a prototypal-based setup.  The module pattern is good for information hiding, but it makes objects bigger, and its far easier to leak memory with that sort of arrangement than it is with a prototypal inheritance scheme. 

The build has been switched from the original Ant build to Grunt with release 1.5.0, and with this has come the ability to build versions of jsPlumb that omit functionality you do not need (see [[here|Build]]).

  1. [Backwards Compatibility](#backwards)
  - [New Functionality](#new)
  - [Issues Fixed](#issues)
  - [Miscellaneous](#misc)

<a name="backwards"></a>
### Backwards Compatibility
	   
- `jsPlumb.addClass`, `jsPlumb.removeClass` and removed `jsPlumb.hasClass` removed. You don't need these. You can use the methods from the underlying library.
- `makeTargets` method removed from jsPlumb. You can pass an array or selector to `makeTarget`.
- `makeSources` method removed from jsPlumb. You can pass an array or selector to `makeSource`.
- `jsPlumb.detach` no longer supports passing in two elements as arguments.  Use instead either 


`jsPlumb.detach({source:someDiv, target:someOtherDiv});`

or

`jsPlumb.select({source:someDiv, target:someOtherDiv}).detach();`

- `jsPlumbConnectionDetached` event, which was deprecated, has been removed. Use `connectionDetached`.
- `jsPlumbConnection` event, which was deprecated, has been removed. Use `connection`.
- `Endpoint.isConnectedTo` method removed.  it didnt work properly as it only checked for connections where the Endpoint was the source.
- Many places in jsPlumb that used to use library-specific selectors for elements now use pure DOM elements.  It is best to re-select any elements you are getting from a jsPlumb object, even if you supplied them as a selector, as jsPlumb will have unwrapped your selector into a DOM element.

<a name="new"></a>
### New Functionality
  	     
- `jsPlumb.setSuspendDrawing` returns the value of `suspendDrawing` _before_ the call was made.
- `Endpoint.setElement` works properly now.
 
<a name="issues"></a>
### Issues Fixed

- **27** - investigate why a new connection is created after drag          
- **37** - .addClass() not working - IE8
- **39** - problem about connectionDrag event
- **49** - Calling detachEveryConnection winds up calling repaintEverything once for each endpoint
- **51** - arrow overlay orientation at location 1 on flowchart connectors
- **54** - Memory Leak Issue
- **57** - DOMException while dragging endpoints
- **60** - flowchart connector start position wrong
- **63**  - Flowchart midpoint=0 is ignored 
- **65** - Uncaught exception in IE 8
- **69** - jsPlumb.detach(connection) is really slow with larger graphs
- **72** - Drag and drop connections fail to work correctly when using makeTarget
- **75** - changing continuous anchor is ignored
- **76** - jsPlumb doesn't work in XHTML documents         

<a name="misc"></a>
### Miscellaneous

Nothing to report.
