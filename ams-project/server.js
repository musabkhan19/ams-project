const express = require('express');
const cors    = require('cors');
const { Pool } = require('pg');

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     'localhost',
  port:     5432,
  database: 'AMS',
  user:     'postgres',
  password: 'musabkhan',    // ← replace with your password
});

// sets schema to ams for every query
async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    await client.query('SET search_path TO ams');
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// ── HEALTH CHECK ────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── FLIGHTS ─────────────────────────────────────
app.get('/api/flights', async (req, res) => {
  try {
    const rows = await query(`
      SELECT
        f.flight_id,
        f.flight_number,
        f.departure_time,
        f.arrival_time,
        f.status,
        al.airline_name,
        src.iata_code AS from_iata,
        src.city      AS from_city,
        dst.iata_code AS to_iata,
        dst.city      AS to_city,
        ac.tail_number
      FROM flight f
      JOIN airline  al  ON f.airline_id  = al.airline_id
      JOIN route    r   ON f.route_id    = r.route_id
      JOIN airport  src ON r.source_airport_id      = src.airport_id
      JOIN airport  dst ON r.destination_airport_id = dst.airport_id
      JOIN aircraft ac  ON f.aircraft_id = ac.aircraft_id
      ORDER BY f.departure_time
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── BOOKINGS ─────────────────────────────────────
app.get('/api/bookings', async (req, res) => {
  try {
    const rows = await query(`
      SELECT
        b.booking_id,
        b.booking_date,
        b.cabin_class,
        b.ticket_price,
        b.seat_number,
        b.payment_status,
        CONCAT(p.first_name, ' ', p.last_name) AS passenger,
        p.email,
        f.flight_number,
        src.iata_code AS from_iata,
        dst.iata_code AS to_iata
      FROM booking b
      JOIN passenger p   ON b.passenger_id = p.passenger_id
      JOIN flight    f   ON b.flight_id    = f.flight_id
      JOIN route     r   ON f.route_id     = r.route_id
      JOIN airport   src ON r.source_airport_id      = src.airport_id
      JOIN airport   dst ON r.destination_airport_id = dst.airport_id
      ORDER BY b.booking_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PASSENGERS ───────────────────────────────────
app.get('/api/passengers', async (req, res) => {
  try {
    const rows = await query(`
      SELECT
        p.passenger_id,
        p.first_name,
        p.last_name,
        p.gender,
        p.age,
        p.nationality,
        p.email,
        COUNT(b.booking_id) AS bookings
      FROM passenger p
      LEFT JOIN booking b ON p.passenger_id = b.passenger_id
      GROUP BY p.passenger_id
      ORDER BY p.passenger_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AIRCRAFT ─────────────────────────────────────
app.get('/api/aircraft', async (req, res) => {
  try {
    const rows = await query(`
      SELECT
        ac.aircraft_id,
        ac.tail_number,
        ac.model,
        ac.total_seats,
        ac.manufacture_year,
        al.airline_name
      FROM aircraft ac
      JOIN airline al ON ac.airline_id = al.airline_id
      ORDER BY al.airline_name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREW ─────────────────────────────────────────
app.get('/api/crew', async (req, res) => {
  try {
    const rows = await query(`
      SELECT
        c.crew_id,
        c.first_name,
        c.last_name,
        c.role,
        c.licence_number,
        al.airline_name
      FROM crew c
      JOIN airline al ON c.airline_id = al.airline_id
      ORDER BY c.role
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STATS ─────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const flights    = await query('SELECT COUNT(*) AS count FROM flight');
    const bookings   = await query('SELECT COUNT(*) AS count FROM booking');
    const passengers = await query('SELECT COUNT(*) AS count FROM passenger');
    const revenue    = await query(`SELECT COALESCE(SUM(ticket_price),0) AS total FROM booking WHERE payment_status = 'Paid'`);
    res.json({
      flights:    Number(flights[0].count),
      bookings:   Number(bookings[0].count),
      passengers: Number(passengers[0].count),
      revenue:    Number(revenue[0].total),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  AMS API running at http://localhost:${PORT}/api`);
  console.log(`  Endpoints: /flights  /bookings  /passengers  /aircraft  /crew  /stats\n`);
});
