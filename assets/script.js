/* Tu archivo assets/script.js completo y modificado */

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
    if (!slides.length || !dots.length) return; 
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
          let targetId = this.getAttribute('href');
          if (targetId.startsWith('/#')) {
            targetId = targetId.substring(1); 
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

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (applicationModal) {
    applicationModal.addEventListener('click', (event) => {
      if (event.target === applicationModal) closeModal();
    });
    document.querySelectorAll('.event-btn').forEach(btn => {
      btn.addEventListener('click', openModal);
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-label', 'Postularse al evento');
    });
  }

  // ================================
  // Formulario de Contacto - Envío de Mensajes
  // ================================
  const sendBtn = document.getElementById('sendBtn');
  const contactSuccessMessage = document.getElementById('contact-success-message');

  if (sendBtn) {
    sendBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const messageInput = document.getElementById('message-input');
      const nombreInput = document.getElementById('nombre-input');
      
      // Validación básica
      if (!messageInput.value.trim() || !nombreInput.value.trim()) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }
      
      // Ocultar mensaje de éxito anterior si existe
      if (contactSuccessMessage) {
        contactSuccessMessage.style.display = 'none';
      }
      
      // Mostrar estado de carga en el botón
      const originalText = sendBtn.textContent;
      sendBtn.textContent = 'Enviando...';
      sendBtn.disabled = true;
      
      // Datos a enviar
      const formData = {
        mensaje: messageInput.value.trim(),
        nombre: nombreInput.value.trim(),
        fecha: new Date().toISOString()
      };
      
      try {
        // URL de tu API - reemplaza con la URL real de tu API
        const apiUrl = 'https://tu-api.com/endpoint-mensajes';
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          // Éxito
          if (contactSuccessMessage) {
            contactSuccessMessage.style.display = 'block';
          } else {
            alert('¡Mensaje enviado con éxito!');
          }
          
          // Limpiar el formulario
          messageInput.value = '';
          nombreInput.value = '';
          
          // Opcional: Recargar los mensajes después de enviar uno nuevo
          cargarMensajes();
        } else {
          throw new Error('Error en la respuesta del servidor');
        }
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      } finally {
        // Restaurar el botón a su estado original
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
      }
    });
  }

  // ================================
  // Lightbox de galería (gallery.html)
  // ================================
  // ... (Tu código de lightbox está perfecto y no se toca) ...
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
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbInner = document.getElementById('lightboxInner');
  const btnPrev = document.getElementById('lbPrev');
  const btnNext = document.getElementById('lbNext');
  const btnClose = document.getElementById('lbClose');
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
    const el = images[idx];
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
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.photos img');
    if (!img) return;
    collectImages();
    if (img) img.style.cursor = 'zoom-in';
    const i = images.indexOf(img);
    if (i >= 0) openAt(i);
  });
  if (btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  if (btnClose) btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeLb(); });
  lb.addEventListener('click', (e) => {
    if (!lbInner.contains(e.target)) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'ArrowRight') next();
  });
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { if (dx > 0) prev(); else next(); }
    touchStartX = null;
  }, { passive: true });
  
  
  // ================================
  // Cargar Mensajes (Felicitaciones)
  // ================================
  // Se llama a la función.
  cargarMensajes();
  
}); // <-- FIN DEL document.addEventListener('DOMContentLoaded')


// ======================================================
// Función para cargar mensajes desde la API
// (Esta función está fuera de DOMContentLoaded)
// ======================================================
async function cargarMensajes() {
    
    // 1. Selecciona el contenedor. Solo busca ".Mensajes-grid"
    const contenedor = document.querySelector('.Mensajes-grid');

    // 2. Si no encuentra ".Mensajes-grid" en la página, 
    // no hace nada y termina. (Esto es lo que lo hace seguro)
    if (!contenedor) {
        return;
    }

    // 3. Si lo encuentra, procede a cargar...
    const urlDeLaApi = 'https://script.google.com/macros/s/AKfycbx_DzVqhTd2KndZY6YZ040P06Jf2j9xaFpCWMQw1Ay3CB8K2Na5ySCXNzDLGKiN8Q/exec';
    
    contenedor.innerHTML = '<p>Cargando felicitaciones...</p>';

    try {
        const respuesta = await fetch(urlDeLaApi);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        
        const data = await respuesta.json();
        const mensajes = data.mensajes
        console.log(mensajes)

        if (mensajes.length === 0) {
            contenedor.innerHTML = '<p>Aún no hay felicitaciones para mostrar.</p>';
            return;
        }

        contenedor.innerHTML = ''; // Limpia el "cargando"

        mensajes.forEach(mensaje => {
            const tarjeta = document.createElement('div');
            
            // 4. Usa la clase ".Mensaje-card" (No toca a .testimonial-card)
            tarjeta.className = 'Mensaje-card'; 

            tarjeta.innerHTML = `
                <p class="Mensaje-quote">
                    "${mensaje[0]}"
                </p>
                <div class="Mensaje-author">
                    <div class="author-name">${mensaje[1]}</div>
                </div>
            `;
            
            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error('Falló la carga de mensajes:', error);
        contenedor.innerHTML = '<p>No se pudieron cargar las felicitaciones. Por favor, intente más tarde.</p>';
    }
}
