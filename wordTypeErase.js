// ===================
// wordTypeErase.js
// by Ben Lodge
// github.com/benrlodge
// ===================

'use strict';


$.fn.wordTypeErase = function(options) {

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

  var firstHighlight = true;
  var words = '';
  var firstWord = '';
  var lastWord = '';


  // Clear timeouts if someone navigates 
  // away opening a new browser tab
  var timeouts = [];

  // Use tab change function to determine
  // when someone navigates away, and if so
  // clear the timeouts
  TabChange(function(){
    for (var i = 0; i < timeouts.length; i++){
      clearTimeout(timeouts[i]);
    }
    console.log('Restart timers')
    // When visitor returns, set word to last in the list
    $(settings.destination).html(lastWord);
  })


  // The reverse highlighting of each letter
  var highlight = function(wordLength){

    //get length of string working with
    var i = 0;
    (function iterator() {
      var target = wordLength - i;
      var nextChar = "[data-pos='"+target+"']";
      $(settings.destination).find(nextChar).addClass('highlight');

      // Loop through letters adding highlight class
      if(i++ < wordLength) {
          timeouts.push(setTimeout(iterator, settings.highlightSpeed));
      }
      if(i == wordLength && firstHighlight){
        firstHighlight = false;
        // Kick off rest of words in data attribute
        getOnWithTheWords();  
      }

    })();

  };


  // Here we type out each individual word, one letter at a time
  var wordType = function(word, iteration, iterations, randArr){

    var wordLength = word.length;
    var i = 0;
    var l = wordLength;
    
    (function iterator() {
        var letter = word[i];
        $(settings.destination).append("<span data-pos='"+i+"'>"+letter+"</span>");

        // Loop through letters typing out
        if(++i < l) {
            timeouts.push(setTimeout(iterator, randArr[i]));
        }

        // After all letters are typed out, delay a bit, then highlight them
        if(i == l){
          
          timeouts.push(setTimeout(function(){
            if(iteration === iterations){
              return false;
            }  
            highlight(wordLength, iteration, iterations);

          }, 1300));

        }

    })();

  };


  // Here we get the the length of each word (number of letters)
  // figure out the delays based on how long each word is
  // And then start the iterator which will call wordType()

  var wordTypePrep = function(){

    $(settings.destination).empty();

    var i = 0;
    var l = words.length;
    var interations = l - 1;
    var randArr = [];


    // iterate through each word from the list
    (function iterator() {

        //clear the text area
        $(settings.destination).empty();

        //Add a space after the word
        var word = words[i].trim();


        // create random speeds for letters
        randArr = [];
        var randSum = 0;
        
        for(var g = 0; g < word.length; g++){
          var rand = Math.floor( Math.random() * 40 );
          var randType =  Math.round(Math.random());

          if(randType){ 
            randArr.push(settings.letterSpeed - rand); 
            randSum += settings.letterSpeed - rand;
          }
          else{ 
            randArr.push(settings.letterSpeed + rand); 
            randSum += settings.letterSpeed + rand;
          }

        }

        //start the typing with wordType()
        var delay = (randSum) + (settings.letterSpeed * (word.length));
        wordType(word, i, interations, randArr);

        //loop until all words are typed
        if(++i < l) {
          // Set timeout for new words by how long it will take to type out and remove words
          // Note - There is an issue here - the delay is tied to the length of the
          // phrase - so very long phrases have very long delays but I'd rather they not.
          // If anyone has a solution I'm open for pull requests or recommendations on Github issues
          timeouts.push(setTimeout(iterator, delay + settings.delayOfWords));
        }

        // Loop
        if (i == l && settings.loop) {
          timeouts.push(setTimeout(function() {
            if (words[0] != firstWord) {
              words.unshift(firstWord);
            }
            firstHighlight = true;
            highlight(words[words.length-1].length);
          }, delay + settings.delayBetweenLoop));
        }
    })();
 
  };


  // Turn first word in html as spans needed for highlight
  var firstWordSpanIze = function(firstWord){
  
    var firstWordSpanned = '';
    for(var i = 0; i<firstWord.length; i++){
      firstWordSpanned += "<span data-pos='"+i+"'>"+firstWord[i]+"</span>";
    }
    return firstWordSpanned;
  };


  // Kick off data attribute words
  var getOnWithTheWords = function(){
    timeouts.push(setTimeout(function(){
      $(settings.destination).empty();
      wordTypePrep(words);
      }, 800));
  };



  // plugin return
  return this.each(function() {
    var scope = this;
    
    // Get comma separated word list from data attribute.
    words = $(this).data('type-words').split(',');
    
    // Set first and last words
    firstWord = ($(scope).text());
    lastWord = (words[words.length-1]).trim()
    var firstWordLength = firstWord.length;
    
    // Turn first word in html as spans needed for highlight
    var fwSpan = firstWordSpanIze(firstWord);
    $(this).html(fwSpan);
    
    // Highlight first word
    timeouts.push(setTimeout(function(){
      highlight(firstWordLength);
    }, settings.delayOfStart));

  });


};






function TabChange(callback){

  // Get Browser Prefix
  var prefix = getBrowserPrefix();
  var hidden = hiddenProperty(prefix);
  var visibilityState = visibilityState(prefix);
  var visibilityEvent = visibilityEvent(prefix);
   
  
  // Get Browser-Specifc Prefix
  function getBrowserPrefix() {
     
    // Check for the unprefixed property.
    if ('hidden' in document) {
      return null;
    }
   
    // All the possible prefixes.
    var browserPrefixes = ['moz', 'ms', 'o', 'webkit'];
   
    for (var i = 0; i < browserPrefixes.length; i++) {
      var prefix = browserPrefixes[i] + 'Hidden';
      if (prefix in document) {
        return browserPrefixes[i];
      }
    }
   
    // The API is not supported in browser.
    return null;
  }
   
  // Get Browser Specific Hidden Property
  function hiddenProperty(prefix) {
    if (prefix) {
      return prefix + 'Hidden';
    } else {
      return 'hidden';
    }
  }
   
  // Get Browser Specific Visibility State
  function visibilityState(prefix) {
    if (prefix) {
      return prefix + 'VisibilityState';
    } else {
      return 'visibilityState';
    }
  }
   
  // Get Browser Specific Event
  function visibilityEvent(prefix) {
    if (prefix) {
      return prefix + 'visibilitychange';
    } else {
      return 'visibilitychange';
    }
  }

  // Visibility Change 
  document.addEventListener(visibilityEvent, function(event) {

    if (document[hidden]) {      
      if (callback && typeof(callback == 'function')){
        callback();
      }
    } 
  });
   

}