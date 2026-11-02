import React, { createContext, useContext, useState, useEffect } from 'react';
import { dispatchAmbulance } from '../services/api';

const EmergencyContext = createContext(null);

export function EmergencyProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSosTriggered, setIsSosTriggered] = useState(false);
  const [activeDispatch, setActiveDispatch] = useState(() => {
    const saved = localStorage.getItem('vera_emergency_dispatch');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    address: 'Connaught Place, New Delhi (Simulated GPS)',
    isRealGps: false,
    fetching: false,
    error: null,
  });

  // Emergency contact list
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Kavita Varma (Spouse)', phone: '+91 98450 67890', relation: 'Spouse' },
    { id: 2, name: 'Dr. Sameer Kapoor (Family GP)', phone: '+91 11 2651 5050', relation: 'Physician' },
    { id: 3, name: 'Pooja Varma (Sister)', phone: '+91 98112 34567', relation: 'Family' },
  ]);

  useEffect(() => {
    if (activeDispatch) {
      localStorage.setItem('vera_emergency_dispatch', JSON.stringify(activeDispatch));
    } else {
      localStorage.removeItem('vera_emergency_dispatch');
    }
  }, [activeDispatch]);

  // Request actual browser geolocation if user permits
  const fetchBrowserLocation = () => {
    setCurrentLocation(prev => ({ ...prev, fetching: true, error: null }));
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)} (Live GPS)`,
            isRealGps: true,
            fetching: false,
            error: null,
          });
        },
        (err) => {
          console.warn('Geolocation denied or unavailable, using fallback coordinates:', err.message);
          setCurrentLocation(prev => ({
            ...prev,
            fetching: false,
            error: 'GPS permission denied or timeout. Using default city location.'
          }));
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setCurrentLocation(prev => ({
        ...prev,
        fetching: false,
        error: 'Geolocation is not supported by your browser.'
      }));
    }
  };

  const triggerInstantSos = async (customDetails = {}) => {
    setIsSosTriggered(true);
    setIsModalOpen(true);

    const dispatchPayload = {
      userLocation: currentLocation,
      providerName: customDetails.providerName || 'ERSS 112 / National Emergency Network',
      ambulanceType: customDetails.ambulanceType || 'Advanced Cardiac Life Support (ALS)',
      hospitalDestination: customDetails.hospitalDestination || 'AIIMS Apex Trauma Center',
      patientCondition: customDetails.condition || 'Emergency SOS Triggered',
    };

    const res = await dispatchAmbulance(dispatchPayload);
    setActiveDispatch({
      ...res,
      countdownMinutes: res.estimatedArrivalMinutes || 8,
      statusHistory: [
        { time: new Date().toLocaleTimeString(), text: 'Emergency SOS Broadcasted to ERSS 112 Control Room' },
        { time: new Date().toLocaleTimeString(), text: 'Nearest ALS Paramedic Unit DL 01 EM 4092 assigned' },
      ]
    });
  };

  const cancelDispatch = () => {
    setActiveDispatch(null);
    setIsSosTriggered(false);
  };

  const addEmergencyContact = (contact) => {
    setEmergencyContacts(prev => [...prev, { id: Date.now(), ...contact }]);
  };

  const removeEmergencyContact = (id) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <EmergencyContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isSosTriggered,
        activeDispatch,
        setActiveDispatch,
        triggerInstantSos,
        cancelDispatch,
        currentLocation,
        fetchBrowserLocation,
        emergencyContacts,
        addEmergencyContact,
        removeEmergencyContact,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within an EmergencyProvider');
  return context;
}
