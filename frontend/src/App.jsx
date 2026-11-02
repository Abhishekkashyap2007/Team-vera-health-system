import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EmergencyProvider } from './context/EmergencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';
import AuthModal from './components/AuthModal';
import FloatingAiChatModal from './components/FloatingAiChatModal';

import HomeView from './views/HomeView';
import AiScreeningView from './views/AiScreeningView';
import AiChatAssistantView from './views/AiChatAssistantView';
import DoctorDiscoveryView from './views/DoctorDiscoveryView';
import ConsultationView from './views/ConsultationView';
import AmbulanceView from './views/AmbulanceView';
import HospitalFinderView from './views/HospitalFinderView';
import UserDashboardView from './views/UserDashboardView';
import DoctorDashboardView from './views/DoctorDashboardView';
import AdminDashboardView from './views/AdminDashboardView';
import LoginView from './views/LoginView';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [selectedAiModule, setSelectedAiModule] = useState('skin');
  const [selectedDoctorSpecialty, setSelectedDoctorSpecialty] = useState('all');
  const [doctorForCall, setDoctorForCall] = useState(null);

  return (
    <AuthProvider>
      <EmergencyProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
          
          {/* Main Navigation (hidden on dedicated login page) */}
          {activeTab !== 'login' && (
            <Navbar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          )}

          {/* Main View Container */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <HomeView
                setActiveTab={setActiveTab}
                setSelectedAiModule={setSelectedAiModule}
              />
            )}

            {activeTab === 'ai-assistant' && (
              <AiChatAssistantView
                setActiveTab={setActiveTab}
                setSelectedDoctorSpecialty={setSelectedDoctorSpecialty}
              />
            )}

            {activeTab === 'screening' && (
              <AiScreeningView
                selectedModuleId={selectedAiModule}
                setActiveTab={setActiveTab}
                setSelectedDoctorSpecialty={setSelectedDoctorSpecialty}
              />
            )}

            {activeTab === 'doctors' && (
              <DoctorDiscoveryView
                initialSpecialty={selectedDoctorSpecialty}
                setActiveTab={setActiveTab}
                setSelectedDoctorForCall={setDoctorForCall}
              />
            )}

            {activeTab === 'consultation' && (
              <ConsultationView
                doctorForCall={doctorForCall}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'ambulance' && (
              <AmbulanceView
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'hospitals' && (
              <HospitalFinderView />
            )}

            {activeTab === 'user-dashboard' && (
              <UserDashboardView
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'doctor-dashboard' && (
              <DoctorDashboardView
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'admin-dashboard' && (
              <AdminDashboardView />
            )}

            {activeTab === 'login' && (
              <LoginView setActiveTab={setActiveTab} />
            )}
          </main>

          {/* Global Footer (shown on regular views) */}
          {activeTab !== 'login' && <Footer setActiveTab={setActiveTab} />}

          {/* Global Modals (Accessible from everywhere) */}
          <EmergencyModal />
          <AuthModal setActiveTab={setActiveTab} />
          {activeTab !== 'login' && (
            <FloatingAiChatModal 
              setActiveTab={setActiveTab} 
              setSelectedDoctorSpecialty={setSelectedDoctorSpecialty} 
            />
          )}

        </div>
      </EmergencyProvider>
    </AuthProvider>
  );
}
