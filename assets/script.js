document.addEventListener('DOMContentLoaded', function() {
  // ================================
  // Mobile Menu Toggle
  // ================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuToggle && mobileMenu){
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
    // cerrar al clickear cualquier link
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileMenu.classList.remove('active'))
    );
  }

  // ================================
  // Hero Slider
  // ================================
  let currentSlide = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');

  function showSlide(index) {
    if (!slides.length || !dots.length) return; // Evita errores si no hay slider
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  if (slides.length > 0) {
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'));
        showSlide(slideIndex);
      });
    });

    // Auto slide change
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  // ================================
  // Smooth scrolling for anchor links
  // ================================
  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          // Manejar enlaces que empiezan con /#
          let targetId = this.getAttribute('href');
          if (targetId.startsWith('/#')) {
              targetId = targetId.substring(1); // Remover la barra inicial
          }
          
          if (!targetId || targetId === '#') return;
  
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              e.preventDefault();
              window.scrollTo({
                  top: targetElement.offsetTop - 80,
                  behavior: 'smooth'
              });
              if (mobileMenu) mobileMenu.classList.remove('active');
          }
      });
  });

  // ================================
  // Modal de Postulación (abrir/cerrar)
  // ================================
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const applicationModal = document.getElementById('applicationModal');

  function openModal(e) {
    if (e) e.preventDefault();
    if (applicationModal) {
      applicationModal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  }

  function closeModal() {
    if (applicationModal) {
      applicationModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  }

  // Botón principal "Postularme"
  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (applicationModal) {
    // Cerrar el modal si se hace clic fuera del contenido
    applicationModal.addEventListener('click', (event) => {
      if (event.target === applicationModal) closeModal();
    });

    // Abrir modal desde los botones de tarjetas (".event-btn")
    document.querySelectorAll('.event-btn').forEach(btn => {
      btn.addEventListener('click', openModal);
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-label', 'Postularse al evento');
    });
  }

  // ================================
  // Lightbox de galería (gallery.html)
  // -> Delegación global para funcionar aunque .photos se cree tras el fetch
  // ================================
  // Crear lightbox (una sola vez)
  (function ensureLightbox() {
    if (document.getElementById('lightbox')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="lightbox" id="lightbox" aria-hidden="true" role="dialog">
        <div class="lightbox-inner" id="lightboxInner">
          <button class="lightbox-btn lb-prev" id="lbPrev" aria-label="Foto anterior">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          <img class="lightbox-img" id="lbImg" alt="Foto ampliada">
          <button class="lightbox-btn lb-next" id="lbNext" aria-label="Foto siguiente">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
          <button class="lb-close" id="lbClose" aria-label="Cerrar">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>`;
    document.body.appendChild(wrapper.firstElementChild);
  })();

  // Refs del lightbox
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbInner = document.getElementById('lightboxInner');
  const btnPrev = document.getElementById('lbPrev');
  const btnNext = document.getElementById('lbNext');
  const btnClose= document.getElementById('lbClose');

  let images = [];
  let idx = 0;
  let touchStartX = null;

  function collectImages() {
    images = Array.from(document.querySelectorAll('.photos img'));
  }

  function openAt(i) {
    if (!images.length) collectImages();
    if (!images.length) return;

    idx = (i + images.length) % images.length;
    const el  = images[idx];
    const src = el.getAttribute('src');
    const alt = el.getAttribute('alt') || '';

    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeLb() {
    lb.classList.remove('active');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lbImg.removeAttribute('src'); // liberar memoria
  }

  function prev() { openAt(idx - 1); }
  function next() { openAt(idx + 1); }

  // Delegación global: abrir al click en cualquier .photos img (aunque se agregue luego)
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.photos img');
    if (!img) return;
    collectImages();
    if (img) img.style.cursor = 'zoom-in';
    const i = images.indexOf(img);
    if (i >= 0) openAt(i);
  });

  // Controles del lightbox
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  if (btnClose) btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLb(); });

  // Cerrar clickeando fuera de la imagen
  lb.addEventListener('click', (e) => {
    if (!lbInner.contains(e.target)) closeLb();
  });

  // Teclado: ESC / flechas
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')        closeLb();
    else if (e.key === 'ArrowLeft')  prev();
    else if (e.key === 'ArrowRight') next();
  });

  // Swipe en móvil
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { if (dx > 0) prev(); else next(); }
    touchStartX = null;
  }, { passive: true });
});
