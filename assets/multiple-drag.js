jsPlumb.ready(function() {
    
    jsPlumb.importDefaults({
        Endpoint:[ "Dot", { radius:3 }],
        Anchor:"Continuous",
        Connector:"StateMachine",
        PaintStyle:{
            lineWidth:1,
            strokeStyle:"#456"
        },
        MaxConnections:-1,
        Container:"demo"
    });
    
    var w = jsPlumb.getSelector(".w");
    jsPlumb.draggable(w, { filter:".foo" });
    jsPlumb.makeSource(w, { filter:".foo" });
    jsPlumb.makeTarget(w);
    
    jsPlumb.connect({source:"w1", target:"w2"});
    jsPlumb.connect({source:"w7", target:"w5"});
    jsPlumb.connect({source:"w5", target:"w3"});
    jsPlumb.connect({source:"w4", target:"w6"});
    jsPlumb.connect({source:"w2", target:"w7"});
    
    // attach listeners to add/remove links
    jsPlumb.on(document.getElementById("demo"), ".add", "click", function() {
        jsPlumb.addToDragSelection(this.parentNode);
    });
    
    jsPlumb.on(document.getElementById("demo"), ".remove", "click", function() {
        jsPlumb.removeFromDragSelection(this.parentNode);
    });

});