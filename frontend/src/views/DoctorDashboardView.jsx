import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Building, 
  Sparkles, 
  Eye, 
  ChevronRight,
  Settings,
  Bell,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DoctorDashboardView({ setActiveTab }) {
  const { currentUser } = useAuth();
  const [isAvailableOnline, setIsAvailableOnline] = useState(true);
  const [consultationFee, setConsultationFee] = useState(900);
  const [selectedPatientReport, setSelectedPatientReport] = useState(null);

  const incomingAppointments = [
    {
      id: 'APT-1092',
      patientName: 'Rahul Varma (32M)',
      time: 'Today, 04:30 PM',
      type: 'Video Teleconsultation',
      reason: 'Erythematous rash on arm, itching 4 days',
      hasAiReport: true,
      aiReportId: 'SCR-49201',
      aiSummary: 'Superficial erythematous patch consistent with contact dermatitis (74% confidence ± 6%)',
      status: 'Ready for Call',
    },
    {
      id: 'APT-1095',
      patientName: 'Sunita Mehra (48F)',
      time: 'Today, 05:30 PM',
      type: 'In-Clinic Physical OPD',
      reason: 'Routine skin pigmentation & melasma check',
      hasAiReport: false,
      status: 'Confirmed',
    },
    {
      id: 'APT-1102',
      patientName: 'Karthik Rao (26M)',
      time: 'Tomorrow, 10:00 AM',
      type: 'Video Teleconsultation',
      reason: 'Acne vulgaris follow-up and topical retinoid adjustment',
      hasAiReport: true,
      aiReportId: 'SCR-58190',
      aiSummary: 'Mild inflammatory acne papules; low pustular score',
      status: 'Scheduled',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Patient Mode Notice */}
      {currentUser?.role === 'user' && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sky-950 font-bold text-sm">Viewing Doctor Portal as Patient</h4>
              <p className="text-sky-800 text-xs">You are currently logged in with a Patient account ({currentUser.name}). Switch back to your Personal Health Dashboard to view your vitals, medical records, and appointments.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('user-dashboard')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Go to Patient Dashboard →
          </button>
        </div>
      )}

      {/* Top Banner: Doctor Profile & Credentials */}
      <div className="bg-linear-to-r from-emerald-950 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-2xl">
            🩺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentUser?.name || 'Dr. Priya Sharma'}
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Clinician
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentUser?.specialty || 'General Medicine / Specialist'} • NMC Reg: <span className="text-white font-mono font-semibold">{currentUser?.medicalRegistration || 'MCI-38291 / DMC-14920'}</span>
            </p>
          </div>
        </div>

        {/* Online Status Toggle */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <span className="text-xs font-semibold text-slate-200 pl-2">Teleconsult Availability:</span>
          <button
            onClick={() => setIsAvailableOnline(!isAvailableOnline)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              isAvailableOnline
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/50'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAvailableOnline ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{isAvailableOnline ? 'Active / Online' : 'Offline / In Clinic'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Incoming Appointments & Consented AI Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Appointments List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Today's Consultation Schedule</h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {incomingAppointments.length} Patient Bookings
              </span>
            </div>

            <div className="space-y-3">
              {incomingAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{apt.patientName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.reason}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {apt.type}
                    </span>
                  </div>

                  {apt.hasAiReport && (
                    <div className="p-2.5 bg-sky-50/80 rounded-xl border border-sky-200 text-xs text-sky-950 flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Attached AI Screening ({apt.aiReportId}):</span>
                          <p className="text-[11px] text-sky-900 mt-0.5">{apt.aiSummary}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPatientReport(apt)}
                        className="text-xs font-bold text-sky-700 hover:underline shrink-0"
                      >
                        Review
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
                    </span>
                    {apt.type.includes('Video') ? (
                      <button
                        onClick={() => setActiveTab('consultation')}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <Video className="w-3.5 h-3.5" /> Launch Video Room
                      </button>
                    ) : (
                      <span className="text-slate-500 font-semibold text-xs">Clinic Reception Checked</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Practice Settings & Quick Patient AI Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Clinic & Practice Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Clinic & Practice Configuration</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-800">Primary Practice:</span>
                  <p className="text-slate-500 text-[11px]">B-42, Greater Kailash Part 1, New Delhi</p>
                </div>
                <Building className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800">Consultation Fee (₹):</span>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-24 text-right p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] leading-normal flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All patient medical records and AI screenings are accessed under explicit consent with tamper-evident audit logging.
                </span>
              </div>
            </div>
          </div>

          {/* Selected Patient AI Report Modal / Quick Viewer */}
          {selectedPatientReport && (
            <div className="bg-white rounded-3xl p-6 border border-sky-300 shadow-sm space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wide">
                  Patient Consented Screening File
                </span>
                <button
                  onClick={() => setSelectedPatientReport(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedPatientReport.patientName} • {selectedPatientReport.aiReportId}
              </h4>
              <p className="text-xs text-slate-700 bg-sky-50/70 p-3 rounded-xl border border-sky-100">
                {selectedPatientReport.aiSummary}
              </p>
              <button
                onClick={() => setActiveTab('consultation')}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500"
              >
                Open Video Consultation Room
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
