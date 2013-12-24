    var p1 = [ 70, 90 ], p2 = [ 370, 50 ], w = 20, h = 20;
    
    var c = document.getElementById("mockup"), 
        ctx = c.getContext("2d"),
        el = function(p) {
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]); 
            ctx.lineTo(p[0] + w, p[1]);
            ctx.lineTo(p[0] + w, p[1] + h);
            ctx.lineTo(p[0], p[1] + h);
            ctx.lineTo(p[0], p[1]);
            ctx.fill();
        },
        l = function(p1, p2, s) {
            ctx.strokeStyle = s || "#CCC";
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.stroke();
        };
        
    ctx.clearRect( 0, 0, c.width, c.height );
    // draw the two elements to connect 
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    el(p1);
    el(p2);
    
    // elements to join    
    // anchors are at right and left of these rects
    var a1 = [ p1[0] + w, p1[1] + (h/2) ], a2 = [ p2[0], p2[1] + (h/2) ];
    var dx = a2[0] - a1[0], // delta in x
        dy = a2[1] - a1[1], // delta in y
        d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),  // absolute delta
        m = Math.atan2(dy,dx), 
        n = Math.atan2(dx, dy);
        
    // this function takes a point from the midline and projects it to the 
    // upper or lower guideline.
    var translatePoint = function(from, upper) {
        var dux = isFinite(n) ? (Math.cos(n) * amplitude) : 0;    
        var duy = isFinite(n) ? (Math.sin(n) * amplitude) : amplitude;
        return [ 
            from[0] - ((upper ? -1 : 1) * dux), 
            from[1] + ((upper ? -1 : 1) * duy)
        ];
    };
    
    // this function returns a point on the line connecting the two anchors, at a given distance from the start
    var pointOnLine = function(distance) {
        var dux = isFinite(m) ? (Math.cos(m) * distance) : 0;
        var duy = isFinite(m) ? (Math.sin(m) * distance) : distance;
        return [
            a1[0] + dux,
            a1[1] + duy
        ];
    };
        
    console.log(dx,dy,d,m,n);
    
    var wavelength = 10;
    var amplitude = 10;
    // line between centers
    l(a1, a2);
    // upper guideline
    l(translatePoint(a1, true), translatePoint(a2, true), "red");
    // lower guideline
    l(translatePoint(a1, false), translatePoint(a2, false), "blue");
    
    var points = [ a1 ];
    var peaks = Math.round(d / wavelength), 
        shift = d - (peaks * wavelength),
        upper = true;
    for (var i = 0; i < peaks; i++) {
        var xy = pointOnLine(shift + ((i+1) * wavelength)),
            pxy = translatePoint(xy, upper);
            
        points.push(pxy);
        upper = !upper;
    }
    points.push(a2);
    
    // now draw
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++)
        ctx.lineTo(points[i][0], points[i][1]);
    ctx.stroke();