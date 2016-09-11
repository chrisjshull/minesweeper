Using rollupjs because i hadn't before and it looked interesting.
Additionally, this seemed like a task that wouldn't require a big MVC framework.
Which meant I could also play with some vanilla JS, esp. some of the ES2015
stuff that hasn't been adopted by those frameworks yet.

rollup is more suited for JS than CSS, so chose to wrap it in gulp.
(Hae also never used gulp before and it felt like a good choice, and a good learning oppertunity)

Using jQuery mostly for dev ergonomics.


use _ for weak private ...

// board captures clicks on gameover?



goals:
learn new build tooling
rtl, loc
ax
flexible layout
mobile support
webcomponents
tests


todo:
get babel to happen pre-sourcemap



Features to cover in your implementation:
Consistent display of the game board
Implementation of the square uncovering algorithm above
Different colors for different square numbers
When the user wins or loses, indicate which squares had mines
Indicate whether the user has won or lost
Some way of restarting the game

Other notes:
You can use any visual style, as long as the different square states are clear
Don’t worry about other features from the original game (flagging, a timer, scores)
Please use a JavaScript framework that you’re comfortable with (Backbone, React, Angular, Gulp, Browserify, etc.)

The game consists of a 9x9 grid of squares, with 10 “mines” randomly hidden in 10 of the squares.

The user clicks on a squares to uncover them. Each time:
If the square contains a mine, the user loses and game is over!
If the square is adjacent to a mine, the square displays the total number of mines in the 8 squares around it
If the square is neither a mine or adjacent to a mine, the square displays a blank, and should behave as if the 8 adjacent squares were also clicked (recursively applying this algorithm)

The user wins when they uncover all squares that don’t have mines.
