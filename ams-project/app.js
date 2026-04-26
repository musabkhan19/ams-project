/* ═══════════════════════════════════════════════════════════════
   AMS — AIRLINE MANAGEMENT SYSTEM
   app.js  |  Fetches from Express API, renders all dashboard pages
   ─────────────────────────────────────────────────────────────
   HOW IT WORKS:
   1. On load → fetchAll() calls your Express backend on localhost:3001
   2. If backend is offline → loads fallback (mock) data so UI still works
   3. Each page has its own render function + search/filter logic
═══════════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   CONFIGURATION
   Change API_BASE to your backend URL
────────────────────────────────────────────── */
const API_BASE = 'http://localhost:3001/api';

/* ──────────────────────────────────────────────
   FALLBACK DATA  (used when backend is offline)
   Mirrors exactly what the API would return
────────────────────────────────────────────── */
const MOCK = {
  flights: [
    { flight_id:1,  flight_number:'PK-301', airline_name:'Pakistan Int\'l Airlines', from_iata:'KHI', to_iata:'LHE', departure_time:'2026-05-01T07:00:00', arrival_time:'2026-05-01T09:00:00', status:'On-Time',  tail_number:'AP-BIG' },
    { flight_id:2,  flight_number:'PK-302', airline_name:'Pakistan Int\'l Airlines', from_iata:'KHI', to_iata:'LHE', departure_time:'2026-05-01T14:00:00', arrival_time:'2026-05-01T16:00:00', status:'Delayed',  tail_number:'AP-BLD' },
    { flight_id:3,  flight_number:'EK-601', airline_name:'Emirates',                 from_iata:'KHI', to_iata:'DXB', departure_time:'2026-05-02T03:00:00', arrival_time:'2026-05-02T04:45:00', status:'On-Time',  tail_number:'A6-ENA' },
    { flight_id:4,  flight_number:'PK-781', airline_name:'Pakistan Int\'l Airlines', from_iata:'KHI', to_iata:'LHR', departure_time:'2026-05-02T09:00:00', arrival_time:'2026-05-02T18:00:00', status:'On-Time',  tail_number:'AP-BHO' },
    { flight_id:5,  flight_number:'6E-101', airline_name:'IndiGo',                   from_iata:'ISB', to_iata:'DEL', departure_time:'2026-05-03T06:30:00', arrival_time:'2026-05-03T08:00:00', status:'On-Time',  tail_number:'VT-IGA' },
    { flight_id:6,  flight_number:'EK-209', airline_name:'Emirates',                 from_iata:'DXB', to_iata:'DEL', departure_time:'2026-05-03T15:00:00', arrival_time:'2026-05-03T18:30:00', status:'Cancelled',tail_number:'A6-ENB' },
    { flight_id:7,  flight_number:'G9-401', airline_name:'Air Arabia',               from_iata:'KHI', to_iata:'DXB', departure_time:'2026-05-04T10:00:00', arrival_time:'2026-05-04T11:45:00', status:'On-Time',  tail_number:'A6-ABA' },
    { flight_id:8,  flight_number:'PK-303', airline_name:'Pakistan Int\'l Airlines', from_iata:'KHI', to_iata:'LHE', departure_time:'2026-05-05T08:00:00', arrival_time:'2026-05-05T10:00:00', status:'Landed',   tail_number:'AP-BIG' },
    { flight_id:9,  flight_number:'6E-102', airline_name:'IndiGo',                   from_iata:'ISB', to_iata:'DEL', departure_time:'2026-05-05T13:00:00', arrival_time:'2026-05-05T14:30:00', status:'Delayed',  tail_number:'VT-IGB' },
    { flight_id:10, flight_number:'EK-602', airline_name:'Emirates',                 from_iata:'KHI', to_iata:'DXB', departure_time:'2026-05-06T22:00:00', arrival_time:'2026-05-06T23:45:00', status:'On-Time',  tail_number:'A6-ENA' },
  ],
  bookings: [
    { booking_id:1,  passenger:'Ali Khan',     flight_number:'PK-301', seat_number:'14A', cabin_class:'Economy',  ticket_price:12500, booking_date:'2026-04-10', payment_status:'Paid' },
    { booking_id:2,  passenger:'Sara Ahmed',   flight_number:'PK-301', seat_number:'2B',  cabin_class:'Business', ticket_price:35000, booking_date:'2026-04-11', payment_status:'Paid' },
    { booking_id:3,  passenger:'James Lee',    flight_number:'EK-601', seat_number:'22C', cabin_class:'Economy',  ticket_price:14000, booking_date:'2026-04-12', payment_status:'Paid' },
    { booking_id:4,  passenger:'Priya Sharma', flight_number:'PK-781', seat_number:'3A',  cabin_class:'Business', ticket_price:75000, booking_date:'2026-04-13', payment_status:'Paid' },
    { booking_id:5,  passenger:'Omar Farooq',  flight_number:'PK-302', seat_number:'18D', cabin_class:'Economy',  ticket_price:11000, booking_date:'2026-04-14', payment_status:'Pending' },
    { booking_id:6,  passenger:'Emily Chen',   flight_number:'6E-101', seat_number:'25F', cabin_class:'Economy',  ticket_price:13500, booking_date:'2026-04-15', payment_status:'Paid' },
    { booking_id:7,  passenger:'Hassan Raza',  flight_number:'PK-781', seat_number:'1A',  cabin_class:'Business', ticket_price:42000, booking_date:'2026-04-16', payment_status:'Paid' },
    { booking_id:8,  passenger:'Aisha Malik',  flight_number:'PK-303', seat_number:'30C', cabin_class:'Economy',  ticket_price:9800,  booking_date:'2026-04-17', payment_status:'Paid' },
    { booking_id:9,  passenger:'Ali Khan',     flight_number:'PK-303', seat_number:'16B', cabin_class:'Economy',  ticket_price:11200, booking_date:'2026-04-18', payment_status:'Paid' },
    { booking_id:10, passenger:'David Smith',  flight_number:'6E-101', seat_number:'19A', cabin_class:'Economy',  ticket_price:10500, booking_date:'2026-04-18', payment_status:'Refunded' },
    { booking_id:11, passenger:'Fatima Noor',  flight_number:'PK-781', seat_number:'4B',  cabin_class:'Business', ticket_price:38000, booking_date:'2026-04-19', payment_status:'Paid' },
    { booking_id:12, passenger:'Sara Ahmed',   flight_number:'PK-302', seat_number:'20A', cabin_class:'Economy',  ticket_price:12000, booking_date:'2026-04-19', payment_status:'Paid' },
    { booking_id:13, passenger:'James Lee',    flight_number:'G9-401', seat_number:'11C', cabin_class:'Economy',  ticket_price:9500,  booking_date:'2026-04-20', payment_status:'Pending' },
    { booking_id:14, passenger:'Priya Sharma', flight_number:'EK-602', seat_number:'2A',  cabin_class:'Business', ticket_price:55000, booking_date:'2026-04-20', payment_status:'Paid' },
    { booking_id:15, passenger:'Omar Farooq',  flight_number:'6E-101', seat_number:'28B', cabin_class:'Economy',  ticket_price:13000, booking_date:'2026-04-21', payment_status:'Paid' },
    { booking_id:16, passenger:'Emily Chen',   flight_number:'6E-102', seat_number:'15D', cabin_class:'Economy',  ticket_price:11500, booking_date:'2026-04-21', payment_status:'Paid' },
    { booking_id:17, passenger:'Hassan Raza',  flight_number:'EK-601', seat_number:'1A',  cabin_class:'First',    ticket_price:95000, booking_date:'2026-04-22', payment_status:'Paid' },
    { booking_id:18, passenger:'Aisha Malik',  flight_number:'G9-401', seat_number:'22B', cabin_class:'Economy',  ticket_price:10000, booking_date:'2026-04-22', payment_status:'Pending' },
    { booking_id:19, passenger:'David Smith',  flight_number:'PK-301', seat_number:'17C', cabin_class:'Economy',  ticket_price:12800, booking_date:'2026-04-23', payment_status:'Paid' },
    { booking_id:20, passenger:'Fatima Noor',  flight_number:'EK-602', seat_number:'3B',  cabin_class:'Business', ticket_price:47000, booking_date:'2026-04-23', payment_status:'Paid' },
  ],
  passengers: [
    { passenger_id:1,  first_name:'Ali',    last_name:'Khan',    gender:'Male',   age:34, nationality:'Pakistani', email:'ali.khan@email.com',    bookings:2 },
    { passenger_id:2,  first_name:'Sara',   last_name:'Ahmed',   gender:'Female', age:28, nationality:'Pakistani', email:'sara.ahmed@email.com',   bookings:2 },
    { passenger_id:3,  first_name:'James',  last_name:'Lee',     gender:'Male',   age:45, nationality:'American',  email:'james.lee@email.com',    bookings:2 },
    { passenger_id:4,  first_name:'Priya',  last_name:'Sharma',  gender:'Female', age:31, nationality:'Indian',    email:'priya.sharma@email.com', bookings:2 },
    { passenger_id:5,  first_name:'Omar',   last_name:'Farooq',  gender:'Male',   age:22, nationality:'Pakistani', email:'omar.farooq@email.com',  bookings:2 },
    { passenger_id:6,  first_name:'Emily',  last_name:'Chen',    gender:'Female', age:39, nationality:'Chinese',   email:'emily.chen@email.com',   bookings:2 },
    { passenger_id:7,  first_name:'Hassan', last_name:'Raza',    gender:'Male',   age:52, nationality:'Pakistani', email:'hassan.raza@email.com',  bookings:2 },
    { passenger_id:8,  first_name:'Aisha',  last_name:'Malik',   gender:'Female', age:27, nationality:'Pakistani', email:'aisha.malik@email.com',  bookings:2 },
    { passenger_id:9,  first_name:'David',  last_name:'Smith',   gender:'Male',   age:60, nationality:'British',   email:'david.smith@email.com',  bookings:2 },
    { passenger_id:10, first_name:'Fatima', last_name:'Noor',    gender:'Female', age:35, nationality:'Pakistani', email:'fatima.noor@email.com',  bookings:2 },
  ],
  aircraft: [
    { aircraft_id:1, tail_number:'AP-BHO', model:'Boeing 777-200ER',  total_seats:336, manufacture_year:2012, airline_name:'Pakistan Int\'l Airlines' },
    { aircraft_id:2, tail_number:'AP-BIG', model:'Airbus A320-200',   total_seats:150, manufacture_year:2015, airline_name:'Pakistan Int\'l Airlines' },
    { aircraft_id:3, tail_number:'A6-ENA', model:'Boeing 777-300ER',  total_seats:360, manufacture_year:2017, airline_name:'Emirates' },
    { aircraft_id:4, tail_number:'A6-ENB', model:'Airbus A380-800',   total_seats:489, manufacture_year:2019, airline_name:'Emirates' },
    { aircraft_id:5, tail_number:'VT-IGA', model:'Airbus A320neo',    total_seats:180, manufacture_year:2020, airline_name:'IndiGo' },
    { aircraft_id:6, tail_number:'VT-IGB', model:'Airbus A321neo',    total_seats:220, manufacture_year:2021, airline_name:'IndiGo' },
    { aircraft_id:7, tail_number:'A6-ABA', model:'Airbus A320-200',   total_seats:162, manufacture_year:2016, airline_name:'Air Arabia' },
    { aircraft_id:8, tail_number:'AP-BLD', model:'Boeing 737-800',    total_seats:162, manufacture_year:2013, airline_name:'Pakistan Int\'l Airlines' },
  ],
  crew: [
    { crew_id:1,  first_name:'Tariq',  last_name:'Mahmood',    role:'Pilot',            licence_number:'PK-PIL-001', airline_name:'Pakistan Int\'l Airlines' },
    { crew_id:2,  first_name:'Zara',   last_name:'Siddiqui',   role:'Co-Pilot',         licence_number:'PK-CPL-002', airline_name:'Pakistan Int\'l Airlines' },
    { crew_id:3,  first_name:'Imran',  last_name:'Baig',       role:'Flight Attendant', licence_number:'PK-FA-003',  airline_name:'Pakistan Int\'l Airlines' },
    { crew_id:4,  first_name:'Nadia',  last_name:'Hussain',    role:'Flight Attendant', licence_number:'PK-FA-004',  airline_name:'Pakistan Int\'l Airlines' },
    { crew_id:5,  first_name:'Khalid', last_name:'Al-Rashid',  role:'Pilot',            licence_number:'EK-PIL-005', airline_name:'Emirates' },
    { crew_id:6,  first_name:'Sofia',  last_name:'Martinez',   role:'Co-Pilot',         licence_number:'EK-CPL-006', airline_name:'Emirates' },
    { crew_id:7,  first_name:'Ravi',   last_name:'Kumar',      role:'Pilot',            licence_number:'6E-PIL-007', airline_name:'IndiGo' },
    { crew_id:8,  first_name:'Meera',  last_name:'Patel',      role:'Flight Attendant', licence_number:'6E-FA-008',  airline_name:'IndiGo' },
    { crew_id:9,  first_name:'Ahmed',  last_name:'Al-Hashimi', role:'Pilot',            licence_number:'G9-PIL-009', airline_name:'Air Arabia' },
    { crew_id:10, first_name:'Sana',   last_name:'Mirza',      role:'Co-Pilot',         licence_number:'PK-CPL-010', airline_name:'Pakistan Int\'l Airlines' },
    { crew_id:11, first_name:'John',   last_name:'Williams',   role:'Flight Attendant', licence_number:'EK-FA-011',  airline_name:'Emirates' },
    { crew_id:12, first_name:'Hina',   last_name:'Qureshi',    role:'Flight Attendant', licence_number:'PK-FA-012',  airline_name:'Pakistan Int\'l Airlines' },
  ],
};

/* ──────────────────────────────────────────────
   GLOBAL STATE
────────────────────────────────────────────── */
let DATA = { flights: [], bookings: [], passengers: [], aircraft: [], crew: [] };
let currentPage = 'dashboard';

/* ──────────────────────────────────────────────
   BADGE HELPERS
────────────────────────────────────────────── */
function statusBadge(s) {
  const map = { 'On-Time':'ontm', 'Delayed':'dly', 'Cancelled':'cncl', 'Landed':'land', 'Departed':'dept' };
  return `<span class="badge badge-${map[s] || 'land'}">${s}</span>`;
}
function payBadge(p) {
  const map = { 'Paid':'paid', 'Pending':'pend', 'Refunded':'rfnd' };
  return `<span class="badge badge-${map[p] || 'pend'}">${p}</span>`;
}
function classBadge(c) {
  const map = { 'Economy':'eco', 'Business':'biz', 'First':'fst' };
  return `<span class="badge badge-${map[c] || 'eco'}">${c}</span>`;
}
function roleBadge(r) {
  if (r === 'Pilot')            return `<span class="badge badge-pilot">Pilot</span>`;
  if (r === 'Co-Pilot')         return `<span class="badge badge-copilot">Co-Pilot</span>`;
  if (r === 'Flight Attendant') return `<span class="badge badge-fa">Flight Attendant</span>`;
  return `<span class="badge badge-eco">${r}</span>`;
}
function routeCell(from, to) {
  return `<div class="route-display">
    <span class="iata-code">${from}</span>
    <span class="route-arrow">→</span>
    <span class="iata-code">${to}</span>
  </div>`;
}
function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric' });
}
function fmtTime(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('en-PK', { day:'2-digit', month:'short' })
    + ' ' + d.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit', hour12:false });
}
function fmtPrice(n) {
  return Number(n).toLocaleString('en-PK');
}

/* ──────────────────────────────────────────────
   TOAST
────────────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ──────────────────────────────────────────────
   CLOCK
────────────────────────────────────────────── */
function startClock() {
  const tick = () => {
    const now = new Date();
    document.getElementById('liveClock').textContent =
      now.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false })
      + '  ' + now.toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric' });
  };
  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────
   NAVIGATION
────────────────────────────────────────────── */
const PAGE_META = {
  dashboard:  { title: 'Dashboard',  sub: 'Overview of all operations' },
  flights:    { title: 'Flights',    sub: 'Manage and track all flights' },
  bookings:   { title: 'Bookings',   sub: 'Passenger booking records' },
  passengers: { title: 'Passengers', sub: 'Registered travellers' },
  aircraft:   { title: 'Aircraft',   sub: 'Fleet information' },
  crew:       { title: 'Crew',       sub: 'Crew members and assignments' },
};

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById('page-' + page).classList.add('active');
  document.getElementById('nav-' + page).classList.add('active');

  const meta = PAGE_META[page];
  document.getElementById('pageTitle').textContent = meta.title;
  document.getElementById('pageSub').textContent   = meta.sub;
  currentPage = page;

  // Render the page-specific table
  if (page === 'flights')    renderFlights();
  if (page === 'bookings')   renderBookings();
  if (page === 'passengers') renderPassengers();
  if (page === 'aircraft')   renderAircraft();
  if (page === 'crew')       renderCrew();
}

/* ──────────────────────────────────────────────
   FETCH FROM BACKEND (with fallback)
────────────────────────────────────────────── */
async function apiFetch(endpoint) {
  const res = await fetch(API_BASE + endpoint);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchAll() {
  const dot  = document.getElementById('dbDot');
  const text = document.getElementById('dbStatusText');

  try {
    const [flights, bookings, passengers, aircraft, crew] = await Promise.all([
      apiFetch('/flights'),
      apiFetch('/bookings'),
      apiFetch('/passengers'),
      apiFetch('/aircraft'),
      apiFetch('/crew'),
    ]);

    DATA = { flights, bookings, passengers, aircraft, crew };
    dot.className  = 'dot online';
    text.textContent = 'Live — PostgreSQL';
    showToast('✓ Connected to database');

  } catch (err) {
    // Backend offline → use mock data
    DATA = MOCK;
    dot.className  = 'dot offline';
    text.textContent = 'Demo mode (offline)';
    showToast('⚠ Backend offline — showing demo data');
  }

  renderDashboard();
}

/* ──────────────────────────────────────────────
   DASHBOARD
────────────────────────────────────────────── */
function renderDashboard() {
  const { flights, bookings, passengers } = DATA;

  // Stat cards
  const paidRev = bookings
    .filter(b => b.payment_status === 'Paid')
    .reduce((sum, b) => sum + Number(b.ticket_price), 0);

  document.getElementById('s-flights').textContent    = flights.length;
  document.getElementById('s-bookings').textContent   = bookings.length;
  document.getElementById('s-revenue').textContent    = '₨' + fmtPrice(paidRev);
  document.getElementById('s-passengers').textContent = passengers.length;

  // Recent flights table (first 5)
  document.getElementById('dashFlightBody').innerHTML = flights.slice(0, 5).map(f => `
    <tr>
      <td style="font-weight:500;font-family:'DM Mono',monospace;">${f.flight_number}</td>
      <td>${routeCell(f.from_iata, f.to_iata)}</td>
      <td style="color:var(--text-secondary);">${f.airline_name.split(' ').slice(0,2).join(' ')}</td>
      <td>${statusBadge(f.status)}</td>
    </tr>`).join('');

  // Recent bookings (first 5)
  document.getElementById('dashBookingBody').innerHTML = bookings.slice(0, 5).map(b => `
    <tr>
      <td style="font-weight:500;">${b.passenger}</td>
      <td style="font-family:'DM Mono',monospace;">${b.flight_number}</td>
      <td>${classBadge(b.cabin_class)}</td>
      <td style="font-family:'DM Mono',monospace;">₨${fmtPrice(b.ticket_price)}</td>
    </tr>`).join('');

  // Airline pill list
  const airlineCounts = {};
  flights.forEach(f => {
    const name = f.airline_name;
    airlineCounts[name] = (airlineCounts[name] || 0) + 1;
  });
  document.getElementById('airlineList').innerHTML = Object.entries(airlineCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `
      <div class="pill-row">
        <span class="pill-name">${name}</span>
        <span class="pill-badge">${count} flight${count > 1 ? 's' : ''}</span>
      </div>`).join('');

  // Status breakdown bars
  const statuses = ['On-Time','Delayed','Cancelled','Landed','Departed'];
  const barColors = { 'On-Time':'#22c55e','Delayed':'#f59e0b','Cancelled':'#ef4444','Landed':'#6378b4','Departed':'#14b8a6' };
  const counts = {};
  statuses.forEach(s => counts[s] = flights.filter(f => f.status === s).length);
  const maxCount = Math.max(...Object.values(counts), 1);

  document.getElementById('statusBreakdown').innerHTML = statuses.map(s => `
    <div class="status-bar-row">
      <div class="status-bar-label">
        <span>${s}</span>
        <span>${counts[s]}</span>
      </div>
      <div class="status-bar-track">
        <div class="status-bar-fill" style="width:${(counts[s]/maxCount)*100}%;background:${barColors[s]};"></div>
      </div>
    </div>`).join('');
}

/* ──────────────────────────────────────────────
   FLIGHTS TABLE
────────────────────────────────────────────── */
function renderFlights() {
  const search = (document.getElementById('flightSearch')?.value || '').toLowerCase();
  const status = document.getElementById('flightStatusFilter')?.value || '';

  const filtered = DATA.flights.filter(f => {
    const matchSearch = !search ||
      f.flight_number.toLowerCase().includes(search) ||
      f.airline_name.toLowerCase().includes(search) ||
      f.from_iata.toLowerCase().includes(search) ||
      f.to_iata.toLowerCase().includes(search);
    const matchStatus = !status || f.status === status;
    return matchSearch && matchStatus;
  });

  const tbody = document.getElementById('flightTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">◈</div>No flights match your filters.</div></td></tr>`;
  } else {
    tbody.innerHTML = filtered.map(f => `
      <tr>
        <td style="font-weight:600;font-family:'DM Mono',monospace;color:var(--blue);">${f.flight_number}</td>
        <td>${f.airline_name}</td>
        <td><span class="iata-code">${f.from_iata}</span></td>
        <td><span class="iata-code">${f.to_iata}</span></td>
        <td style="font-family:'DM Mono',monospace;font-size:12px;">${fmtTime(f.departure_time)}</td>
        <td style="font-family:'DM Mono',monospace;font-size:12px;">${fmtTime(f.arrival_time)}</td>
        <td style="color:var(--text-secondary);font-size:12px;">${f.tail_number || '—'}</td>
        <td>${statusBadge(f.status)}</td>
      </tr>`).join('');
  }
  document.getElementById('flightCount').textContent =
    `Showing ${filtered.length} of ${DATA.flights.length} flights`;
}

/* ──────────────────────────────────────────────
   BOOKINGS TABLE
────────────────────────────────────────────── */
function renderBookings() {
  const search = (document.getElementById('bookingSearch')?.value || '').toLowerCase();
  const pay    = document.getElementById('bookingPayFilter')?.value || '';
  const cls    = document.getElementById('bookingClassFilter')?.value || '';

  const filtered = DATA.bookings.filter(b => {
    const matchSearch = !search ||
      b.passenger.toLowerCase().includes(search) ||
      b.flight_number.toLowerCase().includes(search) ||
      b.seat_number.toLowerCase().includes(search);
    const matchPay = !pay || b.payment_status === pay;
    const matchCls = !cls || b.cabin_class === cls;
    return matchSearch && matchPay && matchCls;
  });

  const tbody = document.getElementById('bookingTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">◉</div>No bookings match your filters.</div></td></tr>`;
  } else {
    tbody.innerHTML = filtered.map(b => `
      <tr>
        <td style="color:var(--text-muted);">#${b.booking_id}</td>
        <td style="font-weight:500;">${b.passenger}</td>
        <td style="font-family:'DM Mono',monospace;color:var(--blue);">${b.flight_number}</td>
        <td style="font-family:'DM Mono',monospace;">${b.seat_number}</td>
        <td>${classBadge(b.cabin_class)}</td>
        <td style="font-family:'DM Mono',monospace;">₨${fmtPrice(b.ticket_price)}</td>
        <td style="color:var(--text-secondary);font-size:12px;">${fmtDate(b.booking_date)}</td>
        <td>${payBadge(b.payment_status)}</td>
      </tr>`).join('');
  }

  const total = filtered.reduce((s, b) => s + Number(b.ticket_price), 0);
  document.getElementById('bookingCount').textContent =
    `Showing ${filtered.length} of ${DATA.bookings.length} bookings  ·  Total: ₨${fmtPrice(total)}`;
}

/* ──────────────────────────────────────────────
   PASSENGERS TABLE
────────────────────────────────────────────── */
function renderPassengers() {
  const search = (document.getElementById('passengerSearch')?.value || '').toLowerCase();
  const gender = document.getElementById('passengerGenderFilter')?.value || '';

  const filtered = DATA.passengers.filter(p => {
    const fullName = (p.first_name + ' ' + p.last_name).toLowerCase();
    const matchSearch = !search ||
      fullName.includes(search) ||
      p.email.toLowerCase().includes(search) ||
      p.nationality.toLowerCase().includes(search);
    const matchGender = !gender || p.gender === gender;
    return matchSearch && matchGender;
  });

  // Join booking count from bookings data
  const bookingCount = {};
  DATA.bookings.forEach(b => {
    // Try to match passenger name
    const name = b.passenger;
    bookingCount[name] = (bookingCount[name] || 0) + 1;
  });

  const tbody = document.getElementById('passengerTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">◎</div>No passengers match your search.</div></td></tr>`;
  } else {
    tbody.innerHTML = filtered.map(p => {
      const fullName = p.first_name + ' ' + p.last_name;
      const bCount = bookingCount[fullName] || p.bookings || 0;
      return `
        <tr>
          <td style="color:var(--text-muted);font-family:'DM Mono',monospace;">#${p.passenger_id}</td>
          <td style="font-weight:500;">${fullName}</td>
          <td style="color:var(--text-secondary);">${p.gender}</td>
          <td>${p.age}</td>
          <td>${p.nationality}</td>
          <td style="color:var(--text-secondary);font-size:12px;">${p.email}</td>
          <td><span class="badge badge-biz">${bCount} booking${bCount !== 1 ? 's' : ''}</span></td>
        </tr>`;
    }).join('');
  }
  document.getElementById('passengerCount').textContent =
    `Showing ${filtered.length} of ${DATA.passengers.length} passengers`;
}

/* ──────────────────────────────────────────────
   AIRCRAFT TABLE
────────────────────────────────────────────── */
function renderAircraft() {
  const search = (document.getElementById('aircraftSearch')?.value || '').toLowerCase();

  const filtered = DATA.aircraft.filter(a =>
    !search ||
    a.tail_number.toLowerCase().includes(search) ||
    a.model.toLowerCase().includes(search) ||
    a.airline_name.toLowerCase().includes(search)
  );

  const tbody = document.getElementById('aircraftTableBody');
  tbody.innerHTML = filtered.map(a => `
    <tr>
      <td style="font-family:'DM Mono',monospace;font-weight:600;color:var(--teal);">${a.tail_number}</td>
      <td style="font-weight:500;">${a.model}</td>
      <td>${a.total_seats} seats</td>
      <td style="color:var(--text-secondary);">${a.manufacture_year}</td>
      <td>${a.airline_name}</td>
    </tr>`).join('');
}

/* ──────────────────────────────────────────────
   CREW TABLE
────────────────────────────────────────────── */
function renderCrew() {
  const search = (document.getElementById('crewSearch')?.value || '').toLowerCase();
  const role   = document.getElementById('crewRoleFilter')?.value || '';

  const filtered = DATA.crew.filter(c => {
    const fullName = (c.first_name + ' ' + c.last_name).toLowerCase();
    const matchSearch = !search ||
      fullName.includes(search) ||
      c.licence_number.toLowerCase().includes(search) ||
      c.airline_name.toLowerCase().includes(search);
    const matchRole = !role || c.role === role;
    return matchSearch && matchRole;
  });

  const tbody = document.getElementById('crewTableBody');
  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td style="color:var(--text-muted);font-family:'DM Mono',monospace;">#${c.crew_id}</td>
      <td style="font-weight:500;">${c.first_name} ${c.last_name}</td>
      <td>${roleBadge(c.role)}</td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text-secondary);">${c.licence_number}</td>
      <td>${c.airline_name}</td>
    </tr>`).join('');
}

/* ──────────────────────────────────────────────
   GLOBAL SEARCH (topbar)
   Redirects to the right page and pre-fills filter
────────────────────────────────────────────── */
function handleSearch(val) {
  const q = val.toLowerCase().trim();
  if (!q) return;

  // Detect what we're searching for and navigate
  const isFlightNum = /^[a-z0-9]{2}-\d/i.test(q);
  const isIata      = /^[a-z]{3}$/i.test(q);

  if (isFlightNum || isIata) {
    showPage('flights');
    document.getElementById('flightSearch').value = val;
    renderFlights();
  } else {
    // Default: search passengers
    showPage('passengers');
    document.getElementById('passengerSearch').value = val;
    renderPassengers();
  }
}

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  startClock();
  fetchAll();
});
