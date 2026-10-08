/**
 * Planet G - Ultra-Fast Botanical Loader Controller
 * Automatically dismisses loader smoothly when DOM is ready or within max 800ms.
 * Tap/click anywhere dismisses immediately.
 */
(function () {
  'use strict';

  var dismissed = false;

  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;

    var loader = document.getElementById('pg-loader-overlay') || document.querySelector('.pg-loader-overlay');
    if (!loader) return;

    loader.classList.add('is-hidden');

    // Remove from DOM after CSS fade transition completes
    setTimeout(function () {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 600);
  }

  // Dismiss on click/tap on loader overlay
  document.addEventListener('DOMContentLoaded', function () {
    var loader = document.getElementById('pg-loader-overlay') || document.querySelector('.pg-loader-overlay');
    if (loader) {
      loader.addEventListener('click', dismissLoader);
      loader.addEventListener('touchstart', dismissLoader, { passive: true });
    }
  });

  // Fast dismissal: when DOM is interactive (doesn't wait for images/network)
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(dismissLoader, 300);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(dismissLoader, 350);
    });
  }

  // Fallback for full page window load
  window.addEventListener('load', function () {
    setTimeout(dismissLoader, 200);
  });

  // ABSOLUTE SAFETY FAILSAFE: Never keep user waiting longer than 750ms
  setTimeout(dismissLoader, 750);
})();
