import React from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  PhoneCall, 
  Building2, 
  Video, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  MapPin, 
  HeartPulse, 
  ShieldCheck, 
  Clock, 
  Users,
  ChevronRight,
  Eye,
  Smile,
  Wind,
  Brain,
  Bone,
  Bot
} from 'lucide-react';
import { AI_SCREENING_MODULES, MOCK_DOCTORS } from '../data/mockData';
import { useEmergency } from '../context/EmergencyContext';

export default function HomeView({ setActiveTab, setSelectedAiModule }) {
  const { setIsModalOpen } = useEmergency();

  const handleStartScreening = (moduleId) => {
    if (setSelectedAiModule) {
      setSelectedAiModule(moduleId);
    }
    setActiveTab('screening');
  };

  const quickSymptoms = [
    { label: 'Skin Rash or Lesion', module: 'skin' },
    { label: 'Chest Pain or Flutter', module: 'heart' },
    { label: 'Persistent Cough / Breathlessness', module: 'lungs' },
    { label: 'Blurry Vision or Eye Irritation', module: 'eyes' },
    { label: 'Toothache / Bleeding Gums', module: 'dental' },
    { label: 'Joint Pain or Suspected Fracture', module: 'bones' },
    { label: 'Severe Headache / Dizziness', module: 'brain' },
    { label: 'Fever, Fatigue & Body Ache', module: 'general' },
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-tr from-sky-200/40 via-cyan-100/30 to-rose-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-4 h-4 text-sky-600 animate-spin-slow" />
              <span>Next-Generation Healthcare Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Health, <span className="bg-linear-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">Smarter</span> and <span className="underline decoration-sky-400 decoration-wavy decoration-2">Closer to You.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              A comprehensive healthcare platform integrating calibrated clinical AI screening across 8 body systems, verified doctor discovery, HD video consultations, and rapid emergency ambulance dispatch.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="px-6 py-3.5 rounded-xl bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Doctor (ChatGPT)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('screening')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 font-bold text-sm shadow-xs transition-all hover:border-sky-400 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>AI Health Screening</span>
              </button>

              <button
                onClick={() => setActiveTab('doctors')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all hover:border-slate-400 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <span>Find Doctors Near Me</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer animate-sos"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Emergency Ambulance (112)</span>
              </button>
            </div>

            {/* Clinical Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>MCI / NMC Verified Doctors Only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>DPDP 2023 Consent-Protected Data</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Delayed Emergency Dispatch</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Quick Symptom Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">What health concern are you experiencing today?</h2>
              <p className="text-xs text-slate-500 mt-1">Select a concern for instant AI triage & specialist recommendation</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
              Interactive Triage
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickSymptoms.map((sym, idx) => (
              <button
                key={idx}
                onClick={() => handleStartScreening(sym.module)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-500 bg-slate-50/60 hover:bg-sky-50/50 text-left transition-all hover:shadow-sm group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                    {sym.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1" />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Tap to launch AI screener →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Dedicated AI Screening Engines Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            8 Specialized Medical AI Screening Modules
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built with computer vision and clinical probability calibration for rapid, non-invasive preliminary evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AI_SCREENING_MODULES.map((mod) => (
            <div
              key={mod.id}
              onClick={() => handleStartScreening(mod.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    {mod.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{mod.bodyPart}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 group-hover:underline">
                  Launch Screener
                </span>
                <ArrowRight className="w-4 h-4 text-sky-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Overview Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-linear-to-br from-sky-50 to-cyan-50 rounded-3xl p-6 border border-sky-100">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-sky-600/30">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Doctor Discovery</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Find specialists by GPS proximity or city PIN code. Verified registration numbers from State Medical Councils & NMC. Real consultation fees & patient reviews.
            </p>
            <button
              onClick={() => setActiveTab('doctors')}
              className="mt-4 text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
            >
              Search Doctors <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-indigo-600/30">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">HD WebRTC Video Consult</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Encrypted, private audio/video teleconsultations. Attach AI screening findings and medical history with explicit patient consent. Digital prescription generation.
            </p>
            <button
              onClick={() => setActiveTab('consultation')}
              className="mt-4 text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
            >
              Start Consultation Room <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-linear-to-br from-red-50 to-rose-50 rounded-3xl p-6 border border-red-100">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-4 shadow-sm shadow-red-600/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Emergency SOS & Fleet</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Direct connection to India's national emergency 112/108 response. Real-time GPS ambulance dispatch with Advanced Life Support (ALS) tracking and live ETA.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
            >
              Trigger SOS / Ambulance <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Verified Doctors Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Top Rated Verified Clinicians</h2>
            <p className="text-xs text-slate-500 mt-1">Directly vetted credentials, degrees, and hospital affiliations</p>
          </div>
          <button
            onClick={() => setActiveTab('doctors')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 self-start sm:self-auto"
          >
            View All Clinicians <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_DOCTORS.slice(0, 4).map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow">
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={doc.photo}
                  alt={doc.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-600 border border-amber-200 shadow-xs flex items-center gap-1">
                  ★ {doc.rating} ({doc.reviewCount})
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wide">
                  {doc.specialty}
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{doc.name}</h4>
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{doc.medicalRegistration}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{doc.clinicName}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">₹{doc.consultationFee}</span>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
