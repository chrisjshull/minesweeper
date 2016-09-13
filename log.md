
This didn't seem like a task that begged for a big MVC framework, which intrigued me for two reasons: 1) I could try out some new (to me) build tools, and 2) I could play with some modern JS concepts that have been floating around in my head.

I started with Rollup because it looked interesting, but eventually added Gulp for non-JS related build tasks. I'm also particular to SASS and Autoprefixer so got those running too.

Runtime code wise I wanted to stay very vanilla, but decided to bring in jQuery for DOM manipulation ergonomics.

While coding I set myself a few goals:
- Localizable, and RTL-ready
- Keyboard playable
- Accessible (screen reader support, zoomable, proper color contrast)
- Flexible layout
- Mobile support

While I started protoyping with a plain `<table>`, I ended up not using table layout because inner-cell layout is so persnickety. At that point Safari did not to recognize the element sematics anymore (for accessibility), so I switched to `<div>`s with ARIA.







## Misc. notes:

 - You can test RTL layout you running `document.documentElement.dir = "rtl"` in the JS console.

- To get the the keyboard controls you can:
    - hit `tab` twice, or
    - click your first cell.

- Once the board is focused, you can press:
    - arrow keys to move around
    - `enter` or `space` to "click" a cell

- While the game currently doesn't expose the settings in the UI, the logic is not fixed to any particular dimensions or mine count.

- Instead of text color in the cells, I used used background color because I felt it was more readable.

- Using an emoji for the mine is fun, but could lead to cross-platform issues. Would likely want to replace that. (Fun fact though: VoiceOver speaks "bomb" quite nicely.)

- I love recursive reveal fades for tiled games like this. But depth-first recursion works nicely for cycle-avoidance, so I based the animation on distance from the original target.


## Future:

- Tests
- JSDocs
- Have the sourcemaps show post-Babel code
- Gulp serve/watch should not exit on error



more able miny framework
voiceover video
index.js factoring?
MVC?
prod build task with minification, sourcemap skipping, strip()
