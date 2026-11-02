import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  FileText, 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  Video, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Heart, 
  AlertTriangle,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { fetchPatientScreenings } from '../services/api';

export default function UserDashboardView({ setActiveTab }) {
  const { currentUser } = useAuth();
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact, activeDispatch, cancelDispatch } = useEmergency();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');
  const [showAddContact, setShowAddContact] = useState(false);
  const [consentGranted, setConsentGranted] = useState(true);

  // Sample past screenings
  const recentScreenings = [
    {
      id: 'SCR-49201',
      date: 'Today, 02:40 PM',
      module: 'Skin & Visible Lesions',
      findings: 'Superficial erythematous patch consistent with contact dermatitis.',
      risk: 'Low-to-Moderate',
      confidence: '74% ± 6%',
      specialist: 'Dermatologist',
    },
    {
      id: 'SCR-38104',
      date: '14 Oct 2026',
      module: 'Chest & Pulmonary Radiograph',
      findings: 'Clear bilateral lung fields without focal infiltrates or consolidation.',
      risk: 'Low',
      confidence: '92% ± 4%',
      specialist: 'Pulmonologist',
    }
  ];

  // Real patient screenings from SQLite database
  const [patientScreenings, setPatientScreenings] = useState(recentScreenings);

  useEffect(() => {
    async function loadScreenings() {
      if (currentUser?.id) {
        const res = await fetchPatientScreenings(currentUser.id);
        if (res?.screenings && res.screenings.length > 0) {
          const formatted = res.screenings.map(s => ({
            id: s.id,
            date: new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            module: s.module_key === 'skin' ? 'Skin & Visible Lesions' : s.module_key.toUpperCase() + ' Screening',
            findings: s.findings,
            risk: s.risk_level,
            confidence: s.confidence,
            specialist: s.recommended_specialist,
          }));
          setPatientScreenings(formatted);
        }
      }
    }
    loadScreenings();
  }, [currentUser]);

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: 'APT-83921',
      doctor: 'Dr. Priya Sharma',
      specialty: 'Dermatology (Skin)',
      time: 'Tomorrow, 10:00 AM',
      type: 'HD Video Consultation',
      clinic: 'Skin & Aesthetics Care Clinic',
      status: 'Confirmed',
      fee: 900,
    }
  ];

  const handleAddContactSubmit = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    addEmergencyContact({
      name: `${newContactName} (${newContactRelation})`,
      phone: newContactPhone,
      relation: newContactRelation,
    });
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Doctor Logged In Notice */}
      {currentUser?.role === 'doctor' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-emerald-950 font-bold text-sm">Physician Portal Available</h4>
              <p className="text-emerald-800 text-xs">You are currently logged in as a verified Doctor ({currentUser.name}). Switch to your Doctor Dashboard to manage OPD consults and prescriptions.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('doctor-dashboard')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Open Doctor Dashboard →
          </button>
        </div>
      )}

      {/* Unauthenticated / Guest Mode Notice */}
      {!currentUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-amber-900 font-bold text-sm">Viewing as Guest (Sample Data)</h4>
              <p className="text-amber-700 text-xs">Sign in with your patient account or ABHA ID to sync live clinical records.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('login')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Sign In to Patient Portal →
          </button>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="bg-linear-to-r from-sky-900 via-slate-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentUser?.avatar_url ? (
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/50 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-sky-300 font-bold text-2xl">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentUser?.name || 'Rahul Varma'}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full">
                {currentUser?.role === 'doctor' ? 'Physician Portal' : 'Patient Account'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentUser?.email} • Blood Group: <span className="text-white font-semibold">{currentUser?.bloodGroup || 'B+ Positive'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('screening')}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>New AI Health Check</span>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book Doctor</span>
          </button>
        </div>
      </div>

      {/* Active Dispatch Tracker if ongoing */}
      {activeDispatch && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div>
              <h3 className="font-bold text-red-950 text-sm">Active Ambulance Dispatch: {activeDispatch.requestId}</h3>
              <p className="text-xs text-red-800">
                Vehicle: {activeDispatch.vehicleNumber} • ETA: ~{activeDispatch.estimatedArrivalMinutes} mins • Heading to {activeDispatch.hospitalDestination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeDispatch.driverPhone}`}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold"
            >
              Call Driver
            </a>
            <button
              onClick={cancelDispatch}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Column (Appointments & Screenings), Right Column (Profile, Health Data, Emergency Contacts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">Upcoming Doctor Appointments</h2>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                {upcomingAppointments.length} Scheduled
              </span>
            </div>

            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-700 block">
                        {apt.specialty}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{apt.doctor}</h4>
                      <p className="text-xs text-slate-500">{apt.clinic}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
                    </span>
                    <button
                      onClick={() => setActiveTab('consultation')}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Video Call</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Screening Records History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h2 className="text-base font-bold text-slate-900">AI Screening Records & History</h2>
              </div>
              <button
                onClick={() => setActiveTab('screening')}
                className="text-xs font-bold text-sky-600 hover:underline"
              >
                + New Screening
              </button>
            </div>

            <div className="space-y-3">
              {patientScreenings.map((scr) => (
                <div key={scr.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{scr.module}</span>
                      <span className="text-[11px] text-slate-400 ml-2 font-mono">{scr.id}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{scr.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-normal">{scr.findings}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">
                        Risk: <strong className="text-slate-800">{scr.risk}</strong>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Confidence: <strong className="text-sky-700">{scr.confidence}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Health Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Digital Health Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-bold text-slate-900">{currentUser?.bloodGroup || 'B+ Positive'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Allergies:</span>
                <span className="font-bold text-rose-700">Penicillin, Peanuts</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Chronic Conditions:</span>
                <span className="font-semibold text-slate-700">None reported</span>
              </div>
            </div>

            {/* DPDP Consent Toggle */}
            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-700" /> DPDP Act 2023 Consent
                </span>
                <input
                  type="checkbox"
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-sky-900 leading-normal">
                Consent granted to securely share recent AI screening summaries with confirmed consulting clinicians.
              </p>
            </div>
          </div>

          {/* Emergency Contacts Manager */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Emergency Contacts</h3>
                <p className="text-xs text-slate-500">Auto-notified when SOS is triggered</p>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddContact && (
              <form onSubmit={handleAddContactSubmit} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Contact Name"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                />
                <input
                  type="tel"
                  required
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="Phone Number (+91)"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                />
                <select
                  value={newContactRelation}
                  onChange={(e) => setNewContactRelation(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg"
                >
                  <option>Spouse</option>
                  <option>Parent</option>
                  <option>Sibling</option>
                  <option>Physician</option>
                  <option>Friend</option>
                </select>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    className="px-3 py-1 text-slate-500 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-sky-600 text-white rounded-lg text-xs font-bold"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {emergencyContacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{c.name}</h5>
                    <span className="text-[11px] text-slate-500">{c.phone}</span>
                  </div>
                  <button
                    onClick={() => removeEmergencyContact(c.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
