from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime
import random
import string

app = Flask(__name__)

# ─────────────────────────────────────────────
# Database Setup
# ─────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reference TEXT,
            name TEXT,
            phone TEXT,
            email TEXT,
            event_type TEXT,
            event_date TEXT,
            venue TEXT,
            food_type TEXT,
            guest_count INTEGER,
            menu_items TEXT,
            special_requests TEXT,
            status TEXT DEFAULT 'Pending',
            created_at TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS booked_dates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_date TEXT,
            event_type TEXT
        )
    ''')

    conn.commit()
    conn.close()

# ─────────────────────────────────────────────
# Generate Reference Number
# ─────────────────────────────────────────────
def generate_reference():
    return 'SSR' + ''.join(random.choices(string.digits, k=6))

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/book', methods=['POST'])
def book():
    data = request.json
    reference = generate_reference()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO bookings
        (reference, name, phone, email, event_type, event_date,
        venue, food_type, guest_count, menu_items,
        special_requests, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
    ''', (
        reference,
        data['name'],
        data['phone'],
        data['email'],
        data['event_type'],
        data['event_date'],
        data['venue'],
        data['food_type'],
        data['guest_count'],
        data['menu_items'],
        data['special_requests'],
        created_at
    ))

    cursor.execute('''
        INSERT INTO booked_dates (event_date, event_type)
        VALUES (?, ?)
    ''', (data['event_date'], data['event_type']))

    conn.commit()
    conn.close()

    return jsonify({
        'success': True,
        'reference': reference,
        'message': 'Booking confirmed!'
    })

@app.route('/booked-dates')
def booked_dates():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT event_date FROM booked_dates")
    dates = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(dates)

@app.route('/check-date/<date>')
def check_date(date):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM booked_dates WHERE event_date=?", (date,))
    result = cursor.fetchone()
    conn.close()
    if result:
        return jsonify({'available': False})
    return jsonify({'available': True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)