// ═══════════════════════════════════════
//   OPENING ANIMATION
// ═══════════════════════════════════════
window.addEventListener('load', () => {
  setTimeout(() => {
    skipIntro();
  }, 4000); // auto skip after 4 seconds
});

function skipIntro() {
  const intro = document.getElementById('intro');
  const main = document.getElementById('main');
  intro.style.opacity = '0';
  intro.style.transition = 'opacity 1s ease';
  setTimeout(() => {
    intro.classList.add('hidden');
    main.classList.remove('hidden');
    main.style.opacity = '0';
    main.style.transition = 'opacity 1s ease';
    setTimeout(() => {
      main.style.opacity = '1';
    }, 100);
  }, 1000);
}

// ═══════════════════════════════════════
//   NAVBAR MOBILE MENU
// ═══════════════════════════════════════
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  links.classList.toggle('open');
}

// ═══════════════════════════════════════
//   LANGUAGE SWITCHER
// ═══════════════════════════════════════
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    if (el.dataset[lang]) {
      el.textContent = el.dataset[lang];
    }
  });

  // Highlight active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.style.background = 'transparent';
    btn.style.color = '#FFD700';
  });
  event.target.style.background = '#FFD700';
  event.target.style.color = '#1a0000';
}

// ═══════════════════════════════════════
//   ANIMATED COUNTERS
// ═══════════════════════════════════════
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let count = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        counter.textContent = target + '+';
        clearInterval(timer);
      } else {
        counter.textContent = count;
      }
    }, 30);
  });
}

// Trigger counter when about section is visible
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// ═══════════════════════════════════════
//   MENU FILTER
// ═══════════════════════════════════════
function filterMenu(category) {
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // Show/hide menu cards
  const cards = document.querySelectorAll('.menu-card');
  cards.forEach(card => {
    const cats = card.dataset.cat || '';
    if (category === 'all' || cats.includes(category)) {
      card.classList.remove('hidden-item');
      card.style.animation = 'fadeInUp 0.4s ease';
    } else {
      card.classList.add('hidden-item');
    }
  });
}

// ═══════════════════════════════════════
//   CALENDAR
// ═══════════════════════════════════════
let bookedDates = [];

async function loadCalendar() {
  try {
    const response = await fetch('/booked-dates');
    bookedDates = await response.json();
  } catch (e) {
    bookedDates = [];
  }
  renderCalendar();
}

function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  // Month title
  const title = document.createElement('div');
  title.style.cssText = 'grid-column: span 7; text-align:center; font-weight:700; color:#8B0000; margin-bottom:8px; font-size:0.95rem;';
  title.textContent = monthNames[month] + ' ' + year;

  calendar.innerHTML = '';
  calendar.appendChild(title);

  // Day headers
  dayNames.forEach(day => {
    const header = document.createElement('div');
    header.className = 'cal-header';
    header.textContent = day;
    calendar.appendChild(header);
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    calendar.appendChild(empty);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

    if (bookedDates.includes(dateStr)) {
      dayEl.classList.add('booked');
      dayEl.title = 'Already booked';
    } else {
      dayEl.classList.add('available');
      dayEl.onclick = () => selectDate(dateStr, d);
    }

    if (d === today) dayEl.classList.add('today');
    dayEl.textContent = d;
    calendar.appendChild(dayEl);
  }
}

function selectDate(dateStr, day) {
  document.getElementById('event_date').value = dateStr;
  // Scroll to booking form
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });

  // Highlight selected day
  document.querySelectorAll('.cal-day').forEach(el => {
    el.style.fontWeight = 'normal';
  });
  event.target.style.background = '#FFD700';
  event.target.style.color = '#1a0000';
  event.target.style.fontWeight = '700';
}

// ═══════════════════════════════════════
//   BOOKING FORM SUBMIT
// ═══════════════════════════════════════
let bookingData = {};

async function submitBooking() {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const event_type = document.getElementById('event_type').value;
  const event_date = document.getElementById('event_date').value;
  const venue = document.getElementById('venue').value.trim();
  const food_type = document.getElementById('food_type').value;
  const guest_count = document.getElementById('guest_count').value;
  const special_requests = document.getElementById('special_requests').value.trim();

  // Validation
  if (!name || !phone || !event_type || !event_date || !food_type || !guest_count) {
    alert('Please fill all required fields!');
    return;
  }

  // Get selected menu items
  const checkboxes = document.querySelectorAll('.menu-checkboxes input:checked');
  const menu_items = Array.from(checkboxes).map(cb => cb.value).join(', ');

  const data = {
    name, phone, email, event_type,
    event_date, venue, food_type,
    guest_count: parseInt(guest_count),
    menu_items, special_requests
  };

  try {
    const response = await fetch('/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      bookingData = { ...data, reference: result.reference };
      document.getElementById('refNumber').textContent = result.reference;
      document.getElementById('bookingForm').classList.add('hidden');
      document.getElementById('confirmation').classList.remove('hidden');
      loadCalendar(); // Refresh calendar
    }
  } catch (e) {
    alert('Booking failed! Please try again or call us directly.');
  }
}

// ═══════════════════════════════════════
//   WHATSAPP MESSAGE
// ═══════════════════════════════════════
function sendWhatsApp() {
  const msg = `Hello SSR Catering Service! 🙏
  
*Booking Details:*
📋 Reference: ${bookingData.reference}
👤 Name: ${bookingData.name}
📞 Phone: ${bookingData.phone}
🎉 Event: ${bookingData.event_type}
📅 Date: ${bookingData.event_date}
📍 Venue: ${bookingData.venue}
🍽️ Food Type: ${bookingData.food_type}
👥 Guests: ${bookingData.guest_count}
🍛 Menu: ${bookingData.menu_items}
📝 Notes: ${bookingData.special_requests}`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/919999999999?text=${encoded}`, '_blank');
}

// ═══════════════════════════════════════
//   NEW BOOKING
// ═══════════════════════════════════════
function newBooking() {
  document.getElementById('bookingForm').classList.remove('hidden');
  document.getElementById('confirmation').classList.add('hidden');
  document.getElementById('bookingForm').reset
  // Clear form
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('email').value = '';
  document.getElementById('event_type').value = '';
  document.getElementById('event_date').value = '';
  document.getElementById('venue').value = '';
  document.getElementById('food_type').value = '';
  document.getElementById('guest_count').value = '';
  document.getElementById('special_requests').value = '';
  document.querySelectorAll('.menu-checkboxes input').forEach(cb => cb.checked = false);
}

// ═══════════════════════════════════════
//   SCROLL ANIMATIONS
// ═══════════════════════════════════════
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// ═══════════════════════════════════════
//   ON PAGE LOAD
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Observe about section for counters
  if (aboutSection) observer.observe(aboutSection);

  // Load calendar
  loadCalendar();

  // Scroll animations for sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    scrollObserver.observe(section);
  });

  // Navbar active link highlight on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '#ffffff';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#FFD700';
      }
    });
  });
});