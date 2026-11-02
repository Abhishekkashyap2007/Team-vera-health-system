import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  BriefcaseMedical,
  Truck,
  Shield,
  KeyRound
} from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ setActiveTab }) {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    register, 
    switchRole 
  } = useAuth();

  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+ Positive');
  const [medicalRegNumber, setMedicalRegNumber] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);
  const [resetSent, setResetSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (authModalTab === 'forgot') {
      if (!email) {
        setErrorMessage('Please enter your email address to receive password reset link.');
        return;
      }
      setResetSent(true);
      return;
    }

    const targetDashboard = role === 'doctor' ? 'doctor-dashboard' : role === 'admin' ? 'admin-dashboard' : role === 'ambulance' ? 'ambulance' : 'user-dashboard';

    if (authModalTab === 'login') {
      login(email, password, role);
      setAuthModalOpen(false);
      if (setActiveTab) setActiveTab(targetDashboard);
    } else {
      if (!consentGiven) {
        setErrorMessage('Consent to processing health data is required under the DPDP Act 2023.');
        return;
      }
      register({
        name,
        email,
        phone,
        role,
        bloodGroup,
        medicalRegNumber,
        consentGiven,
      });
      setAuthModalOpen(false);
      if (setActiveTab) setActiveTab(targetDashboard);
    }
  };

  const handleQuickDemoLogin = (selectedRole) => {
    switchRole(selectedRole);
    setAuthModalOpen(false);
    const targetDashboard = selectedRole === 'doctor' ? 'doctor-dashboard' : selectedRole === 'admin' ? 'admin-dashboard' : selectedRole === 'ambulance' ? 'ambulance' : 'user-dashboard';
    if (setActiveTab) setActiveTab(targetDashboard);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight">
              {authModalTab === 'login' && 'Sign In to Vera Health'}
              {authModalTab === 'register' && 'Create Your Health Account'}
              {authModalTab === 'forgot' && 'Reset Your Password'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure role-based access for patients, physicians, and emergency fleets
            </p>
          </div>
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => { setAuthModalTab('login'); setResetSent(false); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              authModalTab === 'login' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthModalTab('register'); setResetSent(false); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              authModalTab === 'register' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
          <button
            onClick={() => { setAuthModalTab('forgot'); setResetSent(false); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              authModalTab === 'forgot' ? 'border-sky-600 text-sky-600 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Forgot Password
          </button>
        </div>


        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {resetSent ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Reset Link Sent</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                If an account exists for <span className="font-semibold text-slate-800">{email}</span>, a secure password reset link has been dispatched.
              </p>
              <button
                type="button"
                onClick={() => { setAuthModalTab('login'); setResetSent(false); }}
                className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Role Selector (visible in Login & Register) */}
              {authModalTab !== 'forgot' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Account Role</label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { id: 'user', label: 'Patient' },
                      { id: 'doctor', label: 'Doctor' },
                      { id: 'ambulance', label: 'Ambulance' },
                      { id: 'admin', label: 'Admin' },
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`py-2 px-1 rounded-xl text-center border font-semibold transition-all ${
                          role === r.id
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Extra Fields */}
              {authModalTab === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone (+91)</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      >
                        <option>A+ Positive</option>
                        <option>A- Negative</option>
                        <option>B+ Positive</option>
                        <option>B- Negative</option>
                        <option>O+ Positive</option>
                        <option>O- Negative</option>
                        <option>AB+ Positive</option>
                        <option>AB- Negative</option>
                      </select>
                    </div>
                  </div>

                  {role === 'doctor' && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        State Medical Council / MCI / NMC Reg. No.
                      </label>
                      <input
                        type="text"
                        required
                        value={medicalRegNumber}
                        onChange={(e) => setMedicalRegNumber(e.target.value)}
                        placeholder="e.g. MCI-48192 or DMC-23941"
                        className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password */}
              {authModalTab !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    {authModalTab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalTab('forgot')}
                        className="text-[11px] text-sky-600 hover:underline font-semibold"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* DPDP Act 2023 Consent Checkbox for registration */}
              {authModalTab === 'register' && (
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>
                    I provide explicit consent under the <strong>DPDP Act 2023</strong> for Vera Health to store my health records and share screening metrics with consulting clinicians upon appointment confirmation.
                  </span>
                </label>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {authModalTab === 'login' && 'Sign In to Portal'}
                  {authModalTab === 'register' && 'Complete Registration'}
                  {authModalTab === 'forgot' && 'Send Password Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Full Page Link */}
          {setActiveTab && (
            <div className="pt-2 text-center border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalOpen(false);
                  setActiveTab('login');
                }}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold inline-flex items-center gap-1.5"
              >
                <span>Prefer a dedicated full page? Open Full Login Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
