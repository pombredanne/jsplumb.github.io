---
layout: doc
---

## jsPlumb Development

In development, jsPlumb is broken up into various scripts:

- **util.js**
jsPlumb utility functions (and some base classes).
- **dom-adapter.js**
Interface between jsPlumb and the DOM
- **jsPlumb.js**
Main jsPlumb engine.
- **anchors.js**
Anchors and anchor manager
- **defaults.js**
Default Endpoint, Connector and Overlay implementations.
- **endpoint.js**
Endpoint class
- **connection.js**
Connection class
- **renderers-canvas.js**
HTML5 canvas renderer.
- **renderers-svg.js**
SVG renderer.
- **renderers-vml.js**
VML renderer.
- **connectors-statemachine.js**
The State Machine connector.
- **connectors-flowchart.js**
The Flowchart connector.
- **connectors-bezier.js**
The Bezier connector.
- **&lt;LIBRARY_PREFIX&gt;.jsPlumb.js**
Contains library-specific helper methods.  jsPlumb ships with three of these - one each for jQuery, MooTools and YUI3. See below for information on how to create a new library implementation.
- **jsBezier-0.X-min.js**
These are the Bezier curve functions; they are maintained in a separate project called [jsBezier](https://github.com/sporritt/jsBezier).
- **jsplumb-geom-0.x.js**
Various geometry functions used by jsPlumb that were extracted to a [separate project](https://github.com/sporritt/jsplumb-geom) because they might be useful for other people.

These files are packaged together to form the scripts that people use, of which there are two for each supported library:

  - **jquery.jsPlumb-1.5.3.js**
  - **jquery.jsPlumb-1.5.3-min.js**


Instructions for running a build can be found [here](Build).

#### Pluggable Library Support
Out of the box, jsPlumb can be run on top of jQuery, MooTools or YUI3.  This is achieved by delegating several core methods - tasks such as finding an element by id, finding an element's position or dimensions, initialising a draggable, etc - to the library in question.

To develop one of these, your test page should include the first two scripts discussed above, and then your own script containing your library specific functionality.  The existing implementations may be documented well enough for you to create your own, but contact me if you need assistance.  If you do this, it would be great to share it with everyone...

###### ExtJS
To date, I've been contacted by a few different groups who have been working on an ExtJS adapter, but nothing seems to have yet come to fruition.