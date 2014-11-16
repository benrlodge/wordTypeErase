# wordTypeErase

This is a little text animation plugin that will type out a series of words one after the other, with it highlighting and erasing each word one at a time.

[See a Demo](http://benrlodge.github.io/wordTypeErase)



## Dependencies
 - jQuery
 - wordTypeErase.js


## How to use

```html

<style>
.highlight {
  background: rgba(247, 118, 31, 0.95);
}
</style>

<p class='words mywords' data-type-words="One phrase, another, then some more, that's all">This will be replaced by the first phrase</h4>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src='wordTypeErase.js'></script>
<script>
    $('.mywords').wordTypeErase(); 
</script>

```


## Options

```javascript

  var settings = $.extend({
    delayOfStart: 1200,        // delay before typing begins
    letterSpeed: 125,          // delay between letters typed
    highlightSpeed: 22,        // 
    delayOfWords: 1400,        // delay between words being typed
    destination: this,         // optional destination for text
    naturalTypingSpeed: true,  // randomizes the delay between letters to simulate a more natural typing
    loop: false,               // whether the animation should be restarted at the end
    delayBetweenLoop: 1200,    // delay between loop
  }, options);

```