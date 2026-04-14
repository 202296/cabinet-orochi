/* =============================================
   CABINET OROCHI — SCHOOL FORM JS
   Validates 50+ students rule, calculates commission
   ============================================= */

(function () {
  'use strict';

  const form = document.getElementById('school-form');
  if (!form) return;

  const studentsInput = document.getElementById('school-students');
  const locationSelect = document.getElementById('school-location');
  const serviceSelect = document.getElementById('school-service');
  const summaryBox = document.getElementById('school-summary');
  const studentsError = document.getElementById('students-error');
  const formersNote = document.getElementById('formateurs-note');

  /* ---- Commission rates ---- */
  const COMMISSION_RATE = 0.15; // 15%
  const MIN_STUDENTS = 50;
  const CLASS_SPLIT_THRESHOLD = 60;
  const CLASS_SPLIT_SIZE = 40;

  /* ---- Pricing data ---- */
  const pricingData = {
    cabinet: {
      depistage: { inscription: 5000, seance: null, nbSeances: 1, label: 'Dépistage des lacunes' },
      conference: { inscription: 2000, seance: null, nbSeances: 1, label: 'Conscientisation (conférence)' },
      techniques: { inscription: 5000, seance: null, nbSeances: 2, label: 'Techniques d\'étude' },
      remediation: { inscription: 10000, seance: 2500, nbSeances: null, label: 'Correction des lacunes (Lecture / Dictée / Maths)' }
    },
    hors: {
      depistage: { inscription: 5000, seance: null, nbSeances: 1, label: 'Dépistage des lacunes' },
      conference: { inscription: 3000, seance: null, nbSeances: 1, label: 'Conscientisation (conférence)' },
      techniques: { inscription: 10000, seance: null, nbSeances: 2, label: 'Techniques d\'étude' },
      remediation: { inscription: 10000, seance: 2500, nbSeances: null, label: 'Correction des lacunes (Lecture / Dictée / Maths)' }
    }
  };

  function formatCFA(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  }

  function getNbClasses(students) {
    if (students <= 0) return 0;
    if (students <= CLASS_SPLIT_THRESHOLD) return 1;
    return Math.ceil(students / CLASS_SPLIT_SIZE);
  }

  function getNbFormateurs(students) {
    return students > CLASS_SPLIT_THRESHOLD ? 2 : 1;
  }

  function updateStudentsInfo() {
    const students = parseInt(studentsInput.value, 10);

    // Clear previous state
    studentsInput.classList.remove('is-invalid', 'is-valid');
    if (studentsError) studentsError.textContent = '';
    if (formersNote) formersNote.style.display = 'none';

    if (!students || isNaN(students)) return;

    if (students < MIN_STUDENTS) {
      studentsInput.classList.add('is-invalid');
      if (studentsError) {
        studentsError.textContent = `⚠ Minimum requis : ${MIN_STUDENTS} élèves par classe. Vous avez saisi ${students}.`;
      }
    } else {
      studentsInput.classList.add('is-valid');
      if (students > CLASS_SPLIT_THRESHOLD && formersNote) {
        const nbClasses = getNbClasses(students);
        formersNote.innerHTML = `
          <strong>⚠ Règle 60+ élèves appliquée :</strong> Avec ${students} élèves,
          <strong>2 formateurs</strong> sont requis.
          ${nbClasses} classe(s) de ${CLASS_SPLIT_SIZE} apprenants seront constituées.
        `;
        formersNote.style.display = 'block';
      }
    }

    updateSummary();
  }

  function updateSummary() {
    const students = parseInt(studentsInput.value, 10);
    const location = locationSelect ? locationSelect.value : 'cabinet';
    const service = serviceSelect ? serviceSelect.value : '';

    if (!summaryBox) return;

    if (!students || isNaN(students) || students < MIN_STUDENTS || !service || service === '') {
      summaryBox.style.display = 'none';
      return;
    }

    const locKey = location === 'hors' ? 'hors' : 'cabinet';
    const pricing = pricingData[locKey][service];
    if (!pricing) {
      summaryBox.style.display = 'none';
      return;
    }

    const nbClasses = getNbClasses(students);
    const nbFormateurs = getNbFormateurs(students);

    // Calculate totals
    const totalInscription = pricing.inscription * students;
    let startupCost = 0;
    let perSeanceCost = 0;

    if (pricing.seance) {
      // Remediation: 4 séances upfront required
      startupCost = (pricing.inscription + pricing.seance * 4) * students;
      perSeanceCost = pricing.seance * students;
    } else {
      startupCost = totalInscription;
    }

    const commission = startupCost * COMMISSION_RATE;

    summaryBox.innerHTML = `
      <h4 style="color:var(--primary);margin-bottom:16px;">📊 Récapitulatif estimatif</h4>
      <div class="summary-grid">
        <div class="summary-row">
          <span>Service</span>
          <strong>${pricing.label}</strong>
        </div>
        <div class="summary-row">
          <span>Nombre d'élèves</span>
          <strong>${students}</strong>
        </div>
        <div class="summary-row">
          <span>Nombre de classes</span>
          <strong>${nbClasses} classe(s)</strong>
        </div>
        <div class="summary-row">
          <span>Formateurs requis</span>
          <strong>${nbFormateurs} formateur(s)</strong>
        </div>
        <div class="summary-row">
          <span>Inscription / élève</span>
          <strong>${formatCFA(pricing.inscription)}</strong>
        </div>
        ${pricing.seance ? `
        <div class="summary-row">
          <span>Coût par séance / élève</span>
          <strong>${formatCFA(pricing.seance)}</strong>
        </div>
        <div class="summary-row">
          <span>Démarrage (inscription + 4 séances)</span>
          <strong>${formatCFA(pricing.inscription + pricing.seance * 4)} / élève</strong>
        </div>` : ''}
        <div class="summary-row highlight">
          <span>Coût total au démarrage</span>
          <strong>${formatCFA(startupCost)}</strong>
        </div>
        <div class="summary-row commission">
          <span>Commission école (15%)</span>
          <strong class="text-success">${formatCFA(commission)}</strong>
        </div>
      </div>
      <p style="font-size:0.78rem;color:var(--gray);margin-top:12px;">
        * Estimation indicative. Les tarifs réels sont confirmés lors du devis officiel.
      </p>
    `;
    summaryBox.style.display = 'block';
  }

  // Event listeners
  if (studentsInput) {
    studentsInput.addEventListener('input', updateStudentsInfo);
    studentsInput.addEventListener('change', updateStudentsInfo);
  }
  if (locationSelect) locationSelect.addEventListener('change', updateSummary);
  if (serviceSelect) serviceSelect.addEventListener('change', updateSummary);

  /* ---- Form submission ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const students = parseInt(studentsInput ? studentsInput.value : '0', 10);

    if (students < MIN_STUDENTS) {
      if (studentsError) {
        studentsError.textContent = `⚠ Impossible de soumettre : minimum ${MIN_STUDENTS} élèves requis.`;
      }
      studentsInput.focus();
      return;
    }

    // Basic required field validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('is-invalid');
      }
    });

    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    setTimeout(() => {
      form.reset();
      if (summaryBox) summaryBox.style.display = 'none';
      if (formersNote) formersNote.style.display = 'none';
      btn.disabled = false;
      btn.textContent = origText;
      const alert = form.querySelector('.alert');
      if (alert) {
        alert.className = 'alert alert-success show';
        alert.textContent = '✓ Votre demande de devis a été envoyée ! Le Cabinet Orochi vous contactera sous 48h.';
      }
    }, 1400);
  });

})();
