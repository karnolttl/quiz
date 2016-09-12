$(document).ready(function() {

  var questionMgr = {
    currentIndex : -1
  }
  questionMgr.questions =  _.shuffle(['accident-blackspot', 'bumpy-road', 'dangerous-climb', 'fog-likely', 'intersection']);
  questionMgr.numOfQuestions = questionMgr.questions.length;
  questionMgr.points = _.fill(new Array(questionMgr.numOfQuestions),5);

  generateQuestion();
  enableGame();

  function generateQuestion() {
    questionMgr.currentIndex++;
    var signFilename = questionMgr.questions[questionMgr.currentIndex];
    $('#sign-title').html('Danger!<span>' + _.startCase(signFilename) + '!</span>')
    $('#points-value').text('(' + questionMgr.points[questionMgr.currentIndex] +' points)');
    $('#question-number').text(questionMgr.currentIndex+1 + ' of ' + questionMgr.numOfQuestions);
    var imgPosition = _.shuffle([0,1,2,3]);
    var i = 0;
    $('#sign-group').find('img').each(function(){
      $(this).attr('src','img/' + signFilename + '-' + imgPosition[i++] + '.png')
      .removeClass('hidden')
      .addClass('hov');
    });
  }

  function enableGame() {
    $('#sign-group').on('click', 'img', function() {
      n = Number($(this).attr('src').slice(-5).slice(0,1));
      evaluateSelection(n, $(this))
    });
  }

  function disableGame() {
    $('#sign-group').off('click', 'img');
    $('#sign-group > img').removeClass('hov')
  }

  function hideFakes() {
    $('#sign-group img:not(.hidden)').each(function() {
      n = Number($(this).attr('src').slice(-5).slice(0,1));
      if(n !== 0) {
        $(this).addClass('hidden');
      }
    });
  }

  function showResults() {
    $('.final-score').text($('#score-value').text() + ' of 25');
    $('#results-modal').fadeIn();
  }

  function pauseGame(str) {
    disableGame();
    $message = $('#message');
    $message.html(str).removeClass('hidden');
    $message.on('click', function() {
      if (questionMgr.currentIndex < 4) {
        generateQuestion();
        enableGame();
      }
      else {
        showResults();
      }
      $(this).addClass('hidden').off('click');
    });
  }

  function evaluateSelection(val, $sign) {
    if (val !== 0) {
      $sign.addClass('hidden');
      var pts = questionMgr.points[questionMgr.currentIndex]-=2;
      if (pts < 0) {
        $('#points-value').text('');
        pauseGame("<span>Sorry</span><span>Try again. You can do it!</span>");
        questionMgr.points[questionMgr.currentIndex] = 0;
      }
      else {
        var plural = (pts > 1) ? 's' : '';
        $('#points-value').text('(' + pts + ' point' + plural + ')')
      }
    }
    else {
      hideFakes();
      $scoreValue = $('#score-value');
      var s = Number($scoreValue.text());
      s += questionMgr.points[questionMgr.currentIndex];
      $scoreValue.html(s);
      pauseGame("<span>Good job!</span><span>Keep it up.</span>");
    }
  }

  $('#start-button').on('click', function() {
    $(this).parent().fadeOut();
  });

  $.fn.extend({
    animateCss: function (animationName) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          $(this).addClass('animated ' + animationName).one(animationEnd, function() {
              $(this).removeClass('animated ' + animationName);
          });
      }
  }); // end of fn.extend
}); // end of document ready function
