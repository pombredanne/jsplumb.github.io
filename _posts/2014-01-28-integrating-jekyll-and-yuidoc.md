---
layout: post
title:  "INTEGRATING JEKYLL AND YUIDOC"
date:   2014-01-28 14:00:00
categories: posts
---
Since version 1.6.0, jsPlumb uses the excellent [YUIDoc](http://yui.github.io/yuidoc/) library for API documentation.  This is not a post about
what a great tool YUIDoc is for API documentation; you can find those all over the internet.  This is a post about the few small steps we went through
to integrate YUIDoc with Jekyll.  Note that this refers to the **default** theme in YUIDoc.  Other themes will likely have differences, but the basic
concepts will remain the same: we want to come up with a way to move the boilerplate out into a Jekyll template, and add our own site-specific bits and
pieces to it.

### YUIDoc in 30 seconds

Here's a 30 second run down of the way YUIDoc breaks down its content:

- YUIDoc is themable
- Each theme has a main layout
- Most of the page is broken up into separate "partials"
- Any part of the page - including the main layout - can be overridden

On disk, this is represented with a directory structure like this:

- theme root
    - layouts
      - main.handlebars
    - partials
      - index.handlebars
      - ...

Here, **main.handlebars** is the main layout file.  **index.handlebars** is one of the several partials - in this case, the default page content when
the user lands on the API doc home page. This file is one of the files you will most likely want to override.


#### YUIDoc Layout File

The basic structure of the YUIDoc layout file is as follows:

```html
<!doctype html>
<html>
    <head>
    ... YUIDoc CSS imports ...
    </head>
    <body>
        ... page header ...
        
        ... page content - header, sidebar, main content pane ...
        
        ... YUIDoc script imports ...
    </body>
</html>
```

YUIDoc uses this layout file to generate every page it processes.  Internally, YUIDoc uses [Handlebars](http://handlebarsjs.com/) to process pages,
and the execution environment provides a few key pieces of information at page generation time.  Let's look at the page head first:


##### Page Head

```html
<head>
    <meta charset="utf-8">
    <title>{{htmlTitle}}</title>
    <link rel="stylesheet" href="{%raw%}{{yuiGridsUrl}}{%endraw%}">
    <link rel="stylesheet" href="{%raw%}{{projectAssets}}{%endraw%}/vendor/prettify/prettify-min.css">
    <link rel="stylesheet" href="{%raw%}{{projectAssets}}{%endraw%}/css/main.css" id="site_styles">
    <link rel="shortcut icon" type="image/png" href="{%raw%}{{projectAssets}}{%endraw%}/favicon.png">
    <script src="{%raw%}{{yuiSeedUrl}}{%endraw%}"></script>
</head>
```

So here, the template makes use of four parameters:

- htmlTitle
- yuiGridsUrl
- projectAssets
- yuiSeedUrl


##### Page Header

Next we have the page header - the default theme shows a fetching blue bar and the YUI logo:

```html
<body class="yui3-skin-sam">
    <div id="doc">
        <div id="hd" class="yui3-g header">
            <div class="yui3-u-3-4">
                {%raw%}{{#if projectLogo}}{%endraw%}
                    <h1><img src="{%raw%}{{projectLogo}}{%endraw%}" title="{%raw%}{{projectName}}{%endraw%}"></h1>
                {{else}}
                    <h1><img src="{%raw%}{{projectAssets}}{%endraw%}/css/logo.png" title="{%raw%}{{projectName}}{%endraw%}"></h1>
                {{/if}}
            </div>
            <div class="yui3-u-1-4 version">
                <em>API Docs for: {%raw%}{{projectVersion}}{%endraw%}</em>
            </div>
        </div>
    ...
```

Note here that the header is actually contained within a container div with id **doc**.  Don't worry too much about that.  

##### Page Content

This bit is where we see the class/module list, and the information about the currently selected item.  This is the bit that we want to 
rubber-stamp into our own Jekyll layout:

```html
    <div id="bd" class="yui3-g">
        <div class="yui3-u-1-4">
            <div id="docs-sidebar" class="sidebar apidocs">
                {%raw%}{{>sidebar}}{%endraw%}
            </div>
        </div>
        <div class="yui3-u-3-4">
            {%raw%}{{>options}}{%endraw%}
            <div class="apidocs">
                <div id="docs-main">
                    <div class="content">
                        {%raw%}{{>layout_content}}{%endraw%}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

That last `</div>` tag is the closing tag for the **doc** div. Of interest in this section are the `{%raw%}{{>sidebar}}{%endraw%}` 
and `{%raw%}{{>layout_content}}{%endraw%}` partials.  Unless I am very much mistaken, they refer to the page sidebar and the page content, respectively.

##### Script Imports

Lastly, in keeping with ySlow's recommendations, we have the bulk of the JS imports:

```html
<script src="{%raw%}{{projectAssets}}{%endraw%}/vendor/prettify/prettify-min.js"></script>
<script>prettyPrint();</script>
<script src="{%raw%}{{projectAssets}}{%endraw%}/js/yui-prettify.js"></script>
<script src="{%raw%}{{projectAssets}}{%endraw%}/../api.js"></script>
<script src="{%raw%}{{projectAssets}}{%endraw%}/js/api-filter.js"></script>
<script src="{%raw%}{{projectAssets}}{%endraw%}/js/api-list.js"></script>
<script src="{%raw%}{{projectAssets}}{%endraw%}/js/api-search.js"></script>
<script src="{%raw%}{{projectAssets}}{%endraw%}/js/apidocs.js"></script>
</body>
</html>
```

Once again we see the `projectAssets` variable being substituted in several places.


### Converting to Jekyll

So - as mentioned at the top of this post, we are looking to rubber-stamp each page inside of our own Jekyll template.  Let's
pull all of the page head, page header and script import stuff out into a layout, and maybe add our own markup:

```html
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>{%raw%}{{htmlTitle}}{%endraw%}</title>
    <link rel="stylesheet" href="{%raw%}{{ yuiGridsUrl }}{%endraw%}">
    <link rel="stylesheet" href="{%raw%}{{ projectAssets }}{%endraw%}/vendor/prettify/prettify-min.css">
    <link rel="stylesheet" href="{%raw%}{{ projectAssets }}{%endraw%}/css/main.css" id="site_styles">
    <link rel="shortcut icon" type="image/png" href="{%raw%}{{ projectAssets }}{%endraw%}/favicon.png">
    <script src="{%raw%}{{ yuiSeedUrl }}{%endraw%}"></script>
</head>
<body class="yui3-skin-sam">
    
    {%raw%}{% include header.html %}{%endraw%}
    
    {%raw%}{{ content }}{%endraw%}
    
<script src="{%raw%}{{ projectAssets }}{%endraw%}/vendor/prettify/prettify-min.js"></script>
<script>prettyPrint();</script>
<script src="{%raw%}{{ projectAssets }}{%endraw%}/js/yui-prettify.js"></script>
<script src="{%raw%}{{ projectAssets }}{%endraw%}/../api.js"></script>
<script src="{%raw%}{{ projectAssets }}{%endraw%}/js/api-filter.js"></script>
<script src="{%raw%}{{ projectAssets }}{%endraw%}/js/api-list.js"></script>
<script src="{%raw%}{{ projectAssets }}{%endraw%}/js/api-search.js"></script>
<script src="{%raw%}{{ projectAssets }}{%endraw%}/js/apidocs.js"></script>
</body>
</html>
```

I've written that into the file `_layouts/apidoc.html`. 

Now **main.handlebars** can consist of just the page content markup.  Of course we need Jekyll to process it, so we will give it some
YAML front matter as well:

```html
---
layout: apidoc
title:  "jsPlumb API documentation"
date:   2014-01-01 00:00:00
categories: apidocs
---
    <div id="bd" class="yui3-g">
        <div class="yui3-u-1-4">
            <div id="docs-sidebar" class="sidebar apidocs">
                {%raw%}{{>sidebar}}{%endraw%}
            </div>
        </div>
        <div class="yui3-u-3-4">
            {%raw%}{{>options}}{%endraw%}
            <div class="apidocs">
                <div id="docs-main">
                    <div class="content">
                        {%raw%}{{>layout_content}}{%endraw%}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

Excellent! Or is it? The layout file refers to variables like **pageAssets** and **yuiSeedUrl**. We need to expose them to Jekyll...which, it
turns out, is very simple - we just expose them in the front matter. So now **main.handlebars** looks like this:

```html
---
layout: apidoc
title:  "jsPlumb API documentation - {%raw%}{{htmlTitle}}{%endraw%}"
date:   2014-01-01 00:00:00
categories: apidocs
yuiGridsUrl: {%raw%}{{yuiGridsUrl}}{%endraw%}
yuiSeedUrl: {%raw%}{{yuiSeedUrl}}{%endraw%}
projectAssets: {%raw%}{{projectAssets}}{%endraw%}
---
    <div id="bd" class="yui3-g">
        <div class="yui3-u-1-4">
            <div id="docs-sidebar" class="sidebar apidocs">
                {%raw%}{{>sidebar}}{%endraw%}
            </div>
        </div>
        <div class="yui3-u-3-4">
            {%raw%}{{>options}}{%endraw%}
            <div class="apidocs">
                <div id="docs-main">
                    <div class="content">
                        {%raw%}{{>layout_content}}{%endraw%}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

..and we had to slightly alter the Jekyll layout, because these variables are now scoped by **page**. So our final layout file looks like this:

```html
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>{%raw%}{{page.title}}{%endraw%}</title>
    <link rel="stylesheet" href="{%raw%}{{ page.yuiGridsUrl }}{%endraw%}">
    <link rel="stylesheet" href="{%raw%}{{ page.projectAssets }}{%endraw%}/vendor/prettify/prettify-min.css">
    <link rel="stylesheet" href="{%raw%}{{ page.projectAssets }}{%endraw%}/css/main.css" id="site_styles">
    <link rel="shortcut icon" type="image/png" href="{%raw%}{{ page.projectAssets }}{%endraw%}/favicon.png">
    <script src="{%raw%}{{ page.yuiSeedUrl }}{%endraw%}"></script>
</head>
<body class="yui3-skin-sam">
    
    {%raw%}{{ content }}{%endraw%}
    
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/vendor/prettify/prettify-min.js"></script>
<script>prettyPrint();</script>
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/js/yui-prettify.js"></script>
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/../api.js"></script>
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/js/api-filter.js"></script>
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/js/api-list.js"></script>
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/js/api-search.js"></script>
<script src="{%raw%}{{ page.projectAssets }}{%endraw%}/js/apidocs.js"></script>
</body>
</html>
```