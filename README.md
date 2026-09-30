
# 🏥 Hospital Management System

A web-based Hospital Management System developed using **Node.js, Express.js, EJS, JavaScript, and MySQL**.

The application provides separate user and administrative functionality for managing patients, doctors, services, appointments, and hospital-related information through a web interface.

## 🚀 Project Overview

The Hospital Management System is designed to simplify common hospital management tasks through a centralized web application.

Users can access hospital information and book appointments, while administrators can manage patients, doctors, services, appointments, and related records.

## 🛠️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript, EJS
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Database Driver:** MySQL2
* **Templating Engine:** EJS
* **Package Manager:** npm

## ✨ Key Features

### 👤 User Features

* Hospital home and information pages
* View doctors and hospital services
* Appointment booking
* Patient registration through appointment workflow
* Contact form
* Appointment and patient information handling

### 🔐 Admin Features

* Admin login
* Admin dashboard
* Patient management
* Doctor management
* Service management
* Appointment management
* Appointment status updates
* Patient and doctor records
* Reports and administrative pages
* Profile and settings pages

## 🗄️ Database

The project uses **MySQL** for storing hospital-related information.

The database schema includes tables for:

* Administrators
* Departments
* Doctors
* Patients
* Services
* Appointments
* Contact messages
* System settings

The database structure and relationships are provided in:

```text
schema.sql
```

## 📂 Project Structure

```text
hospital-management-system/
│
├── server.js
├── conn.js
├── user.js
├── admin.js
├── schema.sql
├── package.json
├── package-lock.json
│
├── *.ejs
├── js.js
│
└── image/assets
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone git@github.com:NajPathan-Devops/hospital-management-system.git
cd hospital-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL

Create the required MySQL database and import the provided schema:

```text
schema.sql
```

The application expects a MySQL database named:

```text
hospital_app
```

Update the database connection configuration in `conn.js` according to your local MySQL setup.

### 4. Start the application

```bash
npm start
```

The application can then be accessed through the local server configured in `server.js`.

## 🔄 Application Flow

```text
User
 │
 ├── View Hospital Information
 │
 ├── View Doctors & Services
 │
 ├── Book Appointment
 │
 └── Submit Contact Information
          │
          ▼
      Express.js
          │
          ▼
        MySQL
          │
          ▼
    Hospital Records
          ▲
          │
      Admin Panel
          │
 ├── Manage Patients
 ├── Manage Doctors
 ├── Manage Services
 └── Manage Appointments
```

## 🎯 Project Purpose

This project was developed as an academic web application to gain practical experience with:

* Full-stack web application development
* Node.js and Express.js
* Server-side rendering with EJS
* MySQL database integration
* CRUD operations
* Form handling
* REST-style application routes
* Hospital management workflows

## 📚 Learning Outcomes

Through this project, I gained practical experience in:

* Building a web application using Node.js and Express.js
* Connecting a backend application with MySQL
* Designing database schemas
* Implementing CRUD functionality
* Creating dynamic web pages using EJS
* Handling user and administrator workflows
* Organizing backend routes and application logic

## 👩‍💻 Author

**Naj Pathan**

GitHub: **NajPathan-Devops**

## 📌 Project Status

**Academic Project — Completed**

The project demonstrates a functional hospital management application with user-facing and administrative workflows backed by a MySQL database.


