import React, { useState } from 'react';
import { 
  Activity, 
  PhoneCall, 
  Stethoscope, 
  ShieldAlert, 
  Building2, 
  Video, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Bot,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, switchRole, logout, setAuthModalOpen } = useAuth();
  const { setIsModalOpen, activeDispatch } = useEmergency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'ai-assistant', label: 'Ask AI Doctor', icon: Bot, badge: 'ChatGPT' },
    { id: 'screening', label: 'AI Health Check', icon: Sparkles, badge: '8 Systems' },
    { id: 'doctors', label: 'Find Doctors', icon: Stethoscope },
    { id: 'consultation', label: 'Video Consult', icon: Video },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'ambulance', label: 'Ambulance & SOS', icon: PhoneCall },
  ];

  // Dynamic Dashboard tab based on current role
  const getDashboardId = () => {
    if (!currentUser) return 'user-dashboard';
    if (currentUser.role === 'doctor') return 'doctor-dashboard';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'ambulance') return 'ambulance';
    return 'user-dashboard';
  };

  const getDashboardLabel = () => {
    if (!currentUser) return 'Dashboard';
    if (currentUser.role === 'doctor') return 'Doctor Portal';
    if (currentUser.role === 'admin') return 'Admin Portal';
    if (currentUser.role === 'ambulance') return 'Dispatch Fleet';
    return 'My Health Dashboard';
  };

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  Vera<span className="text-sky-600">Health</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  AI Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Smart Healthcare Ecosystem</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 shadow-xs'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-sky-600 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Dashboard Link */}
            <button
              onClick={() => handleNavClick(getDashboardId())}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab.includes('dashboard')
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>{getDashboardLabel()}</span>
            </button>
          </nav>

          {/* Right Action Cluster: SOS Button + Role Switcher + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Prominent Emergency SOS Button */}
            <button
              id="global-sos-btn"
              onClick={() => setIsModalOpen(true)}
              className="relative group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95 animate-sos cursor-pointer"
              title="Instant Ambulance & Emergency Helpline 112"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span className="tracking-wide">SOS</span>
              {activeDispatch && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
                </span>
              )}
            </button>

            {/* Role Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                title="Switch demo role to test Patient, Doctor, or Admin dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="capitalize">{currentUser?.role || 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Switch Portal View
                  </div>
                  <button
                    onClick={() => { switchRole('user'); setRoleDropdownOpen(false); setActiveTab('user-dashboard'); }}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-700"
                  >
                    <span>Patient Portal</span>
                    {currentUser?.role === 'user' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('doctor'); setRoleDropdownOpen(false); setActiveTab('doctor-dashboard'); }}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-700"
                  >
                    <span>Doctor Portal</span>
                    {currentUser?.role === 'doctor' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('ambulance'); setRoleDropdownOpen(false); setActiveTab('ambulance'); }}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-700"
                  >
                    <span>Emergency Dispatcher</span>
                    {currentUser?.role === 'ambulance' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('admin'); setRoleDropdownOpen(false); setActiveTab('admin-dashboard'); }}
                    className="w-full text-left px-3 py-2 hover:bg-sky-50 flex items-center justify-between text-slate-700"
                  >
                    <span>Hospital Administrator</span>
                    {currentUser?.role === 'admin' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Profile / Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick(getDashboardId())}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                  title="Open Portal Dashboard"
                >
                  {currentUser.avatar_url ? (
                    <img 
                      src={currentUser.avatar_url} 
                      alt={currentUser.name} 
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-2xs" 
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-linear-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setActiveTab('login');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Sign Out & Return to Login"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    activeTab === 'login'
                      ? 'bg-sky-600 text-white ring-2 ring-sky-400/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.02]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-sky-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick(getDashboardId())}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800"
          >
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            <span>{getDashboardLabel()}</span>
          </button>

          {/* Mobile Sign In / Sign Out Button */}
          {currentUser ? (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                setActiveTab('login');
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-rose-50 text-rose-700"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-rose-600" />
                <span>Sign Out ({currentUser.name})</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveTab('login');
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-sky-600 text-white shadow-xs"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span>Sign In / Create Account</span>
              </div>
            </button>
          )}

          {/* Quick role switch for mobile */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <p className="text-xs font-semibold text-slate-400 px-3 pb-1">Switch Role Demo:</p>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              <button
                onClick={() => { switchRole('user'); setMobileMenuOpen(false); setActiveTab('user-dashboard'); }}
                className="text-xs py-1.5 px-2 bg-slate-100 rounded-md text-slate-700 font-medium text-center"
              >
                Patient
              </button>
              <button
                onClick={() => { switchRole('doctor'); setMobileMenuOpen(false); setActiveTab('doctor-dashboard'); }}
                className="text-xs py-1.5 px-2 bg-slate-100 rounded-md text-slate-700 font-medium text-center"
              >
                Doctor
              </button>
              <button
                onClick={() => { switchRole('ambulance'); setMobileMenuOpen(false); setActiveTab('ambulance'); }}
                className="text-xs py-1.5 px-2 bg-slate-100 rounded-md text-slate-700 font-medium text-center"
              >
                Ambulance
              </button>
              <button
                onClick={() => { switchRole('admin'); setMobileMenuOpen(false); setActiveTab('admin-dashboard'); }}
                className="text-xs py-1.5 px-2 bg-slate-100 rounded-md text-slate-700 font-medium text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
