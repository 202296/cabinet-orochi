/* =============================================
   CABINET OROCHI — DISCOUNT CALCULATOR JS
   25% discount for 6-session packages
   Dynamic pricing display on pricing page
   ============================================= */

(function () {
  'use strict';

  const DISCOUNT_RATE = 0.25;
  const FORFAIT_SESSIONS = 6;

  /* ---- Service data per location ---- */
  const serviceData = {
    cabinet: [
      {
        id: 'depistage', icon: '🔍', label: 'Dépistage des lacunes',
        inscription: 3000, seance: null, nbSeances: 1, transport: 0,
        desc: 'Évaluation initiale des lacunes scolaires de l\'élève.',
        discount: false
      },
      {
        id: 'bilan', icon: '📋', label: 'Bilan de conscience',
        inscription: 7500, seance: null, nbSeances: 1, transport: 0,
        desc: 'Entretien approfondi pour identifier les causes des difficultés.',
        discount: false
      },
      {
        id: 'conference', icon: '🎤', label: 'Conscientisation (conférence)',
        inscription: 2500, seance: null, nbSeances: 1, transport: 0,
        desc: 'Conférence de sensibilisation pour l\'élève et la famille.',
        discount: false
      },
      {
        id: 'techniques', icon: '📅', label: 'Techniques d\'étude & Emploi du temps',
        inscription: 5000, seance: null, nbSeances: 2, transport: 0,
        desc: 'Méthodes d\'apprentissage efficaces, tracé d\'emploi du temps.',
        discount: false
      },
      {
        id: 'lecture', icon: '📖', label: 'Formation en lecture',
        inscription: 10000, seanceEleve: 2500, seanceNonEleve: 5000, nbSeances: 13, transport: 0,
        desc: 'Programme complet de remédiation en lecture.',
        discount: false,
        inscriptionNonEleve: 20000
      },
      {
        id: 'dictee', icon: '✏️', label: 'Perfectionnement en dictée',
        inscription: 5000, seanceEleve: 2500, seanceNonEleve: 5000, nbSeances: 25, transport: 0,
        desc: 'Correction des lacunes en orthographe et expression écrite.',
        discount: false
      },
      {
        id: 'maths', icon: '➕', label: 'Remédiation en mathématiques',
        inscription: 5000, seanceEleve: 2500, seanceNonEleve: 5000, nbSeances: 24, transport: 0,
        desc: 'Rattrapage intensif en calcul, algèbre et géométrie.',
        discount: false
      },
      {
        id: 'anglais', icon: '🇬🇧', label: 'Perfectionnement en anglais',
        inscription: 0, seanceEleve: 2500, seanceNonEleve: 5000, nbSeances: null, transport: 0,
        desc: 'Amélioration du niveau d\'anglais oral et écrit.',
        discount: false
      },
      {
        id: 'metier', icon: '🌟', label: 'Rencontre de mon métier de rêve',
        inscription: 30000, seance: null, nbSeances: 1, transport: 0,
        desc: 'Séance d\'orientation professionnelle et découverte métiers.',
        discount: false
      }
    ],
    yopougon: [
      {
        id: 'depistage', icon: '🔍', label: 'Dépistage des lacunes',
        inscription: 10000, seance: null, nbSeances: 1, transport: 5000,
        desc: 'Dépistage à domicile à Yopougon.',
        discount: false
      },
      {
        id: 'bilan', icon: '📋', label: 'Bilan de conscience',
        inscription: 20000, inscriptionExtra: 10000, seance: null, nbSeances: 2, transport: 5000,
        desc: 'Bilan approfondi à domicile (+ 10.000 FCFA / élève supplémentaire).',
        discount: false
      },
      {
        id: 'conference', icon: '🎤', label: 'Conscientisation (conférence)',
        inscription: 30000, inscriptionExtra: 15000, seance: null, nbSeances: 1, transport: 10000,
        desc: 'Conférence à domicile (+ 15.000 FCFA / élève supplémentaire).',
        discount: false
      },
      {
        id: 'techniques', icon: '📅', label: 'Techniques d\'étude & Emploi du temps',
        inscription: 30000, inscriptionExtra: 15000, seance: null, nbSeances: 2, transport: 5000,
        desc: 'Formation méthodes à domicile (+ 15.000 FCFA / élève supplémentaire).',
        discount: false
      },
      {
        id: 'lecture', icon: '📖', label: 'Formation en lecture',
        inscription: 20000, seance: 10000, nbSeances: 13, transport: 5000,
        desc: 'Séance : 15.000 FCFA (10.000 + 5.000 transport).',
        discount: true
      },
      {
        id: 'dictee', icon: '✏️', label: 'Perfectionnement en dictée',
        inscription: 20000, seance: 10000, nbSeances: 25, transport: 5000,
        desc: 'Séance : 15.000 FCFA (10.000 + 5.000 transport).',
        discount: true
      },
      {
        id: 'maths', icon: '➕', label: 'Remédiation en mathématiques',
        inscription: 20000, seance: 10000, nbSeances: 24, transport: 5000,
        desc: 'Séance : 15.000 FCFA (10.000 + 5.000 transport).',
        discount: true
      }
    ],
    hors: [
      {
        id: 'depistage', icon: '🔍', label: 'Dépistage des lacunes',
        inscription: 20000, seance: null, nbSeances: 1, transport: 10000,
        desc: 'Dépistage à domicile hors Yopougon.',
        discount: false
      },
      {
        id: 'bilan', icon: '📋', label: 'Bilan de conscience',
        inscription: 30000, inscriptionExtra: 15000, seance: null, nbSeances: 2, transport: 10000,
        desc: 'Bilan à domicile (+ 15.000 FCFA / élève supplémentaire).',
        discount: false
      },
      {
        id: 'conference', icon: '🎤', label: 'Conscientisation (conférence)',
        inscription: 50000, inscriptionExtra: 25000, seance: null, nbSeances: 1, transport: 20000,
        desc: 'Conférence à domicile (+ 25.000 FCFA / élève supplémentaire).',
        discount: false
      },
      {
        id: 'techniques', icon: '📅', label: 'Techniques d\'étude & Emploi du temps',
        inscription: 50000, inscriptionExtra: 25000, seance: null, nbSeances: 2, transport: 10000,
        desc: 'Formation méthodes (+ 25.000 FCFA / élève supplémentaire).',
        discount: false
      },
      {
        id: 'lecture', icon: '📖', label: 'Formation en lecture',
        inscription: 20000, seance: 20000, nbSeances: 13, transport: 10000,
        desc: 'Séance : 30.000 FCFA (20.000 + 10.000 transport).',
        discount: true
      },
      {
        id: 'dictee', icon: '✏️', label: 'Perfectionnement en dictée',
        inscription: 20000, seance: 20000, nbSeances: 25, transport: 10000,
        desc: 'Séance : 30.000 FCFA (20.000 + 10.000 transport).',
        discount: true
      },
      {
        id: 'maths', icon: '➕', label: 'Remédiation en mathématiques',
        inscription: 20000, seance: 20000, nbSeances: 24, transport: 10000,
        desc: 'Séance : 30.000 FCFA (20.000 + 10.000 transport).',
        discount: true
      }
    ]
  };

  function fmt(n) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }

  function calcDiscount(seance) {
    return Math.round(seance * (1 - DISCOUNT_RATE));
  }

  /* ---- Build pricing cards for a panel ---- */
  function buildPricingPanel(location, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const services = serviceData[location] || [];
    const html = services.map(s => {
      const seanceTotal = s.seance !== undefined ? (s.seance || 0) + (s.transport || 0) : null;
      const discountedSeance = s.discount && s.seance ? calcDiscount(s.seance) : null;
      const discountedTotal = discountedSeance !== null ? discountedSeance + s.transport : null;
      const inscRef = s.seanceEleve || s.seance || null;
      const mainPrice = s.inscription || (inscRef ? inscRef + s.transport : 0);

      return `
        <div class="pricing-card${s.id === 'lecture' || s.id === 'maths' ? ' featured' : ''} fade-in">
          <div class="pricing-card-header">
            <div class="icon-box icon-box-white" style="margin-bottom:12px;">${s.icon}</div>
            <h3>${s.label}</h3>
            <div class="service-sub">${s.desc}</div>
          </div>
          <div class="pricing-card-body">

            ${s.inscription ? `
            <div class="price-block">
              <span class="price-label">Inscription</span>
              <div>
                <span class="price-amount">${new Intl.NumberFormat('fr-FR').format(s.inscription)}</span>
                <span class="price-currency">FCFA</span>
              </div>
              ${s.inscriptionNonEleve ? `<div class="price-secondary">Non-élève : <strong>${fmt(s.inscriptionNonEleve)}</strong></div>` : ''}
              ${s.inscriptionExtra ? `<div class="price-secondary">+ ${fmt(s.inscriptionExtra)} / élève supp.</div>` : ''}
            </div>` : ''}

            <div class="pricing-details">
              ${seanceTotal !== null ? `
              <div class="pricing-detail-item">
                <span class="d-label">Coût par séance</span>
                <span class="d-value">${fmt(seanceTotal)}</span>
              </div>` : ''}
              ${s.transport ? `
              <div class="transport-note">
                <span class="t-icon">🚗</span>
                Transport inclus : <strong>${fmt(s.transport)}</strong>
              </div>` : ''}
              ${s.nbSeances ? `
              <div class="pricing-detail-item">
                <span class="d-label">Nombre de séances</span>
                <span class="d-value">${s.nbSeances} séance(s)</span>
              </div>` : ''}
              ${s.seanceEleve ? `
              <div class="pricing-detail-item">
                <span class="d-label">Séance (élève)</span>
                <span class="d-value">${fmt(s.seanceEleve)}</span>
              </div>
              <div class="pricing-detail-item">
                <span class="d-label">Séance (non-élève)</span>
                <span class="d-value">${fmt(s.seanceNonEleve)}</span>
              </div>` : ''}
            </div>

            ${s.discount && s.seance ? `
            <div class="forfait-section">
              <h5>🎁 Forfait ${FORFAIT_SESSIONS} séances</h5>
              <div class="forfait-row">
                <span>Prix normal</span>
                <span class="before">${fmt(seanceTotal)}/séance</span>
              </div>
              <div class="forfait-row" style="margin-top:6px;">
                <span>Avec forfait</span>
                <span class="after">${fmt(discountedTotal)}/séance</span>
                <span class="saving-tag">-25%</span>
              </div>
              <div style="font-size:0.78rem;color:var(--gray);margin-top:8px;">
                Économie : ${fmt(seanceTotal - discountedTotal)} / séance
              </div>
            </div>` : ''}

          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;

    // Re-trigger fade-in for newly created elements
    if ('IntersectionObserver' in window) {
      const newEls = container.querySelectorAll('.fade-in');
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      newEls.forEach(el => obs.observe(el));
    } else {
      container.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    }
  }

  /* ---- Initialize panels ---- */
  buildPricingPanel('cabinet', 'cards-cabinet');
  buildPricingPanel('yopougon', 'cards-yopougon');
  buildPricingPanel('hors', 'cards-hors');

  /* ---- Expose for external use ---- */
  window.OrochiPricing = { serviceData, fmt, calcDiscount, DISCOUNT_RATE, FORFAIT_SESSIONS };

})();
