/* =============================================
   CABINET OROCHI — PRICING TOGGLE JS
   Toggle between: Cabinet / Yopougon / Hors Yopougon
   ============================================= */

(function () {
  'use strict';

  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const panels = document.querySelectorAll('.pricing-panel');

  if (!toggleBtns.length || !panels.length) return;

  function activatePanel(id) {
    // Update buttons
    toggleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === id);
    });
    // Update panels with smooth transition
    panels.forEach(panel => {
      if (panel.id === id) {
        panel.style.opacity = '0';
        panel.classList.add('active');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.style.transition = 'opacity 0.35s ease';
            panel.style.opacity = '1';
          });
        });
      } else {
        panel.classList.remove('active');
        panel.style.opacity = '';
        panel.style.transition = '';
      }
    });
    // Persist selection in sessionStorage
    sessionStorage.setItem('orochi_pricing_tab', id);
  }

  // Bind toggle buttons
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => activatePanel(btn.dataset.target));
  });

  // Restore last selection or default to first tab
  const saved = sessionStorage.getItem('orochi_pricing_tab');
  const firstPanelId = panels[0].id;
  activatePanel(saved && document.getElementById(saved) ? saved : firstPanelId);

  /* ---- URL hash navigation for pricing tabs ---- */
  const hashMap = {
    '#cabinet': 'panel-cabinet',
    '#yopougon': 'panel-yopougon',
    '#hors-yopougon': 'panel-hors'
  };

  function checkHash() {
    const hash = window.location.hash;
    if (hashMap[hash]) activatePanel(hashMap[hash]);
  }
  window.addEventListener('hashchange', checkHash);
  checkHash();

})();
