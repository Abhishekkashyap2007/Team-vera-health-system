import requests

BASE_URL = "http://localhost:8000"

def test_all():
    # 1. Health
    r = requests.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("[OK] /api/health passed")

    # 2. Google Auth
    payload = {
        "userInfo": {
            "email": "alex.chen.patient@gmail.com",
            "name": "Alex Chen",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
        },
        "role": "user"
    }
    r = requests.post(f"{BASE_URL}/api/auth/google", json=payload)
    assert r.status_code == 200, f"Google auth failed: {r.text}"
    res = r.json()
    assert res["success"] is True
    assert res["user"]["email"] == "alex.chen.patient@gmail.com"
    token = res["token"]
    print(f"[OK] /api/auth/google passed (User: {res['user']['name']}, Role: {res['user']['role']})")

    # 3. Doctors API
    r = requests.get(f"{BASE_URL}/api/doctors?specialty=dermatology")
    assert r.status_code == 200
    docs = r.json()["doctors"]
    assert len(docs) > 0
    print(f"[OK] /api/doctors passed (Found {len(docs)} dermatologists)")

    # 4. Hospitals API
    r = requests.get(f"{BASE_URL}/api/hospitals")
    assert r.status_code == 200
    hosps = r.json()["hospitals"]
    assert len(hosps) > 0
    print(f"[OK] /api/hospitals passed (Found {len(hosps)} hospitals)")

    # 5. AI Screening API
    screen_data = {
        "module_key": "skin",
        "symptoms": "Itchy red rash on forearm with mild scaling for 3 days",
        "duration": "3 days",
        "severity": "Mild",
        "user_id": res["user"]["id"]
    }
    r = requests.post(f"{BASE_URL}/api/ai/screen", data=screen_data)
    assert r.status_code == 200, f"Screening failed: {r.text}"
    screen_res = r.json()
    assert "conditions" in screen_res
    print(f"[OK] /api/ai/screen passed (Diagnosis: {screen_res['conditions'][0]['name']}, Risk: {screen_res['riskLevel']})")

    # 6. Patient Screenings retrieval
    r = requests.get(f"{BASE_URL}/api/patient/screenings?user_id={res['user']['id']}")
    assert r.status_code == 200
    patient_records = r.json()["screenings"]
    assert len(patient_records) > 0
    print(f"[OK] /api/patient/screenings passed (Retrieved {len(patient_records)} saved screenings for patient)")

    # 7. Ambulance Dispatch
    dispatch_data = {
        "patientName": "Alex Chen",
        "patientPhone": "+91 98450 12345",
        "pickupAddress": "Connaught Place, New Delhi",
        "pickupLat": 28.6328,
        "pickupLng": 77.2197,
        "hospitalDestination": "AIIMS Apex Trauma Center"
    }
    r = requests.post(f"{BASE_URL}/api/ambulance/dispatch", json=dispatch_data)
    assert r.status_code == 200
    dispatch_res = r.json()
    assert dispatch_res["success"] is True
    dispatch_id = dispatch_res["requestId"]
    print(f"[OK] /api/ambulance/dispatch passed (Assigned: {dispatch_res['vehicleNumber']}, ETA: {dispatch_res['estimatedArrivalMinutes']} mins)")

    # 8. Dispatch Telemetry
    r = requests.get(f"{BASE_URL}/api/ambulance/status/{dispatch_id}")
    assert r.status_code == 200
    print("[OK] /api/ambulance/status passed")

    # 9. ChatGPT-Style Medical Q&A
    r = requests.post(f"{BASE_URL}/api/ai/ask", json={"question": "What should I do for a mild fever and sore throat?"})
    assert r.status_code == 200
    qa_res = r.json()
    assert qa_res["success"] is True
    assert "answer" in qa_res
    print(f"[OK] /api/ai/ask passed (Answer formatted in ChatGPT style, specialist: {qa_res.get('specialist')})")

    print("\nALL 9 BACKEND AND AI HEALTHCARE SERVICES VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
