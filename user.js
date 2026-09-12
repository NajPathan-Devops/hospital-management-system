const express = require('express');
const router = express.Router();
const conn = require('../conn');

// user pages
router.get(['/', '/home'], (req, res) => {
  res.render('user/home');
});

router.get('/about', (req, res) => {
  res.render('user/about');
});

router.get('/appointment', (req, res) => {
  res.render('user/appointment');
});

// create appointment (C in CRUD for appointments/patients)
router.post('/appointment', async (req, res) => {
  const {
    fullName,
    phone,
    email,
    age,
    department,
    doctor,
    date,
    time,
    reason
  } = req.body;

  const connection = await conn.getConnection();
  try {
    await connection.beginTransaction();

    // find existing patient by phone or create new
    const [existing] = await connection.query(
      'SELECT id FROM patients WHERE phone = ? LIMIT 1',
      [phone]
    );

    let patientId;
    if (existing.length) {
      patientId = existing[0].id;
    } else {
      const [result] = await connection.query(
        'INSERT INTO patients (patient_code, full_name, age, phone, email, status) VALUES (NULL, ?, ?, ?, ?, ?)',
        [fullName, age || null, phone, email || null, 'active']
      );
      patientId = result.insertId;

      // generate patient_code like P001
      const patientCode = 'P' + String(patientId).padStart(3, '0');
      await connection.query(
        'UPDATE patients SET patient_code = ? WHERE id = ?',
        [patientCode, patientId]
      );
    }

    // department is currently a free-text field from the form
    // you can later map it to departments table if needed

    const [apptResult] = await connection.query(
      `INSERT INTO appointments
       (appointment_code, patient_id, doctor_id, department_id, appointment_date, type, status, preferred_time_slot, reason, created_from)
       VALUES (NULL, ?, NULL, NULL, ?, ?, ?, ?, ?, 'public_form')`,
      [
        patientId,
        `${date} 00:00:00`,
        'consultation',
        'pending',
        time,
        reason || null
      ]
    );

    const appointmentId = apptResult.insertId;
    const appointmentCode = 'A' + String(appointmentId).padStart(3, '0');
    await connection.query(
      'UPDATE appointments SET appointment_code = ? WHERE id = ?',
      [appointmentCode, appointmentId]
    );

    await connection.commit();
    res.redirect('/appointment');
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).send('Error booking appointment');
  } finally {
    connection.release();
  }
});

router.get('/contact', (req, res) => {
  res.render('user/contact');
});

// create contact message (C in CRUD for contact_messages)
router.post('/contact', async (req, res) => {
  const { fullName, phone, email, subject, message } = req.body;

  try {
    await conn.query(
      `INSERT INTO contact_messages
       (full_name, phone, email, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [fullName, phone || null, email || null, subject, message]
    );

    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message');
  }
});

router.get('/service', (req, res) => {
  res.render('user/service');
});

module.exports = router;