
This didn't seem like a task that begged for a big MVC framework, which intrigued me for two reasons: 1) I could try out some new (to me) build tools, and 2) I could play with some modern JS concepts that have been floating around in my head.

I started with Rollup because it looked interesting, but eventually added Gulp for non-JS related build tasks. I'm also particular to SASS and Autoprefixer so got those running too.

Runtime code wise I wanted to stay very vanilla, but decided to bring in jQuery for DOM manipulation ergonomics.

While coding I set myself a few goals:
 - Localizable, and RTL-ready
 - Keyboard playable
 - Accessible (screen reader support, zoomable, proper color contrast)
 - Flexible layout
 - Mobile support



While the game currently doesn't expose the settings in the UI, the logic is not fixed to any particular dimensions or mine count.

use _ for weak private ...

instead of text color, used background color - more readable, IMO

Using an emoji for the mine is fun, but could lead to cross-platform issues.
Would likely want to replace that.
(Fun fact though: VoiceOver speaks "bomb" quite nicely.)

document.documentElement.dir = "rtl"
tab twice, or click the col/row header and then arrow keys

goals:
tests


todo:
get babel to happen pre-sourcemap
gulp serve/watch should not exit on error
docs
tests


index.js factoring?


while I started protoyping with a plain `<table>`,
I ended up not using table layout because inner-cell layout
is so persnickety. (despite being semantic elements, this
cuased Safari not to recognize their sematics anymore, so switched to
`<div>`s with ARIA)

The challenge was a bit simple, so for fun I added a few extra things.
Chiefly, it's fully accessible so that (e.g.) blind people can play it. :)
You can also play with just the keyboard (hit tab twice, and then you can use the arrow keys and the spacebar).
It's also right-to-left ready, so if it were translated to (e.g.) Hebrew the entire layout would flip. (see below)


MVC?

I love little recursive reveal animation for tiles games like this.
Depth-first recursion works nicely though for easier cycle-avoidance,
so based the animation on distance from the original target.




The user clicks on a squares to uncover them. Each time:
If the square contains a mine, the user loses and game is over!
If the square is adjacent to a mine, the square displays the total number of mines in the 8 squares around it
If the square is neither a mine or adjacent to a mine, the square displays a blank, and should behave as if the 8 adjacent squares were also clicked (recursively applying this algorithm)

The user wins when they uncover all squares that don’t have mines.
