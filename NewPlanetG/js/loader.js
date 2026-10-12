/**
 * Planet G - Fast Botanical Loader Controller
 * 1. Shows only ONCE per visit/session (using sessionStorage).
 * 2. Instant zero-delay bypass when moving between pages in the same session.
 * 3. Shortened display time (~150ms-180ms) on initial visit so it never holds up visitors.
 */
(function () {
  'use strict';

  var SESSION_KEY = 'planetg_visited';
  var isVisited = false;
  try {
    isVisited = sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch (e) {}

  var loader = document.getElementById('pg-loader-overlay') || document.querySelector('.pg-loader-overlay');

  if (isVisited) {
    if (loader) {
      loader.style.display = 'none';
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }
    return;
  }

  // Mark session as visited
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch (e) {}

  var dismissed = false;

  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;

    var el = document.getElementById('pg-loader-overlay') || document.querySelector('.pg-loader-overlay');
    if (!el) return;

    el.classList.add('is-hidden');

    setTimeout(function () {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 350);
  }

  // Immediate dismiss on click/tap
  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('pg-loader-overlay') || document.querySelector('.pg-loader-overlay');
    if (el) {
      el.addEventListener('click', dismissLoader);
      el.addEventListener('touchstart', dismissLoader, { passive: true });
    }
  });

  // Shortened delay: dismiss as soon as DOM is interactive
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(dismissLoader, 150);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(dismissLoader, 180);
    });
  }

  window.addEventListener('load', function () {
    setTimeout(dismissLoader, 100);
  });

  // Safety failsafe: never hold up longer than 450ms
  setTimeout(dismissLoader, 450);
})();
