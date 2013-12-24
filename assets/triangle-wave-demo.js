jsPlumb.ready(function() {
    
    jsPlumb.importDefaults({
        Endpoint:[ "Dot", { radius:3 }],
        Anchors:["Right", "Left"],
        PaintStyle:{
            lineWidth:1,
            strokeStyle:"#456"
        }
    });
    
// demo 1

    jsPlumb.connect({
        source:"w1",
        target:"w2",
        connector:"TriangleWave"
    });
    
    jsPlumb.draggable(["w1", "w2"], {
        containment:"parent"
    });
    
// demo 2
    jsPlumb.connect({
        source:"w3",
        target:"w4",
        connector:[ "TriangleWave", { wavelength:20, amplitude:7 } ]
    });
    
    jsPlumb.draggable(["w3", "w4"], {
        containment:"parent"
    });

// demo 3
    jsPlumb.connect({
        source:"w5",
        target:"w6",
        connector:"TriangleWave",
        overlays:[
            [ "Label", { label:"POW!", cssClass:"label" } ]
        ]
    });
    
    jsPlumb.draggable(["w5", "w6"], {
        containment:"parent"
    });
    
// demo 4 : rudimentary spring

    jsPlumb.connect({
        source:"w7",
        target:"w8",
        connector:[ "TriangleWave", { spring:true } ]
    });
    
    jsPlumb.draggable(["w7", "w8"], {
        containment:"parent"
    });
    
// demo 5 : rudimentary spring, with stubs.

    jsPlumb.connect({
        source:"w9",
        target:"w10",
        connector:[ "TriangleWave", { spring:true, stub:[ 20, 20 ] } ]
    });
    
    jsPlumb.draggable(["w9", "w10"], {
        containment:"parent"
    });    

    
});