const express = require('express');
const router = express.Router();
const conn = require('../conn');

// admin pages
router.get('/dashboard', async (req, res) => {
  try {
    const [[patientCount]] = await conn.query('SELECT COUNT(*) AS total FROM patients');
    const [[appointmentCount]] = await conn.query('SELECT COUNT(*) AS total FROM appointments');
    const [[doctorCount]] = await conn.query('SELECT COUNT(*) AS total FROM doctors');

    res.render('admin/dashboard', {
      stats: {
        patients: patientCount.total,
        appointments: appointmentCount.total,
        doctors: doctorCount.total
      }
    });
  } catch (err) {
    console.error(err);
    res.render('admin/dashboard', { stats: { patients: 0, appointments: 0, doctors: 0 } });
  }
});

// ==================== PATIENTS CRUD ====================
router.get('/patients', async (req, res) => {
  try {
    const [patients] = await conn.query(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );
    res.render('admin/patients', { patients });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading patients');
  }
});

router.post('/patients', async (req, res) => {
  const { full_name, age, gender, phone, email, status } = req.body;
  try {
    const [result] = await conn.query(
      'INSERT INTO patients (patient_code, full_name, age, gender, phone, email, status) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
      [full_name, age || null, gender || 'other', phone || null, email || null, status || 'active']
    );
    const id = result.insertId;
    const code = 'P' + String(id).padStart(3, '0');
    await conn.query('UPDATE patients SET patient_code = ? WHERE id = ?', [code, id]);
    res.redirect('/admin/patients');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating patient');
  }
});

router.post('/patients/:id/update', async (req, res) => {
  const { id } = req.params;
  const { full_name, age, gender, phone, email, status } = req.body;
  try {
    await conn.query(
      `UPDATE patients
       SET full_name = ?, age = ?, gender = ?, phone = ?, email = ?, status = ?
       WHERE id = ?`,
      [full_name, age || null, gender || 'other', phone || null, email || null, status || 'active', id]
    );
    res.redirect('/admin/patients');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating patient');
  }
});

router.post('/patients/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM patients WHERE id = ?', [id]);
    res.redirect('/admin/patients');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting patient');
  }
});

// ==================== DOCTORS CRUD ====================
router.get('/doctors', async (req, res) => {
  try {
    const [doctors] = await conn.query(
      'SELECT * FROM doctors ORDER BY created_at DESC'
    );
    res.render('admin/doctors', { doctors });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading doctors');
  }
});

router.post('/doctors', async (req, res) => {
  const { full_name, title, years_experience, phone, email, status } = req.body;
  try {
    const [result] = await conn.query(
      'INSERT INTO doctors (doctor_code, full_name, title, years_experience, phone, email, status) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
      [full_name, title || null, years_experience || null, phone || null, email || null, status || 'active']
    );
    const id = result.insertId;
    const code = 'D' + String(id).padStart(3, '0');
    await conn.query('UPDATE doctors SET doctor_code = ? WHERE id = ?', [code, id]);
    res.redirect('/admin/doctors');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating doctor');
  }
});

router.post('/doctors/:id/update', async (req, res) => {
  const { id } = req.params;
  const { full_name, title, years_experience, phone, email, status } = req.body;
  try {
    await conn.query(
      `UPDATE doctors
       SET full_name = ?, title = ?, years_experience = ?, phone = ?, email = ?, status = ?
       WHERE id = ?`,
      [full_name, title || null, years_experience || null, phone || null, email || null, status || 'active', id]
    );
    res.redirect('/admin/doctors');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating doctor');
  }
});

router.post('/doctors/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM doctors WHERE id = ?', [id]);
    res.redirect('/admin/doctors');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting doctor');
  }
});

// ==================== SERVICES CRUD ====================
router.get('/services', async (req, res) => {
  try {
    const [services] = await conn.query(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    res.render('admin/services', { services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading services');
  }
});

router.post('/services', async (req, res) => {
  const { name, short_description, description, is_active } = req.body;
  try {
    await conn.query(
      `INSERT INTO services (name, short_description, description, is_active)
       VALUES (?, ?, ?, ?)`,
      [name, short_description || null, description || null, is_active ? 1 : 0]
    );
    res.redirect('/admin/services');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating service');
  }
});

router.post('/services/:id/update', async (req, res) => {
  const { id } = req.params;
  const { name, short_description, description, is_active } = req.body;
  try {
    await conn.query(
      `UPDATE services
       SET name = ?, short_description = ?, description = ?, is_active = ?
       WHERE id = ?`,
      [name, short_description || null, description || null, is_active ? 1 : 0, id]
    );
    res.redirect('/admin/services');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating service');
  }
});

router.post('/services/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM services WHERE id = ?', [id]);
    res.redirect('/admin/services');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting service');
  }
});

// ==================== APPOINTMENTS CRUD ====================
router.get('/appointments', async (req, res) => {
  try {
    const [appointments] = await conn.query(
      `SELECT a.*, p.full_name AS patient_name, d.full_name AS doctor_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.appointment_date DESC`
    );
    res.render('admin/appointments', { appointments });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading appointments');
  }
});

router.post('/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await conn.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );
    res.redirect('/admin/appointments');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating appointment');
  }
});

router.post('/appointments/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await conn.query('DELETE FROM appointments WHERE id = ?', [id]);
    res.redirect('/admin/appointments');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting appointment');
  }
});

router.get('/reports', (req, res) => {
  res.render('admin/reports');
});

router.get('/settings', (req, res) => {
  res.render('admin/settings');
});

router.get('/profile', (req, res) => {
  res.render('admin/profile');
});

router.get('/', (req, res) => {
  res.render('admin/login');
});

module.exports = router;