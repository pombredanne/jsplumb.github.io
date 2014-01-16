---
layout: doc
---

## Loader Support

### RequireJS (AMD)
jsPlumb can be loaded by RequireJS. Two modules are declared:

- **jsplumb** To access the static jsPlumb instance
- **jsplumbinstance** To get a new instance of jsPlumb

**Note** if you're going to be using RequireJS to load jQuery as well as jsPlumb, which seems kind of likely, you might like to read [this page about loading jQuery](http://requirejs.org/docs/jquery.html) in the RequireJS documentation.  jsPlumb does not require any such shim.

###### Demonstration
There is a jsPlumb+RequireJS demonstration in the project at `demo/requirejs/index.html`

### Bower

jsPlumb can be referenced in a `component.json` (soon to be `bower.json`) with an entry like this:

    "jsPlumb": "git://github.com/sporritt/jsPlumb.git#1.5.0",
