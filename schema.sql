-- Hospital management schema for admin & user features
-- Compatible with MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS hospital_app;
USE hospital_app;

-- ====================  ADMIN USERS  ====================
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name       VARCHAR(100) NOT NULL,
  last_name        VARCHAR(100),
  email            VARCHAR(150) NOT NULL UNIQUE,
  password_hash    VARCHAR(255) NOT NULL,
  phone            VARCHAR(20),
  role             ENUM('super_admin','admin') DEFAULT 'admin',
  is_active        TINYINT(1) DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================  DEPARTMENTS / SPECIALTIES  ====================
CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100) NOT NULL UNIQUE,  -- e.g. Cardiology, Neurology
  description      TEXT,
  is_active        TINYINT(1) DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================  DOCTORS  ====================
CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_code      VARCHAR(20) UNIQUE,            -- e.g. D001 (auto-filled after insert)
  full_name        VARCHAR(150) NOT NULL,
  department_id    INT,
  title            VARCHAR(100),                  -- e.g. Cardiologist
  years_experience INT,
  phone            VARCHAR(20),
  email            VARCHAR(150),
  status           ENUM('active','inactive','on_leave') DEFAULT 'active',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_doctors_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
      ON UPDATE CASCADE ON DELETE SET NULL
);

-- ====================  PATIENTS  ====================
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_code     VARCHAR(20) UNIQUE,            -- e.g. P001 (auto-filled after insert)
  full_name        VARCHAR(150) NOT NULL,
  age              INT,
  gender           ENUM('male','female','other') DEFAULT 'other',
  phone            VARCHAR(20),
  email            VARCHAR(150),
  address          VARCHAR(255),
  last_visit_date  DATE,
  status           ENUM('active','inactive') DEFAULT 'active',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================  MEDICAL SERVICES  ====================
-- Used by both public site (services page) and admin services management
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,         -- e.g. Joint Replacement, Cancer Treatment
  department_id    INT,
  slug             VARCHAR(100) UNIQUE,           -- e.g. joint-replacement
  short_description VARCHAR(255),
  description      TEXT,
  is_active        TINYINT(1) DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
      ON UPDATE CASCADE ON DELETE SET NULL
);

-- ====================  APPOINTMENTS  ====================
-- Created from user appointment form and managed in admin appointments view
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_code VARCHAR(20) UNIQUE,            -- e.g. A001
  patient_id       INT NOT NULL,
  doctor_id        INT,
  department_id    INT,
  appointment_date DATETIME NOT NULL,
  type             ENUM('consultation','follow_up','surgery','other') DEFAULT 'consultation',
  status           ENUM('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  preferred_time_slot VARCHAR(50),                -- matches UI time slot options
  reason           TEXT,
  created_from     ENUM('public_form','admin_panel') DEFAULT 'public_form',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id) REFERENCES patients(id)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
      ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_appointments_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
      ON UPDATE CASCADE ON DELETE SET NULL
);

-- ====================  CONTACT MESSAGES  ====================
-- From user contact form (Contact Us page)
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(150) NOT NULL,
  phone            VARCHAR(20),
  email            VARCHAR(150),
  subject          ENUM(
                     'appointment_request',
                     'general_inquiry',
                     'insurance_question',
                     'medical_records',
                     'feedback',
                     'other'
                   ) DEFAULT 'other',
  message          TEXT NOT NULL,
  status           ENUM('new','in_progress','closed') DEFAULT 'new',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================  SYSTEM SETTINGS  ====================
-- Backing store for Settings page (timezone, email config, etc.)
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name         VARCHAR(100) NOT NULL UNIQUE,  -- e.g. 'site_name', 'timezone'
  value_text       TEXT,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

