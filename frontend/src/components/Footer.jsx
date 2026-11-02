import React from 'react';
import { Activity, Phone, ShieldCheck, Heart, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Emergency Assistance Banner */}
        <div className="bg-linear-to-r from-red-950/60 to-rose-950/60 border border-red-800/40 rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-600/30">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">National Emergency Helpdesk (India)</h3>
              <p className="text-slate-400 text-sm">Immediate 24x7 government emergency dispatch & ambulance networks</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg shadow-red-900/30"
            >
              <span>Dial 112 (National SOS)</span>
            </a>
            <a
              href="tel:108"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-colors flex items-center gap-2"
            >
              <span>Dial 108 (Ambulance)</span>
            </a>
            <a
              href="tel:1075"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-colors flex items-center gap-2"
            >
              <span>1075 (Health Helpline)</span>
            </a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                Vera<span className="text-sky-400">Health</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Next-generation clinical AI healthcare platform uniting computer-vision health screening, verified doctor discovery, HD video consultations, and rapid ambulance dispatch.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act 2023 & ABDM Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Core Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveTab('screening')} className="hover:text-sky-400 transition-colors">
                  AI Health Screening (8 Systems)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('doctors')} className="hover:text-sky-400 transition-colors">
                  Find Doctors Near Me (GPS)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('consultation')} className="hover:text-sky-400 transition-colors">
                  WebRTC Video Consultation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hospitals')} className="hover:text-sky-400 transition-colors">
                  Trauma Centers & Hospitals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ambulance')} className="hover:text-sky-400 transition-colors">
                  Emergency Ambulance Fleet
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('login')} className="text-sky-400 hover:text-sky-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span>Sign In / Portal Access →</span>
                </button>
              </li>
            </ul>
          </div>

          {/* AI Systems Covered */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Screening Engines</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Skin Lesions & Dermatoscopy</li>
              <li>Eye & Retinal Fundus</li>
              <li>Dental & Periodontal Gingivitis</li>
              <li>Chest & Pulmonary Radiography</li>
              <li>Lead-II / 12-Lead ECG Waveforms</li>
              <li>Stroke FAST Neurological Triage</li>
              <li>Musculoskeletal Bone Continuity</li>
            </ul>
          </div>

          {/* Regulatory & Safety Standards */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Clinical Governance</h4>
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Statutory Medical Notice</span>
              </div>
              <p className="text-slate-400 text-xs leading-normal">
                Vera Health AI screening algorithms provide probabilistic risk stratification and educational decision-support. They do NOT constitute clinical diagnoses or replace evaluation by licensed physicians.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Vera Health AI Technologies. All rights reserved. For development and clinical demonstration.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-400 cursor-pointer">Patient Consent Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Telemedicine Practice Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
