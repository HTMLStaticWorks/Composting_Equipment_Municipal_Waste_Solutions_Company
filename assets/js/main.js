document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initCart();
  initMobileMenu();
  initEstimator();
});

// Theme System (Light/Dark)
function initTheme() {
  const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  const body = document.body;
  const icons = document.querySelectorAll('#theme-icon, #theme-icon-mobile');
  
  let currentTheme = localStorage.getItem('theme') || 'light';
  applyTheme(currentTheme);
  
  themeToggles.forEach(toggle => {
    if (toggle) {
      toggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
      });
    }
  });
  
  function applyTheme(theme) {
    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      icons.forEach(icon => { if (icon) icon.innerHTML = '<i data-lucide="sun"></i>'; });
    } else {
      body.removeAttribute('data-theme');
      icons.forEach(icon => { if (icon) icon.innerHTML = '<i data-lucide="moon"></i>'; });
    }
    // Re-render lucide icons if using lucide library
    if(typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          'stroke-width': 1.5
        }
      });
    }
  }
}

// RTL/LTR System
function initRTL() {
  const dirToggles = document.querySelectorAll('#dir-toggle, #dir-toggle-mobile');
  const html = document.documentElement;
  
  let currentDir = localStorage.getItem('dir') || 'ltr';
  applyDir(currentDir);
  
  dirToggles.forEach(toggle => {
    if (toggle) {
      toggle.addEventListener('click', () => {
        currentDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
        applyDir(currentDir);
        localStorage.setItem('dir', currentDir);
      });
    }
  });
  
  function applyDir(dir) {
    html.setAttribute('dir', dir);
    const bsLink = document.querySelector('link[href*="bootstrap"]');
    if (bsLink) {
      if (dir === 'rtl') {
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
      } else {
        bsLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      }
    }
  }
}

// Cart System (Dummy Implementation)
function initCart() {
  const cartBadges = document.querySelectorAll('.cart-badge');
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartBadge();
  
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Dummy product
      const product = { id: Date.now(), name: "Material", price: 99 };
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      showToast('Product added to cart!');
    });
  });
  
  function updateCartBadge() {
    cartBadges.forEach(badge => {
      badge.textContent = cart.length;
    });
  }
}

// Mobile Menu Offcanvas
function initMobileMenu() {
  // Assuming Bootstrap's offcanvas handles the bulk, 
  // we just need to ensure links close the menu
  const offcanvasLinks = document.querySelectorAll('.offcanvas .nav-link:not([data-bs-toggle="collapse"])');
  offcanvasLinks.forEach(link => {
    link.addEventListener('click', () => {
      const offcanvasEl = document.getElementById('mobileMenu');
      if(offcanvasEl && typeof bootstrap !== 'undefined') {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if(bsOffcanvas) bsOffcanvas.hide();
      }
    });
  });
}

// Project Quantity Estimator
function initEstimator() {
  const estForm = document.getElementById('estimator-form');
  if(!estForm) return;
  
  const areaInput = document.getElementById('est-area');
  const depthInput = document.getElementById('est-depth');
  const resultDiv = document.getElementById('est-result');
  
  if(areaInput && depthInput && resultDiv) {
    const calculate = () => {
      const area = parseFloat(areaInput.value) || 0;
      const depth = parseFloat(depthInput.value) || 0;
      const vol = area * depth;
      
      if(vol > 0) {
        resultDiv.innerHTML = `
          <div class="alert alert-success mt-3">
            <strong>Estimated Volume:</strong> ${vol.toFixed(2)} cubic units
            <br>
            <small>Suggested purchase includes 5% waste allowance: ${(vol * 1.05).toFixed(2)} cubic units.</small>
          </div>
        `;
      } else {
        resultDiv.innerHTML = '';
      }
    };
    
    areaInput.addEventListener('input', calculate);
    depthInput.addEventListener('input', calculate);
  }
}

// Toast Notification Utility
function showToast(message) {
  // Simple toast implementation
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast show align-items-center text-bg-success border-0 mb-2';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  container.style.zIndex = '1055';
  document.body.appendChild(container);
  return container;
}

// Quick Filter Pills Interactive System
document.addEventListener('DOMContentLoaded', () => {
  const pillBtns = document.querySelectorAll('.filter-pill-btn');
  if (pillBtns.length > 0) {
    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pillBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter');
        filterProductCards(filterVal);
      });
    });
  }
});

function filterProductCards(category) {
  const cards = document.querySelectorAll('.col-md-6.col-xl-4, .product-card-item');
  if (!cards.length) return;
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (category === 'all') {
      card.style.display = '';
    } else if (category === 'municipal' && text.includes('municipal')) {
      card.style.display = '';
    } else if (category === 'commercial' && text.includes('commercial')) {
      card.style.display = '';
    } else if (category === 'residential' && (text.includes('residential') || text.includes('countertop') || text.includes('apartment'))) {
      card.style.display = '';
    } else if (category === 'biodrum' && text.includes('bio-drum')) {
      card.style.display = '';
    } else if (category === 'invessel' && text.includes('in-vessel')) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
