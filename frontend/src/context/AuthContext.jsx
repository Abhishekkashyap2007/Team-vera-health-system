import React, { createContext, useContext, useState, useEffect } from 'react';
import { authWithGoogle, authLogin, authRegister } from '../services/api';

const AuthContext = createContext(null);

export const ROLES = {
  USER: 'user',
  DOCTOR: 'doctor',
  AMBULANCE: 'ambulance',
  ADMIN: 'admin',
};

export const DEFAULT_USERS = {
  user: {
    id: 'usr-101',
    name: 'Patient Member',
    email: 'patient.portal@verahealth.ai',
    role: 'user',
    phone: '+91 98450 12345',
    bloodGroup: 'B+ Positive',
    age: 32,
    allergies: ['Penicillin'],
    emergencyContacts: [
      { name: 'Emergency Contact (Family)', phone: '+91 98450 67890', relation: 'Family' },
      { name: 'Duty Medical Officer', phone: '+91 11 2651 5050', relation: 'Physician' }
    ],
    consentGiven: true,
  },
  doctor: {
    id: 'doc-1',
    name: 'Dr. Specialist',
    email: 'doctor.portal@verahealth.ai',
    role: 'doctor',
    specialty: 'Dermatology & General OPD',
    medicalRegistration: 'NMC-Verified Clinician',
    clinicName: 'VeraHealth Clinical Teleconsult OPD',
    consultationFee: 800,
    isAvailable: true,
  },
  ambulance: {
    id: 'amb-op-1',
    name: 'Emergency Dispatcher #42',
    email: 'dispatch@emergency112.gov.in',
    role: 'ambulance',
    service: 'ERSS 112 / 108 Emergency Grid',
    unitId: 'AMB-UNIT-NORTH-04',
  },
  admin: {
    id: 'adm-01',
    name: 'Health Administrator',
    email: 'admin@verahealth.ai',
    role: 'admin',
    department: 'Clinical Governance & Compliance',
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('vera_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return null; // Start unauthenticated so user sees login page
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'forgot'

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vera_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vera_auth_user');
    }
  }, [currentUser]);

  // Retrieve locally registered users
  const getRegisteredUsers = () => {
    try {
      const raw = localStorage.getItem('vera_registered_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUser = (userRecord) => {
    try {
      const users = getRegisteredUsers();
      const existingIdx = users.findIndex(u => u.email?.toLowerCase() === userRecord.email?.toLowerCase());
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...userRecord };
      } else {
        users.push(userRecord);
      }
      localStorage.setItem('vera_registered_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save user in local registry:', e);
    }
  };

  const loginWithGoogle = async (googleUser, role = 'user') => {
    const res = await authWithGoogle({
      userInfo: {
        email: googleUser.email,
        name: googleUser.name,
        avatar_url: googleUser.avatar_url || googleUser.picture,
        google_id: googleUser.google_id || googleUser.sub,
      },
      role: role || 'user'
    });

    if (res?.user) {
      saveRegisteredUser(res.user);
      setCurrentUser(res.user);
      setAuthModalOpen(false);
      return { success: true, user: res.user };
    }
    return { success: false, error: 'Google login failed' };
  };

  const login = async (email, password, role = 'user', customName = '') => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const targetRole = role || 'user';

    // 1. Attempt backend login
    const backendRes = await authLogin(cleanEmail, password, targetRole);
    if (backendRes?.user) {
      const enhanced = {
        ...backendRes.user,
        name: customName?.trim() || backendRes.user.name,
        role: targetRole,
      };
      saveRegisteredUser(enhanced);
      setCurrentUser(enhanced);
      setAuthModalOpen(false);
      return { success: true, user: enhanced };
    }

    // 2. Check local registered users
    const localUsers = getRegisteredUsers();
    const foundUser = localUsers.find(u => u.email?.toLowerCase() === cleanEmail);

    if (foundUser) {
      const activeUser = {
        ...foundUser,
        role: targetRole || foundUser.role || 'user',
        name: customName?.trim() || foundUser.name,
      };
      setCurrentUser(activeUser);
      setAuthModalOpen(false);
      return { success: true, user: activeUser };
    }

    // 3. Fallback: create personalized user account with chosen role
    const emailPrefix = cleanEmail.split('@')[0] || 'Member';
    const derivedName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    const chosenName = customName?.trim() || derivedName;

    const roleFormattedName = targetRole === 'doctor'
      ? (chosenName.startsWith('Dr') ? chosenName : `Dr. ${chosenName}`)
      : chosenName;

    const base = DEFAULT_USERS[targetRole] || DEFAULT_USERS.user;
    const userObj = {
      ...base,
      id: `${targetRole.slice(0, 3)}-` + Date.now().toString().slice(-4),
      name: roleFormattedName,
      email: cleanEmail || `${targetRole}.member@verahealth.ai`,
      role: targetRole,
      specialty: targetRole === 'doctor' ? (base.specialty || 'General Medicine & OPD') : undefined,
    };

    saveRegisteredUser(userObj);
    setCurrentUser(userObj);
    setAuthModalOpen(false);
    return { success: true, user: userObj };
  };

  const register = async (data) => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const targetRole = data.role || 'user';

    // 1. Attempt backend registration
    const backendRes = await authRegister(data);
    if (backendRes?.user) {
      saveRegisteredUser(backendRes.user);
      setCurrentUser(backendRes.user);
      setAuthModalOpen(false);
      return { success: true, user: backendRes.user };
    }

    // 2. Local registration
    const newUser = {
      id: `${targetRole.slice(0, 3)}-` + Date.now().toString().slice(-4),
      name: data.name?.trim() || 'Member',
      email: cleanEmail,
      role: targetRole,
      phone: data.phone || '+91 98450 12345',
      bloodGroup: data.bloodGroup || 'B+ Positive',
      specialty: targetRole === 'doctor' ? (data.specialty || 'General Medicine / OPD') : undefined,
      medicalRegistration: targetRole === 'doctor' ? (data.medicalRegNumber || 'NMC-Verified Clinician') : undefined,
      clinicName: targetRole === 'doctor' ? 'Vera Health Teleconsult OPD' : undefined,
      consultationFee: targetRole === 'doctor' ? 800 : undefined,
      isAvailable: true,
      emergencyContacts: [],
      consentGiven: data.consentGiven ?? true,
      created_at: new Date().toISOString()
    };

    saveRegisteredUser(newUser);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vera_auth_user');
  };

  const switchRole = (roleKey) => {
    if (currentUser) {
      const baseName = currentUser.name?.replace(/^Dr\.\s+/, '') || 'Member';
      const formattedName = roleKey === 'doctor' ? `Dr. ${baseName}` : baseName;
      const updatedUser = {
        ...currentUser,
        role: roleKey,
        name: formattedName,
        specialty: roleKey === 'doctor' ? (currentUser.specialty || 'General Medicine & OPD') : undefined,
      };
      setCurrentUser(updatedUser);
      saveRegisteredUser(updatedUser);
    } else if (DEFAULT_USERS[roleKey]) {
      const demoUser = {
        ...DEFAULT_USERS[roleKey],
        name: roleKey === 'doctor' ? 'Dr. Specialist' : roleKey === 'ambulance' ? 'Emergency Dispatcher' : roleKey === 'admin' ? 'Health Administrator' : 'Patient Member',
        email: `${roleKey}.member@verahealth.ai`
      };
      setCurrentUser(demoUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginWithGoogle,
        register,
        logout,
        switchRole,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
