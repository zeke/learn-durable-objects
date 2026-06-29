/**
 * quiz.js — reusable quiz widget for learn-durable-objects lessons
 *
 * Usage in HTML:
 *
 *   <div class="quiz" data-quiz="quiz1">
 *     <p class="quiz-question">What is X?</p>
 *     <ul class="quiz-options">
 *       <li data-correct="true">The right answer</li>
 *       <li>A wrong answer</li>
 *       <li>Another wrong answer</li>
 *       <li>Yet another wrong answer</li>
 *     </ul>
 *     <p class="quiz-feedback" hidden></p>
 *   </div>
 *
 * Rules for quiz authors:
 * - All answer options must be the same number of words (and ideally similar character count).
 *   This prevents formatting from leaking the answer.
 * - Exactly one <li> should have data-correct="true".
 * - The quiz-feedback element is shown after the user selects an answer.
 */

(function () {
  function initQuiz(container) {
    const options = container.querySelectorAll('.quiz-options li');
    const feedback = container.querySelector('.quiz-feedback');
    let answered = false;

    options.forEach(function (option) {
      option.style.cursor = 'pointer';
      option.style.padding = '0.5rem 0.75rem';
      option.style.marginBottom = '0.4rem';
      option.style.borderRadius = '3px';
      option.style.border = '1px solid #ddd';
      option.style.listStyle = 'none';
      option.style.fontFamily = 'sans-serif';
      option.style.fontSize = '0.9rem';
      option.style.transition = 'background 0.15s';
      option.style.background = '#fff';
      option.style.display = 'block';

      option.addEventListener('mouseenter', function () {
        if (!answered) option.style.background = '#f5f4ef';
      });
      option.addEventListener('mouseleave', function () {
        if (!answered) option.style.background = '#fff';
      });

      option.addEventListener('click', function () {
        if (answered) return;
        answered = true;

        var isCorrect = option.dataset.correct === 'true';

        // Reveal all correct/incorrect states
        options.forEach(function (o) {
          o.style.cursor = 'default';
          if (o.dataset.correct === 'true') {
            o.style.background = '#edf7ed';
            o.style.borderColor = '#2d6a2d';
            o.style.color = '#2d6a2d';
          } else if (o === option && !isCorrect) {
            o.style.background = '#fdf0f0';
            o.style.borderColor = '#8b0000';
            o.style.color = '#8b0000';
          }
        });

        // Show feedback
        if (feedback) {
          feedback.hidden = false;
          feedback.style.fontFamily = 'sans-serif';
          feedback.style.fontSize = '0.88rem';
          feedback.style.marginTop = '0.75rem';
          feedback.style.padding = '0.6rem 0.8rem';
          feedback.style.borderRadius = '3px';

          if (isCorrect) {
            feedback.style.background = '#edf7ed';
            feedback.style.color = '#2d6a2d';
            feedback.textContent = feedback.dataset.correct || 'Correct.';
          } else {
            feedback.style.background = '#fdf0f0';
            feedback.style.color = '#8b0000';
            feedback.textContent = feedback.dataset.incorrect || 'Not quite. The correct answer is highlighted above.';
          }
        }
      });
    });

    // Remove default list padding
    var ul = container.querySelector('.quiz-options');
    if (ul) {
      ul.style.padding = '0';
      ul.style.margin = '0.75rem 0 0';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.quiz').forEach(initQuiz);
  });
})();
