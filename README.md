tiles
=====

Old School number tiles game

Quick start
=====

1. Clone this repo
2. Exec npm install && bower install
3. Exec karma start karma.conf.js
4. Open index.html (either add a simple server.js file and node it, or open the file directly or...)


Why
=====
I'd originally tried playing with the concepts of Backbone.js and trying to understand how I would handle routing,
events and other aspects of MV* JavaScript development.  I thought it might be fun to port it to Angular.

What went really wrong
=====
JSON. I made the mistake of not reading the source code, and I really took too much for granted with the way browsers
serialize and de-serialize objects to-from JSON.  Thanks (once again to StackOverflow) I've got a new project to try
http://stackoverflow.com/questions/8111446/turning-json-strings-into-objects-with-methods

Separation of concerns vs Single Manipulator Principle.  You can see in the MainCtrl that I'm manipulating the UI
separately from the Model that backs it.  This is wrong.  Obviously the model structure of the GridModel is not right
at all.  I didn't improve upon it from the Backbone version.  If I keep playing with this, that's an area ripe for
refactoring.

What was fun
=====
Learing how $scope.$apply works, and why it really is a good idea to read the source


Known Problems
=====
1. Doesn't generate random games
2. Doesn't store state
3. Was not a good TDD example, there's a lot of untested FN in gameService
4. I'm not liking the ._. privates pattern.  I should look at other options
5. this vs. self vs. named instance - need to pick a pattern here