import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Truck, 
  Shield, 
  KeyRound, 
  Smartphone, 
  Fingerprint, 
  Star, 
  Award, 
  HeartPulse, 
  Check, 
  ArrowLeft, 
  RefreshCw,
  QrCode,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth, ROLES } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';

export default function LoginView({ setActiveTab }) {
  const { currentUser, login, register, switchRole, logout, loginWithGoogle } = useAuth();
  const { setIsModalOpen } = useEmergency();

  // Mode: 'login' | 'register' | 'forgot' | 'otp'
  const [authMode, setAuthMode] = useState('login');
  
  // Selected role for login/signup: 'user' | 'doctor' | 'ambulance' | 'admin'
  const [selectedRole, setSelectedRole] = useState('user');

  // Google Auth Modal & State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleAuthFlow, setGoogleAuthFlow] = useState('login'); // 'login' | 'signup'
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleRole, setGoogleRole] = useState('user');
  
  // Login method: 'password' | 'abha'
  const [loginMethod, setLoginMethod] = useState('password');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration specific states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+ Positive');
  const [age, setAge] = useState('32');
  const [specialty, setSpecialty] = useState('Dermatology (Skin)');
  const [medicalRegNumber, setMedicalRegNumber] = useState('');
  const [fleetUnitId, setFleetUnitId] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(true);

  // ABHA / OTP simulation states
  const [abhaId, setAbhaId] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Status and feedback states
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill fields if user switches role
  const roleMetadata = {
    user: {
      title: 'Patient Portal',
      subtitle: 'Access clinical AI screenings, medical records & video consultations',
      icon: User,
      color: 'from-sky-500 to-cyan-500',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      demoEmail: 'rahul.patient@verahealth.ai',
      demoName: 'Rahul Varma',
      redirectTab: 'user-dashboard',
      features: [
        'AI screening history across 8 body systems',
        'Direct 1-click HD video consultations',
        'Ayushman Bharat ABHA Health Locker sync',
        'Priority emergency ambulance dispatch'
      ]
    },
    doctor: {
      title: 'Physician & Specialist Portal',
      subtitle: 'Manage OPD consultations, WebRTC teleconsults & digital prescriptions',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      demoEmail: 'dr.priya@verahealth.ai',
      demoName: 'Dr. Priya Sharma (MD Dermatology)',
      redirectTab: 'doctor-dashboard',
      features: [
        'Verified MCI/NMC clinical license badge',
        'Live patient video queue & screen sharing',
        'AI-assisted clinical diagnostic co-pilot',
        'E-Prescription & digital signature generator'
      ]
    },
    ambulance: {
      title: 'Emergency Fleet & Dispatcher',
      subtitle: '112 / 108 Emergency Grid telemetry & rapid ALS/BLS navigation',
      icon: Truck,
      color: 'from-amber-500 to-red-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      demoEmail: 'dispatch@emergency112.gov.in',
      demoName: 'National Dispatcher #42',
      redirectTab: 'ambulance',
      features: [
        'Real-time GPS emergency SOS dispatch queue',
        'Paramedic vitals telemetry & hospital handover',
        'Automated live route & trauma bay alerts',
        'Zero-latency emergency SOS bridge'
      ]
    },
    admin: {
      title: 'Hospital & Compliance Admin',
      subtitle: 'Clinical governance, audit trails & DPDP Act 2023 compliance',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      demoEmail: 'admin@verahealth.ai',
      demoName: 'Dr. Ananya Sen (Chief Administrator)',
      redirectTab: 'admin-dashboard',
      features: [
        'DPDP Act 2023 patient consent audit logs',
        'Multi-hospital bed availability network',
        'AI algorithm safety calibration metrics',
        'Institutional access control & governance'
      ]
    }
  };

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Dynamic Password Strength Meter
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'Not entered', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-sky-500' };
      case 4:
        return { score: 100, label: 'Strong & Secure', color: 'bg-emerald-500' };
      default:
        return { score: 15, label: 'Very Weak', color: 'bg-red-400' };
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti fails
    }
  };

  // Quick 1-Click Demo Login
  const handleDemoLogin = (roleKey) => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: `Signing in as verified ${roleKey}...` });

    setTimeout(() => {
      switchRole(roleKey);
      setIsLoading(false);
      triggerCelebration();
      const targetTab = roleMetadata[roleKey]?.redirectTab || 'user-dashboard';
      setActiveTab(targetTab);
    }, 450);
  };

  // Google OAuth submission (handles both login and sign up)
  const handleGoogleAuthSubmit = async () => {
    if (!googleEmail || !googleEmail.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid Google or Gmail address.' });
      return;
    }
    if (!googlePassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your Google account password.' });
      return;
    }

    setIsLoading(true);

    const selectedEmail = googleEmail.trim().toLowerCase();
    const roleToUse = googleRole || selectedRole;
    const defaultName = selectedEmail
      .split('@')[0]
      .split(/[._-]/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
    const rawName = googleName.trim() || defaultName;
    const selectedName = roleToUse === 'doctor' && !rawName.startsWith('Dr')
      ? `Dr. ${rawName}`
      : rawName;
    const selectedAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedEmail)}`;

    try {
      setStatusMessage({ type: 'info', text: `Authenticating with Google Account (${selectedEmail})...` });
      const res = await loginWithGoogle({
        email: selectedEmail,
        name: selectedName,
        avatar_url: selectedAvatar,
      }, roleToUse);

      setIsLoading(false);
      setIsGoogleModalOpen(false);

      if (res?.success) {
        triggerCelebration();
        const targetTab = roleMetadata[roleToUse]?.redirectTab || 'user-dashboard';
        setActiveTab(targetTab);
      } else {
        setStatusMessage({ type: 'error', text: res?.error || 'Failed to authenticate with Google.' });
      }
    } catch (err) {
      setIsLoading(false);
      setStatusMessage({ type: 'error', text: err.message || 'Google authentication error.' });
    }
  };

  // Submit standard login form
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!email) {
      setStatusMessage({ type: 'error', text: 'Please enter your registered email address or phone number.' });
      return;
    }
    if (!password) {
      setStatusMessage({ type: 'error', text: 'Please enter your account password.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password, selectedRole);
      setIsLoading(false);
      triggerCelebration();
      const targetTab = roleMetadata[selectedRole]?.redirectTab || 'user-dashboard';
      setActiveTab(targetTab);
    } catch (err) {
      setIsLoading(false);
      setStatusMessage({ type: 'error', text: 'Authentication failed: ' + (err?.message || 'Please check your credentials.') });
    }
  };

  // Submit Registration form
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide your full legal name.' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid email address.' });
      return;
    }
    if (!password || password.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please verify.' });
      return;
    }
    if (!dpdpConsent) {
      setStatusMessage({ type: 'error', text: 'Consent to processing health data is required under the DPDP Act 2023.' });
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        name: fullName,
        email,
        password,
        phone: phone || '+91 98450 12345',
        role: selectedRole,
        bloodGroup,
        specialty,
        medicalRegNumber,
        fleetUnitId,
        consentGiven: dpdpConsent,
      });

      setIsLoading(false);
      triggerCelebration();
      const targetTab = roleMetadata[selectedRole]?.redirectTab || 'user-dashboard';
      setActiveTab(targetTab);
    } catch (err) {
      setIsLoading(false);
      setStatusMessage({ type: 'error', text: 'Registration error: ' + (err?.message || 'Could not complete signup.') });
    }
  };

  // Handle OTP Digit Input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto advance
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSendOtp = () => {
    if (!abhaId && !phone) {
      setStatusMessage({ type: 'error', text: 'Please enter your 14-digit ABHA Number or Mobile number.' });
      return;
    }
    setOtpSent(true);
    setCountdown(30);
    setStatusMessage({ type: 'success', text: 'OTP sent! Simulation code is: 1 2 3 4 5 6' });
  };

  const handleVerifyOtp = () => {
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setStatusMessage({ type: 'error', text: 'Please enter all 6 digits of the verification OTP.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email || 'abha.patient@verahealth.ai', 'otp-authenticated', selectedRole);
      setIsLoading(false);
      triggerCelebration();
      setActiveTab(roleMetadata[selectedRole]?.redirectTab || 'user-dashboard');
    }, 600);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setStatusMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStatusMessage({ 
        type: 'success', 
        text: `Password reset link and security verification dispatched to ${email}. Check your inbox!` 
      });
    }, 600);
  };

  const pwdStrength = getPasswordStrength(password);
  const CurrentRoleIcon = roleMetadata[selectedRole].icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Bar with Brand and Quick Action */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-sky-400 transition-colors">
                Vera<span className="text-sky-400">Health</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Security Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Unified Clinical AI & Emergency Gateway</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to</span> Home
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-colors animate-sos"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>112 SOS</span>
          </button>
        </div>
      </div>

      {/* Main Center Stage Split Container */}
      <div className="max-w-7xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Brand, Trust Proof & Features */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-sky-500/10 to-cyan-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Ayushman Bharat & DPDP Act 2023 Compliant</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Verified Backend & AI Engine Active</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Intelligent healthcare, <br />
              <span className="bg-linear-to-r from-sky-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                secured for life.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Sign in to manage clinical AI screenings, consult top medical specialists over HD WebRTC, and access instant emergency ambulance dispatch.
            </p>

            {/* Dynamic Role Capability Highlights */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg bg-linear-to-tr ${roleMetadata[selectedRole].color} flex items-center justify-center text-white`}>
                    <CurrentRoleIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-sm">{roleMetadata[selectedRole].title}</h2>
                    <p className="text-slate-400 text-[11px]">{roleMetadata[selectedRole].subtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedRole}
                </span>
              </div>

              <ul className="space-y-2">
                {roleMetadata[selectedRole].features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Trust Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-lg font-black text-white">99.4%</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">AI Diagnostic Concordance</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-lg font-black text-white">12 Min</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">Avg Ambulance Dispatch</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center">
                <div className="text-lg font-black text-white">256-Bit</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">End-to-End Encryption</div>
              </div>
            </div>

            {/* Verified Testimonial Snippet */}
            <div className="bg-linear-to-r from-sky-950/40 to-slate-900/80 border border-sky-900/30 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-600/30 border border-sky-400/40 flex items-center justify-center text-sky-300 font-bold text-sm shrink-0">
                P
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-bold">Dr. Priya Sharma</span>
                  <span className="text-slate-400 text-[10px]">• MD AIIMS, Dermatology</span>
                </div>
                <p className="text-slate-300 text-xs italic leading-relaxed">
                  "The AI health screening tool gives patients clear preliminary context, while our WebRTC OPD connects us with zero friction."
                </p>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1 font-semibold">5.0 Clinical Rating</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Login & Registration Card */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
              
              {/* Card Top Header Banner */}
              <div className="bg-linear-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-6 sm:px-8 py-6 border-b border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                      {authMode === 'login' && 'Sign In to Your Account'}
                      {authMode === 'register' && 'Create Your Health Account'}
                      {authMode === 'forgot' && 'Account Recovery & Password Reset'}
                      {authMode === 'otp' && 'ABHA / Mobile OTP Verification'}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      {authMode === 'login' && 'Select your role and authenticate via email, ABHA ID or instant demo profile.'}
                      {authMode === 'register' && 'Join VeraHealth for AI triage, specialist consultations, and emergency dispatch.'}
                      {authMode === 'forgot' && 'Enter your registered email or phone to receive a secure login link.'}
                      {authMode === 'otp' && 'Enter the 6-digit code sent to your registered Ayushman Bharat mobile.'}
                    </p>
                  </div>

                  {/* Mode Toggle Tabs (Sign In vs Register) */}
                  {authMode !== 'forgot' && authMode !== 'otp' && (
                    <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/80 shrink-0">
                      <button
                        onClick={() => { setAuthMode('login'); setStatusMessage({ type: '', text: '' }); }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          authMode === 'login'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => { setAuthMode('register'); setStatusMessage({ type: '', text: '' }); }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          authMode === 'register'
                            ? 'bg-sky-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>

                {/* Member Portal Guidance Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-sky-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Select any member role & enter your own credentials:</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">Patient</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">Doctor</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">Fleet</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">Admin</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Status / Alert Feedback Message */}
                {statusMessage.text && (
                  <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200 ${
                    statusMessage.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : statusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}>
                    {statusMessage.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{statusMessage.text}</span>
                  </div>
                )}

                {/* Role Selector Tabs (Patient, Doctor, Fleet, Admin) */}
                {authMode !== 'forgot' && authMode !== 'otp' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span>Select Portal Access Role</span>
                      <span className="text-sky-600 font-medium normal-case">Tailored interface</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'user', label: 'Patient', icon: User, desc: 'Health records' },
                        { id: 'doctor', label: 'Doctor', icon: Stethoscope, desc: 'OPD consults' },
                        { id: 'ambulance', label: 'Fleet 112', icon: Truck, desc: 'Dispatch SOS' },
                        { id: 'admin', label: 'Admin', icon: Shield, desc: 'Governance' },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedRole === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedRole(item.id);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-sky-600 bg-sky-50/70 shadow-xs ring-2 ring-sky-500/20'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-600' : 'text-slate-500'}`} />
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>}
                            </div>
                            <div>
                              <div className={`text-xs font-bold ${isSelected ? 'text-sky-950' : 'text-slate-800'}`}>
                                {item.label}
                              </div>
                              <div className="text-[10px] text-slate-500 leading-tight">
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* TAB 1: LOGIN FORM */}
                {/* ============================================================== */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    
                    {/* Login Method Sub-Tabs: Password vs ABHA / OTP */}
                    <div className="flex border-b border-slate-200 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setLoginMethod('password')}
                        className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                          loginMethod === 'password'
                            ? 'border-sky-600 text-sky-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Password Login</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setLoginMethod('abha'); setAuthMode('otp'); }}
                        className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                          loginMethod === 'abha'
                            ? 'border-sky-600 text-sky-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>ABHA ID / Mobile OTP</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">Fast</span>
                      </button>
                    </div>

                    {/* Email / Username Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Email Address or Phone Number</span>
                        <span className="text-[11px] text-sky-600 font-medium">
                          {selectedRole === 'doctor' ? 'Physician Portal' : selectedRole === 'admin' ? 'Admin Portal' : selectedRole === 'ambulance' ? 'Dispatch Portal' : 'Patient Portal'}
                        </span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@example.com or mobile"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input with show/hide toggle */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Password</label>
                        <button
                          type="button"
                          onClick={() => { setAuthMode('forgot'); setStatusMessage({ type: '', text: '' }); }}
                          className="text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Security Badge */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
                        />
                        <span>Remember this device for 30 days</span>
                      </label>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SSL 256-Bit</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authenticating securely...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to {roleMetadata[selectedRole].title}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Social Logins Divider */}
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
                      </div>
                    </div>

                    {/* Social / Government ID Logins */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleAuthFlow('login');
                          setGoogleRole(selectedRole);
                          setIsGoogleModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:border-slate-300"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setAuthMode('otp'); setLoginMethod('abha'); }}
                        className="py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-semibold text-emerald-800 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4 text-emerald-600" />
                        <span>ABHA Digital Card</span>
                      </button>
                    </div>

                  </form>
                )}

                {/* ============================================================== */}
                {/* TAB 2: SIGN UP / REGISTRATION FORM */}
                {/* ============================================================== */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* Quick Sign up with Google */}
                    <div className="space-y-2 pb-1">
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleAuthFlow('signup');
                          setGoogleRole(selectedRole);
                          setIsGoogleModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all flex items-center justify-center gap-2.5 shadow-2xs hover:border-slate-400 group cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Sign Up with Google Account</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold ml-1">1-Click</span>
                      </button>

                      <div className="relative my-2.5">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                          <span className="bg-white px-2.5 text-slate-400 font-medium uppercase tracking-wider">Or register with email form</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Full Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={selectedRole === 'doctor' ? 'Dr. Full Name' : 'Your Full Legal Name'}
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. +91 98450 12345"
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Role Specific Fields */}
                    {selectedRole === 'user' && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-sky-900">Blood Group</label>
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-medium text-slate-800 outline-none"
                          >
                            {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-sky-900">Patient Age</label>
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="32"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-medium text-slate-800 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedRole === 'doctor' && (
                      <div className="space-y-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-emerald-900">Medical Registration (MCI/NMC)</label>
                            <input
                              type="text"
                              value={medicalRegNumber}
                              onChange={(e) => setMedicalRegNumber(e.target.value)}
                              placeholder="e.g. MCI-12345 / DMC-67890"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs text-slate-800 outline-none"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-emerald-900">Clinical Specialty</label>
                            <select
                              value={specialty}
                              onChange={(e) => setSpecialty(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-white text-xs text-slate-800 outline-none"
                            >
                              <option value="Dermatology (Skin)">Dermatology (Skin)</option>
                              <option value="Cardiology (Heart)">Cardiology (Heart)</option>
                              <option value="Pulmonology (Lungs)">Pulmonology (Lungs)</option>
                              <option value="Ophthalmology (Eyes)">Ophthalmology (Eyes)</option>
                              <option value="General Physician">General Physician</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedRole === 'ambulance' && (
                      <div className="space-y-1 p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                        <label className="text-[11px] font-bold text-amber-900">Ambulance Fleet Unit ID / Station</label>
                        <input
                          type="text"
                          value={fleetUnitId}
                          onChange={(e) => setFleetUnitId(e.target.value)}
                          placeholder="e.g. AMB-UNIT-04 (112 ERSS)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 bg-white text-xs text-slate-800 outline-none"
                          required
                        />
                      </div>
                    )}

                    {/* Password & Confirm Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Create Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Strength Meter Bar */}
                    {password && (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Security Strength:</span>
                          <span className="font-bold text-slate-700">{pwdStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${pwdStrength.color}`} 
                            style={{ width: `${pwdStrength.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Statutory DPDP Act 2023 Consent Checkbox */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dpdpConsent}
                          onChange={(e) => setDpdpConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-sky-600 border-slate-300 focus:ring-sky-500"
                          required
                        />
                        <span className="text-slate-600 leading-snug">
                          I consent to the collection and cryptographic processing of health and biometric diagnostic data in compliance with the <strong className="text-slate-900 font-semibold">Digital Personal Data Protection (DPDP) Act 2023</strong> and Telemedicine Practice Guidelines.
                        </span>
                      </label>
                    </div>

                    {/* Submit Registration Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Creating verified account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Free {roleMetadata[selectedRole].title}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                  </form>
                )}

                {/* ============================================================== */}
                {/* TAB 3: ABHA / MOBILE OTP VERIFICATION */}
                {/* ============================================================== */}
                {authMode === 'otp' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Ayushman Bharat ABHA Verification</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Login instantly using your 14-digit ABHA Number or Aadhaar-linked mobile phone number.
                      </p>
                    </div>

                    {!otpSent ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">14-Digit ABHA ID or Mobile Number</label>
                          <div className="relative">
                            <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={abhaId}
                              onChange={(e) => setAbhaId(e.target.value)}
                              placeholder="91-4920-1049-2810 or 9845012345"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Request One-Time Password (OTP)</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            Enter OTP sent to your linked device (Demo: 1 2 3 4 5 6)
                          </span>
                        </div>

                        {/* 6 Digit Inputs */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-input-${idx}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              className="w-10 sm:w-12 h-12 text-center text-lg font-bold border-2 border-slate-300 focus:border-emerald-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 transition-all"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Didn't receive SMS?</span>
                          {countdown > 0 ? (
                            <span className="text-slate-400 font-medium">Resend in {countdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-emerald-600 font-bold hover:underline"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isLoading}
                          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Validating ABDM Token...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Verify & Access Account</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('login'); setStatusMessage({ type: '', text: '' }); }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Standard Password Login</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* TAB 4: FORGOT PASSWORD FLOW */}
                {/* ============================================================== */}
                {authMode === 'forgot' && (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 animate-in fade-in duration-200">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-2">
                        <KeyRound className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Enter your registered email address to receive password reset authorization.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Registered Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rahul.patient@verahealth.ai"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-sm outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching reset token...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Password Reset Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('login'); setStatusMessage({ type: '', text: '' }); }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>

              {/* Card Footer Notes & Certifications */}
              <div className="bg-slate-50 px-6 sm:px-8 py-3.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ABDM Certified</span>
                  </span>
                  <span>•</span>
                  <span>ISO 27001 Security</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Need help? Support 24x7</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Emergency Help Strip */}
      <div className="max-w-7xl mx-auto w-full pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2 text-rose-300 font-medium">
          <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Experiencing a medical emergency? Do not wait to sign in.</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white font-bold underline decoration-rose-500 hover:text-rose-300 transition-colors cursor-pointer"
          >
            Launch Emergency Ambulance Grid (112 / 108)
          </button>
        </div>
        <div className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} VeraHealth AI Platform. DPDP Act 2023 Protected.
        </div>
      </div>

      {/* ============================================================== */}
      {/* AUTHENTIC GOOGLE SIGN-IN / SIGN-UP MODAL */}
      {/* ============================================================== */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150">
            
            {/* Google Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span className="font-bold text-base text-slate-800">
                    {googleAuthFlow === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Select your member portal and enter your Google account details:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credential Inputs Form */}
            <div className="p-6 space-y-4">
              
              {/* Member Role Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Select Member Portal:</span>
                  <span className="text-sky-600 font-semibold normal-case">Tailored dashboard</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'user', label: 'Patient' },
                    { id: 'doctor', label: 'Doctor' },
                    { id: 'ambulance', label: 'Fleet' },
                    { id: 'admin', label: 'Admin' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setGoogleRole(r.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        (googleRole || selectedRole) === r.id
                          ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-500/20'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Google Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">2. Google / Gmail Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-xs text-slate-900 outline-none"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Google Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">3. Google Account Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    placeholder="Enter your Google password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-xs text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Display Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">4. Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder={googleRole === 'doctor' ? 'Dr. Full Name' : 'Your Legal Name'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Security & Privacy Notice */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Google OAuth 2.0 secure bridge. Authenticates directly with your entered Google account and opens your tailored portal dashboard.</span>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleGoogleAuthSubmit}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to VeraHealth</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
