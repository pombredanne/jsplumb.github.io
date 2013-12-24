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

    // this function returns a point on the line connecting the two anchors, at a given distance from the start
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