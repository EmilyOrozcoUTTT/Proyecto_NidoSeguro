/* =========================================================
   NIDO SEGURO — Interacciones del sitio
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Menú móvil ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('main-nav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra el menú móvil al elegir un enlace
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 2. Header con sombra al hacer scroll ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* ---------- 3. Acordeón de preguntas frecuentes ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const alreadyOpen = item.classList.contains('open');

      // Cierra los demás (acordeón de uno a la vez)
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !alreadyOpen);
      question.setAttribute('aria-expanded', String(!alreadyOpen));
    });
  });

  /* ---------- 4. Juegos: abrir video(s) de YouTube ---------- */
  const modal = document.getElementById('gameModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalLinks = document.getElementById('modalLinks');
  const modalClose = document.getElementById('modalClose');

  function openModal(title, videos) {
    modalTitle.textContent = title;
    modalLinks.innerHTML = '';
    videos.forEach(video => {
      const a = document.createElement('a');
      a.href = video.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'btn btn-primary';
      a.textContent = `▶ ${video.label}`;
      modalLinks.appendChild(a);
    });
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.game-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const videos = JSON.parse(btn.dataset.videos || '[]');
      if (videos.length === 0) return;

      if (videos.length === 1) {
        // Un solo video: abre directo en pestaña nueva
        window.open(videos[0].url, '_blank', 'noopener,noreferrer');
      } else {
        // Varios videos: muestra opciones en una ventana modal
        const gameCard = btn.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        openModal(gameName, videos);
      }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ---------- 5. Validación del formulario de contacto ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setError(fieldId, message) {
    const row = document.getElementById(fieldId).closest('.form-row');
    const errorSpan = document.getElementById('err-' + fieldId);
    if (message) {
      row.classList.add('has-error');
      errorSpan.textContent = message;
    } else {
      row.classList.remove('has-error');
      errorSpan.textContent = '';
    }
  }

  function validateForm() {
    let valid = true;

    const nombre = document.getElementById('nombre').value.trim();
    if (nombre.length < 2) {
      setError('nombre', 'Escribe tu nombre completo.');
      valid = false;
    } else {
      setError('nombre', '');
    }

    const correo = document.getElementById('correo').value.trim();
    const correoPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoPattern.test(correo)) {
      setError('correo', 'Escribe un correo electrónico válido.');
      valid = false;
    } else {
      setError('correo', '');
    }

    const telefono = document.getElementById('telefono').value.trim();
    if (telefono && !/^\d{10}$/.test(telefono)) {
      setError('telefono', 'Si lo incluyes, debe tener 10 dígitos.');
      valid = false;
    } else {
      setError('telefono', '');
    }

    const parentesco = document.getElementById('parentesco').value;
    if (!parentesco) {
      setError('parentesco', 'Selecciona una opción.');
      valid = false;
    } else {
      setError('parentesco', '');
    }

    const edad = document.getElementById('edad').value;
    if (!edad || edad < 3 || edad > 17) {
      setError('edad', 'Ingresa una edad entre 3 y 17 años.');
      valid = false;
    } else {
      setError('edad', '');
    }

    const consentimiento = document.getElementById('consentimiento').checked;
    if (!consentimiento) {
      setError('consentimiento', 'Necesitamos tu autorización para continuar.');
      valid = false;
    } else {
      setError('consentimiento', '');
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Revisa los campos marcados en rojo antes de enviar.';
      return;
    }

    // NOTA IMPORTANTE:
    // Este formulario todavía no está conectado a un servidor real,
    // por lo que no enviamos ni guardamos información en automático.
    // Mostramos un mensaje honesto en vez de simular un envío exitoso.
    formStatus.className = 'form-status success';
    formStatus.innerHTML =
      '¡Gracias! Por ahora esta es una versión de demostración del proyecto, ' +
      'así que tu información <strong>todavía no se envía a ningún servidor</strong>. ' +
      'Cuando publiquemos la versión final de Nido Seguro, este formulario enviará tus ' +
      'datos de forma segura a nuestro equipo de orientación.';
    form.reset();
  });

  /* ---------- 6. Animación de aparición al hacer scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.info-card, .game-card, .value-card, .faq-item, .section-title, .section-lead'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

});
