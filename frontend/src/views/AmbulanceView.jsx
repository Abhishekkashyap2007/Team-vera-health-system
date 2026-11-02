import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Info, 
  UserCheck, 
  ExternalLink,
  Flame,
  Activity,
  Heart
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useEmergency } from '../context/EmergencyContext';
import { MOCK_AMBULANCE_PROVIDERS, MOCK_HOSPITALS } from '../data/mockData';

// Custom Ambulance Marker Icon
const ambulanceIcon = new L.DivIcon({
  className: 'custom-ambulance-marker',
  html: `<div style="background-color:#ef4444; color:white; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 0 15px rgba(239,68,68,0.8); font-size:18px;" class="animate-pulse">🚑</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -32],
});

const userPinIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `<div style="background-color:#0284c7; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 0 10px rgba(2,132,199,0.8); font-size:16px;">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

export default function AmbulanceView({ setActiveTab }) {
  const { 
    activeDispatch, 
    triggerInstantSos, 
    cancelDispatch, 
    currentLocation, 
    fetchBrowserLocation,
    emergencyContacts 
  } = useEmergency();

  const [selectedProvider, setSelectedProvider] = useState(MOCK_AMBULANCE_PROVIDERS[0]);
  const [ambulanceType, setAmbulanceType] = useState('Advanced Cardiac Life Support (ALS)');
  const [selectedHospital, setSelectedHospital] = useState(MOCK_HOSPITALS[0].name);
  const [customAddress, setCustomAddress] = useState('');
  const [emergencyReason, setEmergencyReason] = useState('Severe Chest Pain / Suspected Cardiac');

  const handleBook = () => {
    triggerInstantSos({
      providerName: selectedProvider.providerName,
      ambulanceType,
      hospitalDestination: selectedHospital,
      condition: emergencyReason,
      locationAddress: customAddress || currentLocation.address,
    });
  };

  // Coordinates for simulated route
  const userCoords = [currentLocation.lat || 28.6139, currentLocation.lng || 77.2090];
  const ambulanceCoords = [
    (currentLocation.lat || 28.6139) + 0.012, 
    (currentLocation.lng || 77.2090) + 0.015
  ];
  const routePoints = [ambulanceCoords, userCoords];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Emergency 112 Statutory Notice */}
      <div className="bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>National Emergency Response Service</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Emergency Ambulance & Immediate SOS
            </h1>
            <p className="text-sm text-red-100 leading-relaxed font-normal">
              Direct access to India's unified <strong>112 Emergency System</strong> and verified private ALS/BLS critical care fleets. Instant GPS dispatch with zero login or preliminary triage prerequisites.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:112"
              className="px-6 py-4 bg-white hover:bg-red-50 text-red-700 font-extrabold text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-red-600 animate-pulse" />
              <span>Dial 112 (National SOS)</span>
            </a>
            <a
              href="tel:108"
              className="px-6 py-4 bg-red-950/40 hover:bg-red-950/60 border border-white/30 text-white font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Dial 108 (Ambulance)</span>
            </a>
          </div>
        </div>

        {/* Legal notice distinction */}
        <div className="mt-6 pt-4 border-t border-red-500/40 flex items-center justify-between text-xs text-red-100 flex-wrap gap-2">
          <span>⚠️ <strong>Platform Integration Notice:</strong> Real emergency telephone numbers are linked above. Dispatch portal provides real-time API dispatch simulation and fleet coordination.</span>
          <span className="font-semibold underline">Emergency Medical Services Regulations 2023</span>
        </div>
      </div>

      {/* Main Grid: Left Request & Tracking, Right Live GPS Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form / Active Tracking (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {activeDispatch ? (
            /* Active Live Ambulance Tracking Card */
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/50 shadow-md space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Ambulance Dispatched & En Route</h3>
                    <p className="text-[11px] text-emerald-700 font-semibold">{activeDispatch.provider}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                  {activeDispatch.requestId}
                </span>
              </div>

              {/* Big ETA Display */}
              <div className="bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider block">
                  Estimated Siren Arrival Time
                </span>
                <div className="flex items-baseline justify-center gap-1.5 mt-2">
                  <span className="text-5xl font-black text-emerald-950 font-mono">
                    ~{activeDispatch.estimatedArrivalMinutes || 8}
                  </span>
                  <span className="text-base font-bold text-emerald-700">minutes</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-2 font-medium">
                  Traffic corridor cleared • Paramedic onboard with cardiac defibrillator
                </p>
              </div>

              {/* Crew & Vehicle Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Vehicle Registration:</span>
                  <span className="font-bold text-slate-900 font-mono">{activeDispatch.vehicleNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Care Level:</span>
                  <span className="font-bold text-slate-900">{activeDispatch.ambulanceType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Lead EMT:</span>
                  <span className="font-bold text-slate-900">{activeDispatch.driverName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Destination Hospital:</span>
                  <span className="font-bold text-sky-700">{activeDispatch.hospitalDestination}</span>
                </div>
              </div>

              {/* Paramedic direct contact buttons */}
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${activeDispatch.driverPhone}`}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Paramedic Driver</span>
                </a>
                <button
                  onClick={cancelDispatch}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Ambulance Request Form */
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request an Emergency Ambulance</h3>
                <p className="text-xs text-slate-500 mt-1">Specify pickup coordinates and emergency level</p>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    Pickup Address / Landmark
                  </label>
                  <button
                    onClick={fetchBrowserLocation}
                    disabled={currentLocation.fetching}
                    className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    {currentLocation.fetching ? 'Locating...' : 'Use Current Live GPS'}
                  </button>
                </div>
                <input
                  type="text"
                  value={customAddress || currentLocation.address}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="Street address, building, floor, landmark..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Ambulance Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Ambulance Care Level</label>
                <div className="space-y-2">
                  {[
                    { id: 'Advanced Cardiac Life Support (ALS)', desc: 'Equipped with transport ventilator, ECG, defibrillator & paramedic' },
                    { id: 'Basic Life Support (BLS)', desc: 'Stretcher, portable oxygen cylinder & basic first aid kits' },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={`block p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        ambulanceType === type.id
                          ? 'border-red-500 bg-red-50/70 font-semibold text-slate-900 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ambulanceLevel"
                        value={type.id}
                        checked={ambulanceType === type.id}
                        onChange={(e) => setAmbulanceType(e.target.value)}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="font-bold text-slate-900">{type.id}</span>
                      <p className="text-[11px] text-slate-500 mt-1 ml-5">{type.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Destination Hospital */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Destination Hospital</label>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden font-medium"
                >
                  {MOCK_HOSPITALS.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name} ({h.city}) - {h.icuBedsAvailable} ICU Beds
                    </option>
                  ))}
                </select>
              </div>

              {/* Emergency Condition Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">Patient Acute Condition</label>
                <input
                  type="text"
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  placeholder="e.g. Difficulty breathing, severe trauma, unconscious..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Submit Dispatch */}
              <button
                onClick={handleBook}
                className="w-full py-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Truck className="w-4 h-4" />
                <span>Confirm Ambulance Dispatch</span>
              </button>
            </div>
          )}

          {/* Emergency Contacts Widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Registered Emergency Contacts
              </h4>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                Auto-Alert On SOS
              </span>
            </div>
            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{contact.name}</span>
                    <span className="text-[10px] text-slate-500 block">{contact.relation}</span>
                  </div>
                  <a href={`tel:${contact.phone}`} className="text-sky-600 font-bold hover:underline flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> Call
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Live Interactive GPS Tracking Map (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold text-slate-800">Live GPS Emergency Fleet Map</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">OpenStreetMap Satellite Grid</span>
            </div>

            <div className="h-[520px] w-full rounded-2xl overflow-hidden relative border border-slate-200">
              <MapContainer
                center={userCoords}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                <Marker position={userCoords} icon={userPinIcon}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong className="text-slate-900 block">Patient Pickup Location</strong>
                      <span className="text-slate-600">{currentLocation.address}</span>
                    </div>
                  </Popup>
                </Marker>

                {/* Ambulance Live Location Marker */}
                {activeDispatch && (
                  <>
                    <Marker position={ambulanceCoords} icon={ambulanceIcon}>
                      <Popup>
                        <div className="p-1 text-xs space-y-1">
                          <strong className="text-red-700 block">🚨 Emergency Ambulance En Route</strong>
                          <div className="text-slate-800 font-mono font-bold">{activeDispatch.vehicleNumber}</div>
                          <div className="text-emerald-700 font-semibold">ETA: ~{activeDispatch.estimatedArrivalMinutes} mins</div>
                        </div>
                      </Popup>
                    </Marker>
                    <Polyline positions={routePoints} color="#ef4444" weight={4} dashArray="8, 8" />
                  </>
                )}
              </MapContainer>
            </div>

            <div className="p-2 text-center text-xs text-slate-400">
              Live tracking updates via GPS transponder every 3 seconds during an active dispatch.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
