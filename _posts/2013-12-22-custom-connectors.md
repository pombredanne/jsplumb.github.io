---
layout: post
title:  "CUSTOM CONNECTORS"
date:   2013-12-22 18:58:00
categories: posts
---

jsPlumb ships with four connector types:

- Bezier
- Straight
- Flowchart
- StateMachine

but if none of these are exactly what you need, it is possible to define your own custom connectors.  In this post we'll take a look 
at how to do that, by defining a Connector that provides a line taking the form of a triangle wave between its two Endpoints.


### CONNECTOR CONCEPTS

A Connector is basically a path between two points. jsPlumb represents a Connector as a series of `segments`, of which there are three
types:

- Straight
- Bezier
- Arc

The various Connectors that ship with jsPlumb consist of combinations of these basic segment types.  A `Straight`
connector, for instance, consists of a single Straight segment. `Bezier` and `StateMachine` connectors consist of a single
Bezier segment.  A Flowchart connector consists of a series of Straight segments, and if `cornerRadius` is set, then each
pair of Straight segments has an Arc segment in between.

These three basic segment types have so far been sufficient to define all of the connectors in jsPlumb, and for the triangle wave
example I will be modelling the connector as a series of straight segments.  But it is feasible that at some stage in the future
there will be a need for a segment that models an arbitrary path. If you're reading this and you find that might apply to you, 
get in touch and we'll see what we can do.

### THE MATH

It helps to first sketch up what you're aiming for. Here I'm using an HTML canvas to draw how I want the triangle wave
connector to look.  Using a Canvas has the obvious advantage that once I get it how I want I've got most of the hard work done! 
Obviously it also has the disadvantage that if you're looking at this site in IE<9 you won't see anything. That's ok. If you're
looking at this page with a view to doing anything about it, then you're a web developer...you have a real browser kicking around somewhere.

<canvas id="mockup" style="border:2px solid gray;border-radius:2px;" width="500" height="150"></canvas>
<script src="/assets/triangle-wave-mock.js"></script>

The basic approach to creating a triangle wave is to get the equation for the line joining the two endpoints, then create
a parallel line above and below this line.  These parallel lines are the lines on which the peaks of the wave will sit.

```javascript
var wavelength = 10, amplitude = 10;
var anchor1 = [ a, b ],
    anchor2 = [ c, d ];
    
// find delta in x and y, the length of the line joining the two anchors, 
// the gradient of that line, and the gradient of a normal to that line.
var dx = c - a,
    dy = d - b,
    d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
    m = dy / dx,
    n = -1 / m;
// calculate how many peaks there will be, and also how much to shift by to 
// have the line fit nicely between the two anchors
var peaks = Math.round(d / wavelength), 
    shift = (d - (peaks * wavelength) / 2);
// generate points. start at anchor1, travel along line between the two anchors, 
// and alternate between projecting peaks from upper to lower.
var points = [ anchor1 ], upper = true;
for (var i = 0; i < peaks; i++) {
    var xy = pointOnLine(shift + ((i+1) * wavelength)),
        pxy = translatePoint(xy, upper);
    points.push(pxy);
    upper = !upper;
}
points.push(a2);
```

Here, `pointOnLine` and `translatePoint` are, respectively, functions to find a point on the line between 
the two anchors, and to project a point from the line between the two anchors onto the upper or lower parallel line.

### CONNECTOR CODE

This is the basic skeleton of a custom connector:

```javascript
;(function() {
	var TriangleWave = function() {
		var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
        this.type = "TriangleWave";
        this._compute = function(paintInfo, paintParams) {
            // your math here, resulting in a series of calls like this:
            _super.addSegment(this, "Straight", { ... params for segment ... });
        };
	};
    jsPlumbUtil.extend(TriangleWave, jsPlumb.Connectors.AbstractConnector);
	jsPlumb.registerConnectorType(TriangleWave, "TriangleWave");
})();
```

You need to perform all of the steps in this code block. The two lines outside of the `TriangleWave` function (in conjunction with
the `type` parameter declared on the function) are what will register the connector properly on jsPlumb.  The `_compute` 
method is what jsPlumb will call at paint time, and it is the contents of the `paintInfo` object you'll be interested 
in - it contains a lot of parameters, many of which you don't need, but here are the ones you might find useful:

```javascript
paintInfo: {
	sx: 442.6,				// start anchor, x axis
	sy: 0,					// start anchor, y axis
	tx: 0,					// end anchor, x axis
	ty: 51,					// end anchor, y axis
	startStubX: 442.6,		// end of start stub, x axis. may be equal to sx.
	startStubY: 0,			// end of start stub, y axis. may be equal to sy.
	endStubX: 0,			// end of end stub, x axis. may be equal to tx.
	endStubY: 51,			// end of end stub, y axis. may be equal to ty.
	w: 442.6,				// distance in x between start and end.
	h: 51,					// distance in y between start and end.
	mx: 221.3,				// midpoint in x between start and end.
	my: 25.5,				// distance in y between start and end.
	opposite: true,			// true if the orientations of the two anchors 
							// are 180 degrees apart.
	orthogonal: false,      // true if the orientations of the two anchors 
							// are the same
	perpendicular: false,   // true if the orientations of the two anchors 
							// are 90 degrees apart.
	segment: 3,				// Segment of circle in which lies the angle of a 
							// line from the start anchor to the end anchor.
	so: [ 1, -1 ],			// orientation of start anchor. See jsPlumb docs.
	to: [ 0, -1 ],			// orientation of end anchor. See jsPlumb docs.
```

The most interesting values in here for the majority of connectors are `sx`, `sy`, `tx` and `ty`, which give the location
of the source and target anchors.  `[ sx, sy ]` and `[ tx, ty ]` are the equivalent of the `anchor1` and `anchor2` values in 
our pseudo code above.  A simple straight line connector, for instance, could (and does!) just add a single segment from `[sx, sy]` to `[tx, ty]`.

So now we have enough to put together the code for the connector - we'll use the skeleton code and plug in our maths. 


```javascript
var TriangleWave = function() {
	var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
	this.type = "TriangleWave";	
	var wavelength = 10,
		amplitude = 10;
		
	this._compute = function(paintInfo) {
		
		var dx = paintInfo.tx - paintInfo.sx,
			dy = paintInfo.ty - paintInfo.sy,
			d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),  // absolute delta
			m = Math.atan2(dy,dx), 
			n = Math.atan2(dx, dy),
			origin = [ paintInfo.sx, paintInfo.sy ],
			current = [ paintInfo.sx, paintInfo.sy ],
			peaks = Math.round(d / wavelength), 
			shift = d - (peaks * wavelength),
			upper = true;

		for (var i = 0; i < peaks - 1; i++) {
			var xy = pointOnLine(origin, m, shift + ((i+1) * w)),
				pxy = translatePoint(xy, n, upper, amplitude);
				
			_super.addSegment(this, "Straight", { 
				x1:current[0], 
				y1:current[1],
				x2:pxy[0],
				y2:pxy[1]
			 });
			upper = !upper;
			current = pxy;
		}
		
		// segment to end point
		_super.addSegment(this, "Straight", { 
			x1:current[0], 
			y1:current[1],
			x2:paintInfo.tx,
			y2:paintInfo.ty
		 });
	};
};
jsPlumbUtil.extend(TriangleWave, jsPlumb.Connectors.AbstractConnector);
jsPlumb.registerConnectorType(TriangleWave, "TriangleWave");
```

And here it is in action. You can drag those boxes around:
<div class="demo">
	<div id="w1" class="w" style="left:25px;top:35px"></div>
	<div id="w2" class="w" style="left:425px;top:135px"></div>
</div>

### CONSTRUCTOR PARAMETERS

So far we have a triangle wave connector with a fixed distance of 10 pixels between the peaks, and a peak height of 10 pixels. 
What if we want to be able to control these values? For that we'll want to supply constructor parameters.  As with the vast 
majority of objects in jsPlumb, when you specify a Connector type you can supply just the name of the Connector, or you can 
supply an array of `[ name, { parameters }]`. In the second case, jsPlumb will provide the parameters object as an argument 
to your Connector's constructor. So we might change our usage of the Triangle Wave Connector to specify a 20 pixel gap between 
the peaks, and a peak height of 7px:

    connector:[ "TriangleWave", { wavelength:20, amplitude:7 } ]
	
And then the first few lines of our connector will change to take these parameters into account:

```javascript
var TriangleWave = function(params) {
	params = params || {};
	var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
	this.type = "TriangleWave";
	var wavelength = params.wavelength || 10,
		amplitude = params.amplitude || 10,
		...
```
	
Here's the code from before, but with a wavelength of 20px, and an amplitude of 7px:

<div class="demo">
	<div id="w3" class="w" style="left:25px;top:35px"></div>
	<div id="w4" class="w" style="left:425px;top:135px"></div>
</div>

### OVERLAYS

There's nothing special you need to do to support overlays; they are handled automatically by `AbstractConnector` in conjunction
with the connector segments.  So here's the same code again, with a label.

<div class="demo">
	<div id="w5" class="w" style="left:25px;top:35px"></div>
	<div id="w6" class="w" style="left:425px;top:135px"></div>
</div>

### THOSE TRIANGLES LOOK LIKE SPRINGS

Don't they, though?  Maybe we could modify the code and make them _behave_ like simple springs too. Let's consider the
basic behaviour of a spring: it has a fully compressed state, beyond which it can compress no more, and as you stretch it,
the coils separate further and further. Obviously in a real spring, there is a value at which the spring has been stretched
beyond the limit at which it can spring back.  We're not going to model that here, though.  Here we're just going to keep things
simple - we'll add a flag defining whether or not to behave like a spring, and define a _minimum_ distance, corresponding to the 
fully compressed state:

```javascript
var wavelength = params.wavelength || 10,
	amplitude = params.amplitude || 10,
	spring = params.spring,
	compressedThreshold = params.compressedThreshold || 5;
```

And let's say that when the two elements are closer than `compressedThreshold`, the `wavelength` will be 1 pixel. Beyond that, the wavelength
will grow as the two elements separate. By how much?  I'm going to pull a number out of thin air here and say that when the spring
is not fully compressed, the wavelength will be 1/20th of the distance between the two anchors.  Actually I should be honest: I 
didn't pull this number completely out of thin air.  I ran it a few times with different values until I found something I liked
the look of.

So, now I can configure two elements to be connected with a rudimentary spring:

<div class="demo">
	<div id="w7" class="w" style="left:25px;top:35px"></div>
	<div id="w8" class="w" style="left:425px;top:135px"></div>
</div>
```javascript
jsPlumb.connect({
	source:"w7",
	target:"w8",
	connector:[ "TriangleWave", { spring:true } ],
	paintStyle:{
		lineWidth:1,
		strokeStyle:"#456"
	}
});
```

<br />

### WHAT ABOUT STUBS?  I WANT STUBS.

Some types of connectors benefit from having a first segment that emanates as a straight line from their anchor, before
the real business of connecting comes into play.  You can see this in the [Flowchart demonstration](http://jsplumbtoolkit.com/demo/flowchart/jquery.html) in jsPlumb. Now that
our triangle wave connector can behave like a spring, it strikes that me it would be good to support stubs here too.  Fortunately,
it isn't very hard to do.  Remember the `sx`/`sy`/`tx`/`ty` parameters from above?  If you supply a `stub` argument to your 
connector, `paintInfo` also exposes the location of the end of the stubs, via `startStubX`/`startStubY`/`endStubX`/`endStubY`.  

So we can change the code to use these stub locations as the origin and final point, and then also add a segment for each stub:

```javascript
var dx = paintInfo.endStubX - paintInfo.startStubX,
	dy = paintInfo.endStubY - paintInfo.startStubY,
	d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
	m = Math.atan2(dy, dx), 
	n = Math.atan2(dx, dy),
	origin = [ paintInfo.startStubX, paintInfo.startStubY ],
	current = [ paintInfo.startStubX, paintInfo.startStubY ],
	...
```	

Here's the result:

<div class="demo">
	<div id="w9" class="w" style="left:25px;top:75px;"></div>
	<div id="w10" class="w" style="left:425px;top:85px"></div>
</div>
```javascript
jsPlumb.connect({
	source:"w9",
	target:"w10",
	connector:[ "TriangleWave", { spring:true, stub:[ 20, 20 ] } ],
	anchors:["Right", "Left"],
	paintStyle:{
		lineWidth:1,
		strokeStyle:"#456"
	}
});
```

<br />

### IN SUMMARY
It's pretty straightforward to add a new connector type to jsPlumb. Most of the work is really in the maths
underpinning the connector's path. For reference, below is the "triangle wave" connector's code in full 
(which turned out to be a spring in disguise!).  You can find the full source code [here](/assets/triangle-wave-connector.js),
and the source for each of the demos is [here](/assets/triangle-wave-demo.js).

Whilst working on the spring stuff at the end of this post it occurred to me that a real spring would impose bounds on the
two elements it was joining: for instance, the two elements should not be able to be closer than the spring's compressed 
size, and there is a point at which the spring will refuse to stretch any further.  At first I was tempted to think about ways
the connector could help model these behaviours, but of course this connector is just the view; decisions about constraining
movement do not belong here.  Look out for a future post in which I will discuss the general direction jsPlumb is heading in with
respect to these sorts of requirements.


And finally, if you make something awesome, please do consider sharing it with others!


### THE FINAL CODE

```javascript
;(function() {
    // this function takes a point from the midline and projects it to the 
    // upper or lower guideline.
    var translatePoint = function(from, n, upper, amplitude) {
        var dux = isFinite(n) ? (Math.cos(n) * amplitude) : 0;    
        var duy = isFinite(n) ? (Math.sin(n) * amplitude) : amplitude;
        return [ 
            from[0] - ((upper ? -1 : 1) * dux), 
            from[1] + ((upper ? -1 : 1) * duy)
        ];
    };

    // this function returns a point on the line connecting 
	// the two anchors, at a given distance from the start
    var pointOnLine = function(from, m, distance) {
        var dux = isFinite(m) ? (Math.cos(m) * distance) : 0;
        var duy = isFinite(m) ? (Math.sin(m) * distance) : distance;
        return [
            from[0] + dux,
            from[1] + duy
        ];
    };

	var TriangleWave = function(params) {
		params = params || {};
		var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
        this.type = "TriangleWave";
		
		var wavelength = params.wavelength || 10,
        	amplitude = params.amplitude || 10,
			spring = params.spring,
			compressedThreshold = params.compressedThreshold || 5;
			
        this._compute = function(paintInfo, paintParams) {
            
            var dx = paintInfo.endStubX - paintInfo.startStubX,
                dy = paintInfo.endStubY - paintInfo.startStubY,
                d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),  // absolute delta
                m = Math.atan2(dy, dx), 
                n = Math.atan2(dx, dy),
				origin = [ paintInfo.startStubX, paintInfo.startStubY ],
                current = [ paintInfo.startStubX, paintInfo.startStubY ],
				// perhaps adjust wavelength if acting as a rudimentary spring
				w = spring ? d <= compressedThreshold ? 1 : d / 20 : wavelength,
				peaks = Math.round(d / w), 
				shift = d - (peaks * w),
				upper = true;
				
			// start point to start stub
			 _super.addSegment(this, "Straight", { 
                x1:paintInfo.sx, 
                y1:paintInfo.sy,
                x2:paintInfo.startStubX,
                y2:paintInfo.startStubY
             });

            for (var i = 0; i < peaks - 1; i++) {
                var xy = pointOnLine(origin, m, shift + ((i+1) * w)),
                    pxy = translatePoint(xy, n, upper, amplitude);
                    
                _super.addSegment(this, "Straight", { 
                    x1:current[0], 
                    y1:current[1],
                    x2:pxy[0],
                    y2:pxy[1]
                 });
                upper = !upper;
                current = pxy;
            }
            
            // segment to end stub
            _super.addSegment(this, "Straight", { 
                x1:current[0], 
                y1:current[1],
                x2:paintInfo.endStubX,
                y2:paintInfo.endStubY
             });
			 
			 // end stub to end point
			 _super.addSegment(this, "Straight", { 
                x1:paintInfo.endStubX, 
                y1:paintInfo.endStubY,
                x2:paintInfo.tx,
                y2:paintInfo.ty
             });
        };
	};
    jsPlumbUtil.extend(TriangleWave, jsPlumb.Connectors.AbstractConnector);
	jsPlumb.registerConnectorType(TriangleWave, "TriangleWave");
})();
```

    
{% include jquery.jsplumb.html %}

<script src="/assets/triangle-wave-connector.js"></script>
<script src="/assets/triangle-wave-demo.js"></script>
