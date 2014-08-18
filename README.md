# This is a demo of Angular skills utilizing SVG

The original purpose was to programmatically turn line segments into arcs.  Eventually, these line segments are to be a part of text drawn in SVG.

### Running the app during development

You can pick one of these options:

* serve this repository with your webserver
* install node.js and run `node scripts/web-server.js`
  * If you have response issues, try changing the port number with `node scripts/web-server.js XXXX`
 



Then navigate your browser to `http://localhost:<port>/app/index.html` to see the app running in
your browser.

To utilize the jasmine tests, run "npm install" to be sure you have all dependencies.  Then read more good things from the kind group that shared their angular seed project here:

https://github.com/angular/angular-seed.

If you happen to have a $@#% Windows machine and you are having issues, you also have the option of running test.bat in the scripts directory, but you will also need to install karma command line:

https://www.npmjs.org/package/karma-cli

To have the sass converted to css automatically, ONE option is to run:

sass --watch stayle.scss:stayle.css

from the css dir.  Of course, you need to install sass.
