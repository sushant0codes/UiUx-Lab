/* main.js - Shared JS for the site
   Implements:
   - packages array + render table (loops + functions)
   - final price calculation (season multiplier + weekend surcharge)
   - booking estimator with nights calculation, guests multiplier, promo codes
   - live form validation enabling/disabling submit
   - gallery rendering from data attributes + modal behavior
   - style updates via JS (nav active, gallery layout toggle)
   - demonstration of reading/modifying data-* attributes and element attributes
*/

/* -------------------------
   Data: packages & gallery
   ------------------------- */
const packages = [
  { id: 'P001', destination: 'Goa', durationDays: 5, basePrice: 4000, season: 'peak' },
  { id: 'P002', destination: 'Manali', durationDays: 6, basePrice: 3500, season: 'shoulder' },
  { id: 'P003', destination: 'Jaipur & Udaipur', durationDays: 7, basePrice: 3000, season: 'off' },
  { id: 'P004', destination: 'Andaman', durationDays: 6, basePrice: 6000, season: 'peak' },
  { id: 'P005', destination: 'Kerala', durationDays: 5, basePrice: 3200, season: 'shoulder' }
];

const galleryItems = [
  { thumb: 'https://via.placeholder.com/400x300?text=Goa', large: 'https://via.placeholder.com/1200x800?text=Goa+Large', caption: 'Beaches of Goa' },
  { thumb: 'https://via.placeholder.com/400x500?text=Manali', large: 'https://via.placeholder.com/1200x1600?text=Manali+Large', caption: 'Himalayan Views - Manali' },
  { thumb: 'https://via.placeholder.com/400x300?text=Jaipur', large: 'https://via.placeholder.com/1200x800?text=Jaipur+Large', caption: 'Rajasthan Palaces' },
  { thumb: 'https://via.placeholder.com/400x300?text=Andaman', large: 'https://via.placeholder.com/1200x800?text=Andaman+Large', caption: 'Andaman Islands' },
  { thumb: 'https://via.placeholder.com/400x350?text=Kerala', large: 'https://via.placeholder.com/1200x1050?text=Kerala+Large', caption: 'Backwaters of Kerala' }
];

/* -------------------------
   Utilities
   ------------------------- */
function formatINR(n) {
  return n.toLocaleString('en-IN');
}

/* -------------------------
   Pricing logic
   ------------------------- */
function seasonMultiplierFor(season) {
  // Demonstrate switch control flow
  switch (season) {
    case 'peak': return 1.25;
    case 'shoulder': return 1.05;
    case 'off': return 0.90;
    default: return 1.0;
  }
}

function weekendSurchargeFor(durationDays) {
  // heuristic: longer trips more likely include weekend
  return durationDays >= 5 ? 0.10 : 0.0;
}

function computeFinalPrice(pkg) {
  // basePrice is per-night
  const baseTotal = pkg.basePrice * pkg.durationDays;
  const seasonMult = seasonMultiplierFor(pkg.season);
  const weekendSurchargeRate = weekendSurchargeFor(pkg.durationDays);

  let priceAfterSeason = baseTotal * seasonMult;
  priceAfterSeason += priceAfterSeason * weekendSurchargeRate;

  return Math.round(priceAfterSeason);
}

/* -------------------------
   Render packages table
   ------------------------- */
function renderPackagesTable() {
  const tableBody = document.querySelector('#packagesTable tbody');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  for (const pkg of packages) {
    const tr = document.createElement('tr');

    const finalPrice = computeFinalPrice(pkg);

    // use template literal to create row
    tr.innerHTML = `
      <td>${pkg.id}</td>
      <td>${pkg.destination}</td>
      <td>${pkg.durationDays}</td>
      <td>₹${formatINR(pkg.basePrice)}</td>
      <td>${pkg.season}</td>
      <td>₹${formatINR(finalPrice)}</td>
    `;
    tableBody.appendChild(tr);
  }
}

/* -------------------------
   Booking: populate select & estimator
   ------------------------- */
function populatePackageSelect() {
  const select = document.getElementById('pkgSelect');
  if (!select) return;
  select.innerHTML = '';

  for (const pkg of packages) {
    const opt = document.createElement('option');
    opt.value = pkg.id;
    opt.textContent = `${pkg.destination} — ${pkg.durationDays}d (₹${formatINR(pkg.basePrice)}/night)`;
    // data attributes for later use
    opt.setAttribute('data-baseprice', pkg.basePrice);
    opt.setAttribute('data-duration', pkg.durationDays);
    opt.setAttribute('data-season', pkg.season);

    // demonstrate reading an attribute (not necessary but shows capability)
    const existing = opt.getAttribute('data-duration');
    if (existing) {
      // modify an attribute as a demonstration (e.g., add a data-note)
      opt.setAttribute('data-note', `Duration: ${existing} days`);
    }

    select.appendChild(opt);
  }
}

function nightsBetween(checkInStr, checkOutStr) {
  if (!checkInStr || !checkOutStr) return 0;
  const inDate = new Date(checkInStr);
  const outDate = new Date(checkOutStr);
  if (isNaN(inDate) || isNaN(outDate)) return 0;
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.floor((outDate - inDate) / msPerDay);
  return diff > 0 ? diff : 0;
}

function applyPromo(total, code) {
  if (!code) return total;
  switch ((code || '').trim().toUpperCase()) {
    case 'EARLYBIRD': return Math.round(total * 0.90); // -10%
    case 'SUMMER': return Math.round(total * 0.95); // -5%
    default: return total;
  }
}

function estimateBooking() {
  const nightsSpan = document.getElementById('nightsSpan');
  const subtotalSpan = document.getElementById('subtotalSpan');
  const totalSpan = document.getElementById('totalSpan');
  const submitBtn = document.getElementById('submitBtn');
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');

  const pkgSelect = document.getElementById('pkgSelect');
  const checkInVal = document.getElementById('checkIn').value;
  const checkOutVal = document.getElementById('checkOut').value;
  const guests = parseInt(document.getElementById('guests').value || '1', 10);
  const promo = document.getElementById('promo').value || '';

  const nights = nightsBetween(checkInVal, checkOutVal);
  if (nightsSpan) nightsSpan.textContent = nights;

  const selectedOpt = pkgSelect && pkgSelect.options[pkgSelect.selectedIndex];
  if (!selectedOpt) return;

  const basePrice = Number(selectedOpt.getAttribute('data-baseprice')) || 0;
  const durationDays = Number(selectedOpt.getAttribute('data-duration')) || 1;
  const season = selectedOpt.getAttribute('data-season') || 'off';

  const effectiveNights = nights > 0 ? nights : durationDays;

  let subtotal = basePrice * effectiveNights;
  const seasonMultiplier = seasonMultiplierFor(season);
  subtotal = subtotal * seasonMultiplier;

  // guests multiplier: +20% if guests > 2
  if (guests > 2) subtotal = subtotal * 1.2;

  // weekend surcharge: check dates for any Sat/Sun in range
  let weekendSurcharge = 0;
  if (nights > 0) {
    let foundWeekend = false;
    for (let i = 0; i < nights; i++) {
      const d = new Date(checkInVal);
      d.setDate(d.getDate() + i);
      const day = d.getDay();
      if (day === 0 || day === 6) { foundWeekend = true; break; }
    }
    if (foundWeekend) weekendSurcharge = 0.10;
  }
  subtotal = subtotal + (subtotal * weekendSurcharge);

  const totalAfterPromo = applyPromo(Math.round(subtotal), promo);

  if (subtotalSpan) subtotalSpan.textContent = formatINR(Math.round(subtotal));
  if (totalSpan) totalSpan.textContent = formatINR(totalAfterPromo);

  // Basic live validation to allow submit
  const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const nameValid = fullName && fullName.value.trim() !== '';
  const datesValid = nights > 0 || nights === 0; // ensure date format present (further validation could be added)

  if (submitBtn) submitBtn.disabled = !(nameValid && emailValid && datesValid && pkgSelect.value);
}

/* -------------------------
   Gallery render + modal + toggles
   ------------------------- */
function renderGallery() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  // loop to create thumbnails with data-* attributes
  for (let i = 0; i < galleryItems.length; i++) {
    const it = galleryItems[i];
    const fig = document.createElement('figure');
    fig.className = 'thumb';

    const img = document.createElement('img');
    img.src = it.thumb;
    img.alt = it.caption;
    img.setAttribute('data-large', it.large);
    img.setAttribute('data-caption', it.caption);
    img.setAttribute('data-index', i);

    // set title from caption (modify attribute via JS)
    img.title = `${it.caption} — click to enlarge`;
    // also set an ARIA label
    img.setAttribute('aria-label', it.caption);

    fig.appendChild(img);
    gallery.appendChild(fig);
  }
}

function setupGalleryModal() {
  const gallery = document.getElementById('gallery');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');

  if (!gallery || !modal) return;

  gallery.addEventListener('click', (ev) => {
    const target = ev.target.closest('img');
    if (!target) return;

    const largeSrc = target.getAttribute('data-large');
    const caption = target.getAttribute('data-caption') || '';

    // Set modal contents and attributes
    modalImg.src = largeSrc;
    modalImg.alt = caption;
    modalCaption.textContent = caption;

    // style update via JS example
    modalImg.style.border = '6px solid #fff';
    modalImg.style.borderRadius = '6px';

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // ensure modal visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  modalClose && modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
  });

  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      modalImg.src = '';
    }
  });
}

function setupGalleryToggle() {
  const btn = document.getElementById('toggleLayoutBtn');
  const gallery = document.getElementById('gallery');
  if (!btn || !gallery) return;

  btn.addEventListener('click', () => {
    if (gallery.classList.contains('grid')) {
      gallery.classList.remove('grid');
      gallery.classList.add('masonry');
      btn.textContent = 'Switch to Grid';
    } else {
      gallery.classList.remove('masonry');
      gallery.classList.add('grid');
      btn.textContent = 'Switch to Masonry';
    }
  });
}

/* -------------------------
   Nav highlight based on current page
   ------------------------- */
function highlightActiveNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const links = nav.querySelectorAll('a');
  const path = location.pathname.split('/').pop() || 'index.html';

  links.forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    // mark active if href equals current file
    if (href === path || (href === 'index.html' && path === '')) {
      a.classList.add('active');
    }
  });

  // scroll behavior: when a nav link is clicked, add active and scroll top smoothly
  nav.addEventListener('click', (ev) => {
    const a = ev.target.closest('a');
    if (!a) return;
    links.forEach(l => l.classList.remove('active'));
    a.classList.add('active');


    if (a.getAttribute('href') === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  
  highlightActiveNav();


  renderPackagesTable();

  populatePackageSelect();
  estimateBooking();

  const inputsToWatch = ['pkgSelect', 'checkIn', 'checkOut', 'guests', 'promo', 'fullName', 'email'];
  inputsToWatch.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', estimateBooking);
    el.addEventListener('change', estimateBooking);
  });

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      alert('Booking confirmed! (Demo — no server submission)');
      bookingForm.reset();
      estimateBooking();
    });
  }

  // Gallery
  renderGallery();
  setupGalleryModal();
  setupGalleryToggle();
});
