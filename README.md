## SSR Catering Management System
# Overview

SSR Catering Management System is a web-based application developed using Python and Flask to manage catering orders efficiently. The system allows customers to place catering orders online and enables administrators to manage bookings, customer details, and catering services from a centralized dashboard.

# Features
Customer Registration and Login
Online Catering Order Booking
Menu Display
Customer Information Management
Order Management
Admin Dashboard
SQLite Database Integration
Responsive User Interface
# Technologies Used
Python
Flask
HTML5
CSS3
Bootstrap
SQLite
Jinja2 Templates
## Project Structure
SSR-Catering/
│
├── app.py
├── database.db
├── requirements.txt
│
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── booking.html
│   └── admin.html
│
├── static/
│   ├── css/
│   ├── image/
│   └── js/
│
└── README.md
# Installation
Step 1: Clone the Repository
git clone <repository-url>
cd SSR-Catering
Step 2: Create Virtual Environment
python -m venv venv
Step 3: Activate Virtual Environment

Windows

venv\Scripts\activate

Linux/Mac

source venv/bin/activate
Step 4: Install Dependencies
pip install -r requirements.txt
Step 5: Run the Application
python app.py
Step 6: Open Browser
http://127.0.0.1:5000
Database

The application uses SQLite as the backend database.

Database file:

database.db

The database stores:

Customer Details
Login Credentials
Catering Orders
Booking Information
Future Enhancements
Online Payment Integration
Email Notifications
Order Tracking
Menu Management Module
Event Scheduling
Report Generation
Mobile Responsive Design Improvements
