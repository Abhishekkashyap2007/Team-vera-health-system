import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Stethoscope, 
  Truck, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  BarChart3, 
  Server, 
  Lock,
  Search,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'ai_models' | 'audit_logs'

  // Pending Doctor Verification Queue
  const [pendingDoctors, setPendingDoctors] = useState([
    {
      id: 'doc-pen-1',
      name: 'Dr. Vivek Mehra',
      specialty: 'Cardiology',
      councilReg: 'DMC-84920 (Delhi Medical Council)',
      degree: 'MBBS, DM Cardiology (AIIMS New Delhi)',
      experienceYears: 11,
      submissionDate: 'Today, 11:15 AM',
      status: 'PENDING_AUDIT',
    },
    {
      id: 'doc-pen-2',
      name: 'Dr. Neha Kulkarni',
      specialty: 'Pulmonology',
      councilReg: 'MMC-62194 (Maharashtra Medical Council)',
      degree: 'MBBS, MD Chest Medicine (KEM Mumbai)',
      experienceYears: 9,
      submissionDate: 'Yesterday, 04:20 PM',
      status: 'PENDING_AUDIT',
    }
  ]);

  const [verifiedList, setVerifiedList] = useState([
    { name: 'Dr. Priya Sharma', reg: 'MCI-38291', status: 'VERIFIED_ACTIVE' },
    { name: 'Dr. Rajesh Venkataraman', reg: 'KMC-54192', status: 'VERIFIED_ACTIVE' },
  ]);

  // AI Model Performance Monitoring Metrics
  const aiModelMetrics = [
    { module: 'Skin Lesion Classifier', version: 'v4.2.1-ResNet', accuracy: '94.8%', sensitivity: '96.2%', latencyMs: '184ms', status: 'HEALTHY' },
    { module: 'Retinal Fundus Screener', version: 'v3.8.0-DenseNet', accuracy: '93.5%', sensitivity: '95.1%', latencyMs: '220ms', status: 'HEALTHY' },
    { module: 'Dental & Gum Screener', version: 'v2.4.0-MobileNet', accuracy: '91.2%', sensitivity: '92.4%', latencyMs: '142ms', status: 'HEALTHY' },
    { module: 'Chest Radiograph Screener', version: 'v5.1.0-CheXNet', accuracy: '95.6%', sensitivity: '97.4%', latencyMs: '310ms', status: 'HEALTHY' },
    { module: 'Lead-II ECG Waveform AI', version: 'v4.0.2-1D-CNN', accuracy: '96.1%', sensitivity: '98.0%', latencyMs: '95ms', status: 'HEALTHY' },
    { module: 'Brain FAST Neuro Screener', version: 'v3.1.0-FastTriage', accuracy: '97.2%', sensitivity: '99.1%', latencyMs: '110ms', status: 'HEALTHY' },
    { module: 'Musculoskeletal Bone Screener', version: 'v3.5.0-BoneNet', accuracy: '92.9%', sensitivity: '94.6%', latencyMs: '265ms', status: 'HEALTHY' },
  ];

  // Audit Logs
  const auditLogs = [
    { timestamp: '2026-10-20 19:42:10', actor: 'SYSTEM_ROUTER', action: 'EMERGENCY_AMBULANCE_DISPATCH', detail: 'Ambulance DL 01 EM 4092 deployed to Connaught Place' },
    { timestamp: '2026-10-20 19:35:04', actor: 'Dr. Priya Sharma (MCI-38291)', action: 'PATIENT_RECORD_ACCESSED', detail: 'Consent token #CN-9201 verified for patient Rahul Varma' },
    { timestamp: '2026-10-20 19:12:44', actor: 'ADMIN_GOVERNANCE', action: 'AI_MODEL_CALIBRATION_CHECK', detail: 'Monte-Carlo dropout uncertainty verified on 8 screening pipelines' },
    { timestamp: '2026-10-20 18:55:12', actor: 'SYSTEM_AUTH', action: 'DPDP_CONSENT_GRANTED', detail: 'Explicit DPDP consent recorded for user rahul.patient@verahealth.ai' },
  ];

  const handleApprove = (id) => {
    const doc = pendingDoctors.find(d => d.id === id);
    if (doc) {
      setVerifiedList(prev => [...prev, { name: doc.name, reg: doc.councilReg, status: 'VERIFIED_ACTIVE' }]);
      setPendingDoctors(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleReject = (id) => {
    setPendingDoctors(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold text-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clinical Governance & Admin Portal</h1>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full">
                Root Security Level
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Medical Council License Vetting • AI Inference Metrics • DPDP & ABDM Audit Trail
            </p>
          </div>
        </div>

        {/* Global Platform Counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Clinicians</span>
            <span className="text-lg font-black text-emerald-400">1,248</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Fleet</span>
            <span className="text-lg font-black text-sky-400">340 ALS/BLS</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">AI Uptime</span>
            <span className="text-lg font-black text-cyan-400">99.98%</span>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-2xs text-xs font-bold text-slate-600 max-w-xl">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex-1 py-2.5 rounded-xl text-center transition-all ${
            activeTab === 'verifications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          Doctor Credential Vetting ({pendingDoctors.length})
        </button>
        <button
          onClick={() => setActiveTab('ai_models')}
          className={`flex-1 py-2.5 rounded-xl text-center transition-all ${
            activeTab === 'ai_models'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          AI Screening Models Health
        </button>
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`flex-1 py-2.5 rounded-xl text-center transition-all ${
            activeTab === 'audit_logs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:text-slate-900'
          }`}
        >
          Security Audit Trail
        </button>
      </div>

      {/* TAB 1: Doctor Verification Workflow */}
      {activeTab === 'verifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">State Medical Council License Verification Queue</h3>
                <p className="text-xs text-slate-500">Cross-verified against NMC & State Medical Council registers before allowing patient bookings</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                {pendingDoctors.length} Awaiting Verification
              </span>
            </div>

            {pendingDoctors.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                ✓ All doctor registration certificates and NMC licenses are currently vetted.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDoctors.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{doc.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{doc.degree} • {doc.specialty}</p>
                        <span className="text-xs font-mono font-bold text-sky-700">{doc.councilReg}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200"
                        >
                          Reject Application
                        </button>
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-2xs"
                        >
                          Approve & Issue Badge
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI Screening Models Health */}
      {activeTab === 'ai_models' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Clinical AI Pipeline Benchmarks & Inference Telemetry</h3>
              <p className="text-xs text-slate-500">Live latency, validation accuracy, and calibrated clinical sensitivity across all 8 screening pipelines</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              7 Active Engines
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Module Name</th>
                  <th className="p-3">Architecture / Model</th>
                  <th className="p-3">Validation Accuracy</th>
                  <th className="p-3">Clinical Sensitivity</th>
                  <th className="p-3">Avg Latency</th>
                  <th className="p-3">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {aiModelMetrics.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-3 font-bold text-slate-900">{m.module}</td>
                    <td className="p-3 font-mono text-slate-600">{m.version}</td>
                    <td className="p-3 text-emerald-700 font-bold">{m.accuracy}</td>
                    <td className="p-3 text-sky-700 font-bold">{m.sensitivity}</td>
                    <td className="p-3 font-mono text-slate-700">{m.latencyMs}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">DPDP 2023 & Clinical Audit Log</h3>
            <p className="text-xs text-slate-500">Tamper-evident system activity, patient consent verification, and dispatch telemetry</p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map((log, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{log.timestamp}</span>
                  <span className="font-bold text-sky-700">{log.action}</span>
                </div>
                <div className="font-semibold text-slate-800">{log.detail}</div>
                <div className="text-[11px] text-slate-500">Actor: {log.actor}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
