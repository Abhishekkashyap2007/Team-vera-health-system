import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "healthcare.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        phone TEXT,
        blood_group TEXT,
        age INTEGER,
        specialty TEXT,
        medical_reg TEXT,
        fleet_unit TEXT,
        google_id TEXT,
        avatar_url TEXT,
        consent_given BOOLEAN DEFAULT 1,
        created_at TEXT
    )
    """)

    # AI Screenings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_screenings (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        module_key TEXT NOT NULL,
        risk_level TEXT,
        urgency TEXT,
        confidence TEXT,
        findings TEXT,
        conditions_json TEXT,
        red_flags_json TEXT,
        next_steps_json TEXT,
        recommended_specialist TEXT,
        clinical_disclaimer TEXT,
        image_path TEXT,
        symptoms TEXT,
        created_at TEXT
    )
    """)

    # Doctors Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        photo TEXT,
        specialty TEXT NOT NULL,
        specialty_id TEXT NOT NULL,
        qualifications TEXT,
        medical_registration TEXT,
        experience_years INTEGER,
        clinic_name TEXT,
        address TEXT,
        city TEXT,
        pincode TEXT,
        lat REAL,
        lng REAL,
        phone TEXT,
        consultation_fee INTEGER,
        opening_hours TEXT,
        rating REAL,
        review_count INTEGER,
        online_consult_available BOOLEAN,
        available_slots_json TEXT,
        about TEXT
    )
    """)

    # Hospitals Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        address TEXT,
        city TEXT,
        pincode TEXT,
        lat REAL,
        lng REAL,
        emergency_phone TEXT,
        general_phone TEXT,
        trauma_center_level TEXT,
        icu_beds_available INTEGER,
        total_icu_beds INTEGER,
        oxygen_status TEXT,
        blood_bank BOOLEAN,
        ct_scan_24x7 BOOLEAN,
        burn_unit BOOLEAN,
        cath_lab BOOLEAN,
        image TEXT
    )
    """)

    # Ambulances Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ambulances (
        id TEXT PRIMARY KEY,
        unit_code TEXT NOT NULL,
        provider_name TEXT NOT NULL,
        type TEXT NOT NULL,
        driver_name TEXT,
        driver_phone TEXT,
        vehicle_number TEXT,
        current_lat REAL,
        current_lng REAL,
        status TEXT,
        base_station TEXT
    )
    """)

    # Dispatches Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dispatches (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        patient_name TEXT,
        patient_phone TEXT,
        pickup_address TEXT,
        pickup_lat REAL,
        pickup_lng REAL,
        hospital_destination TEXT,
        ambulance_id TEXT,
        ambulance_type TEXT,
        provider_name TEXT,
        status TEXT,
        eta_minutes INTEGER,
        driver_name TEXT,
        driver_phone TEXT,
        vehicle_number TEXT,
        created_at TEXT
    )
    """)

    conn.commit()
    seed_initial_data(conn)
    conn.close()

def seed_initial_data(conn):
    cursor = conn.cursor()

    # Seed default user if not exists
    cursor.execute("SELECT id FROM users WHERE email = 'rahul.patient@verahealth.ai'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (id, name, email, password_hash, role, phone, blood_group, age, consent_given, created_at)
        VALUES ('usr-101', 'Rahul Varma', 'rahul.patient@verahealth.ai', 'demo123', 'user', '+91 98450 12345', 'B+ Positive', 32, 1, ?)
        """, (datetime.utcnow().isoformat(),))

    cursor.execute("SELECT id FROM users WHERE email = 'dr.priya@verahealth.ai'")
    if not cursor.fetchone():
        cursor.execute("""
        INSERT INTO users (id, name, email, password_hash, role, phone, specialty, medical_reg, consent_given, created_at)
        VALUES ('doc-1', 'Dr. Priya Sharma', 'dr.priya@verahealth.ai', 'demo123', 'doctor', '+91 98112 44321', 'Dermatology (Skin)', 'MCI-38291 / DMC-14920', 1, ?)
        """, (datetime.utcnow().isoformat(),))

    # Seed doctors
    cursor.execute("SELECT count(*) FROM doctors")
    if cursor.fetchone()[0] == 0:
        sample_doctors = [
            (
                'doc-1', 'Dr. Priya Sharma', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
                'Dermatology (Skin)', 'dermatology', 'MBBS, MD (Dermatology, AIIMS New Delhi)', 'MCI-38291 / DMC-14920',
                14, 'Skin & Aesthetics Care Clinic', 'B-42, Greater Kailash Part 1', 'New Delhi', '110048',
                28.5492, 77.2343, '+91 98112 44321', 900, '09:00 AM - 07:00 PM (Mon - Sat)', 4.9, 312, 1,
                json.dumps(['Today 04:30 PM', 'Today 05:30 PM', 'Tomorrow 10:00 AM']),
                'Senior Consultant Dermatologist specializing in laser dermatosurgery and inflammatory skin disorders.'
            ),
            (
                'doc-2', 'Dr. Rajesh Venkataraman', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
                'Cardiology (Heart)', 'cardiology', 'MBBS, MD (Medicine), DM (Cardiology, CMC Vellore)', 'KMC-54192 / MCI-61849',
                18, 'Narayana Heart Wellness Centre', '258/A, Bommasandra Industrial Area', 'Bengaluru', '560099',
                12.8153, 77.6934, '+91 80 4969 9000', 1200, '08:30 AM - 05:00 PM (Mon - Fri)', 4.95, 480, 1,
                json.dumps(['Today 06:00 PM', 'Tomorrow 09:30 AM']),
                'Chief Interventional Cardiologist specializing in acute coronary syndromes and preventive cardiology.'
            ),
            (
                'doc-3', 'Dr. Sunita Mehta', 'https://images.unsplash.com/photo-1594824813589-3221375d0f1b?auto=format&fit=crop&q=80&w=400',
                'Pulmonology (Lungs)', 'pulmonology', 'MBBS, DNB (Respiratory Diseases, PGIMER)', 'MMC-73921 / MCI-45012',
                12, 'Apex Chest & Sleep Medicine Clinic', 'Plot 18, Sector 12, Dwarka', 'New Delhi', '110078',
                28.5921, 77.0460, '+91 11 2803 4455', 850, '10:00 AM - 06:00 PM (Mon - Sat)', 4.85, 198, 1,
                json.dumps(['Today 05:00 PM', 'Tomorrow 11:00 AM']),
                'Pulmonologist specializing in severe bronchial asthma, interstitial lung diseases, and sleep apnea.'
            ),
            (
                'doc-4', 'Dr. Arvind Swaminathan', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
                'Ophthalmology (Eyes)', 'ophthalmology', 'MBBS, MS (Ophthalmology, Sankara Nethralaya)', 'TMC-88194 / MCI-52019',
                15, 'Sankara Eye Care Excellence Centre', 'No. 7, Cathedral Road', 'Chennai', '600086',
                13.0450, 80.2510, '+91 44 2811 5000', 800, '08:30 AM - 04:30 PM (Mon - Sat)', 4.92, 340, 1,
                json.dumps(['Tomorrow 09:00 AM', 'Tomorrow 02:30 PM']),
                'Senior Cornea & Refractive Surgeon with vast experience in phacoemulsification and diabetic retinopathy.'
            ),
            (
                'doc-5', 'Dr. Meera Nambiar', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
                'General Physician', 'general', 'MBBS, MD (Internal Medicine, AIIMS)', 'DMC-29401 / MCI-33918',
                10, 'Apollo Clinic Internal Medicine Unit', '44, Connaught Circus, Central Delhi', 'New Delhi', '110001',
                28.6328, 77.2197, '+91 11 4151 3344', 700, '09:00 AM - 08:00 PM (Daily)', 4.88, 260, 1,
                json.dumps(['Today 04:00 PM', 'Today 07:00 PM', 'Tomorrow 10:00 AM']),
                'Consultant Physician specialized in fever evaluation, diabetes management, and acute infections.'
            )
        ]
        cursor.executemany("""
        INSERT INTO doctors (
            id, name, photo, specialty, specialty_id, qualifications, medical_registration,
            experience_years, clinic_name, address, city, pincode, lat, lng, phone,
            consultation_fee, opening_hours, rating, review_count, online_consult_available,
            available_slots_json, about
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_doctors)

    # Seed hospitals
    cursor.execute("SELECT count(*) FROM hospitals")
    if cursor.fetchone()[0] == 0:
        sample_hospitals = [
            (
                'hosp-1', 'All India Institute of Medical Sciences (AIIMS) Apex Trauma Center',
                'Government Autonomous Super-Specialty', 'Ring Road, Ansari Nagar East', 'New Delhi', '110029',
                28.5672, 77.2100, '+91 11 2658 8700', '+91 11 2658 8500', 'Level 1 Trauma Center (National Apex)',
                48, 85, 'Cryogenic Liquid Oxygen Tank (Normal 98% Full)', 1, 1, 1, 1,
                'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=500'
            ),
            (
                'hosp-2', 'Max Super Speciality Hospital, Saket',
                'Private NABH / JCI Accredited Tertiary Care', '1, 2, Press Enclave Marg, Saket', 'New Delhi', '110017',
                28.5284, 77.2119, '+91 11 2651 5050', '+91 11 4055 4055', 'Level 1 Comprehensive Trauma',
                22, 60, 'Continuous Piped Medical Gas Grid', 1, 1, 0, 1,
                'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=500'
            ),
            (
                'hosp-3', 'Apollo Hospitals, Greams Road',
                'Private NABH Super Speciality & Transplant Center', '21 Greams Lane, Thousand Lights', 'Chennai', '600006',
                13.0569, 80.2518, '+91 44 2829 0200', '+91 44 2829 3333', 'Level 1 Trauma Care',
                34, 75, 'Optimal Supply (Cryogenic System)', 1, 1, 1, 1,
                'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=500'
            )
        ]
        cursor.executemany("""
        INSERT INTO hospitals (
            id, name, type, address, city, pincode, lat, lng, emergency_phone,
            general_phone, trauma_center_level, icu_beds_available, total_icu_beds,
            oxygen_status, blood_bank, ct_scan_24x7, burn_unit, cath_lab, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_hospitals)

    # Seed ambulances
    cursor.execute("SELECT count(*) FROM ambulances")
    if cursor.fetchone()[0] == 0:
        sample_ambulances = [
            ('amb-1', 'AMB-UNIT-NORTH-04', 'National ERSS 112 / 108 Grid', 'Advanced Life Support (ALS)', 'Rameshwar Yadav', '+91 98765 43210', 'DL 01 EM 4092', 28.5520, 77.2280, 'AVAILABLE', 'AIIMS Apex Trauma Station'),
            ('amb-2', 'AMB-UNIT-SOUTH-02', 'StanPlus / Red Health Medical Fleet', 'Advanced Life Support (ALS)', 'Gurpreet Singh', '+91 98450 77123', 'DL 02 EM 1194', 28.5350, 77.2090, 'AVAILABLE', 'Saket District Dispatch Hub'),
            ('amb-3', 'AMB-UNIT-EAST-07', 'Ziqitza Healthcare Ltd (ZHL 108)', 'Basic Life Support (BLS)', 'Sunil Kumar', '+91 99112 88401', 'DL 04 EM 9201', 28.5720, 77.2450, 'AVAILABLE', 'Lajpat Nagar Rescue Base')
        ]
        cursor.executemany("""
        INSERT INTO ambulances (
            id, unit_code, provider_name, type, driver_name, driver_phone,
            vehicle_number, current_lat, current_lng, status, base_station
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, sample_ambulances)

    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized and verified successfully at:", DB_PATH)
