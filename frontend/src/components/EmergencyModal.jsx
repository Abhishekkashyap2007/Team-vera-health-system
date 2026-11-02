import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  Truck, 
  UserCheck, 
  Building2,
  ExternalLink,
  Info
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { MOCK_AMBULANCE_PROVIDERS, MOCK_HOSPITALS } from '../data/mockData';

export default function EmergencyModal() {
  const { 
    isModalOpen, 
    setIsModalOpen, 
    activeDispatch, 
    triggerInstantSos, 
    cancelDispatch, 
    currentLocation, 
    fetchBrowserLocation 
  } = useEmergency();

  const [selectedProvider, setSelectedProvider] = useState(MOCK_AMBULANCE_PROVIDERS[0]);
  const [ambulanceType, setAmbulanceType] = useState('Advanced Cardiac Life Support (ALS)');
  const [selectedHospital, setSelectedHospital] = useState(MOCK_HOSPITALS[0].name);
  const [manualAddress, setManualAddress] = useState('');
  const [patientCondition, setPatientCondition] = useState('Severe Chest Pain / Shortness of Breath');
  const [callingConfirmed, setCallingConfirmed] = useState(false);

  if (!isModalOpen) return null;

  const handleTriggerBooking = () => {
    triggerInstantSos({
      providerName: selectedProvider.providerName,
      ambulanceType,
      hospitalDestination: selectedHospital,
      condition: patientCondition,
      locationAddress: manualAddress || currentLocation.address,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Emergency Red Bar */}
        <div className="bg-linear-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Emergency SOS & Rapid Ambulance</h2>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full border border-white/20">
                  Priority 1
                </span>
              </div>
              <p className="text-xs text-red-100 font-medium">
                National Emergency Network 112 • Zero registration required
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Dispatch Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Platform Notice:</strong> For life-threatening emergencies, dial <strong>112</strong> immediately. This portal triggers verified ambulance dispatch or simulated triage.
            </span>
          </div>
          <a
            href="tel:112"
            className="font-bold text-red-700 underline flex items-center gap-1 shrink-0 ml-2"
          >
            Call 112 Now <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">

          {/* If an active dispatch exists, show real-time tracking card */}
          {activeDispatch ? (
            <div className="bg-slate-50 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-slate-900 text-sm">Ambulance Dispatched & En Route</span>
                </div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-md">
                  {activeDispatch.requestId}
                </span>
              </div>

              {/* ETA Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">Estimated Arrival</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">~{activeDispatch.estimatedArrivalMinutes || 8}</span>
                    <span className="text-xs text-slate-600 font-semibold">minutes</span>
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">Vehicle Number</span>
                  <div className="text-sm font-bold text-slate-900 mt-1 font-mono">
                    {activeDispatch.vehicleNumber || 'DL 01 EM 4092'}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">ALS Ready with Ventilator</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">Lead Paramedic</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {activeDispatch.driverName}
                  </div>
                  <a href={`tel:${activeDispatch.driverPhone}`} className="text-xs text-sky-600 font-bold hover:underline flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> {activeDispatch.driverPhone}
                  </a>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Timeline</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Emergency SOS received & triaged by control room</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Advanced Life Support ambulance DL-01-EM-4092 deployed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-700 font-semibold animate-pulse">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>En route to user coordinates with siren clearance</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-4 h-4 text-slate-300" />
                    <span>Hospital destination notified: {activeDispatch.hospitalDestination}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={`tel:${activeDispatch.driverPhone}`}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call Paramedic Driver
                </a>
                <button
                  onClick={cancelDispatch}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Cancel / False Alarm
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Instant 1-Click Panic Bar */}
              <div className="bg-linear-to-r from-red-500 to-rose-600 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Instant 1-Click SOS Dispatch</h3>
                    <p className="text-xs text-red-100">Instantly broadcasts GPS to nearest available emergency provider</p>
                  </div>
                </div>
                <button
                  onClick={handleTriggerBooking}
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-red-50 text-red-600 font-extrabold rounded-xl shadow-lg transition-all active:scale-95 text-sm uppercase tracking-wider cursor-pointer"
                >
                  Deploy SOS Ambulance
                </button>
              </div>

              {/* Direct Government Helpline Calling Cards */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Direct Toll-Free Emergency Numbers
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href="tel:112"
                    className="p-3 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-colors flex flex-col items-center text-center group"
                  >
                    <span className="text-lg font-black text-red-700">112</span>
                    <span className="text-[11px] font-semibold text-slate-600">All India SOS</span>
                  </a>
                  <a
                    href="tel:108"
                    className="p-3 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex flex-col items-center text-center group"
                  >
                    <span className="text-lg font-black text-rose-700">108</span>
                    <span className="text-[11px] font-semibold text-slate-600">Govt Ambulance</span>
                  </a>
                  <a
                    href="tel:102"
                    className="p-3 rounded-xl bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors flex flex-col items-center text-center group"
                  >
                    <span className="text-lg font-black text-sky-700">102</span>
                    <span className="text-[11px] font-semibold text-slate-600">Maternity & Child</span>
                  </a>
                  <a
                    href="tel:1066"
                    className="p-3 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors flex flex-col items-center text-center group"
                  >
                    <span className="text-lg font-black text-purple-700">1066</span>
                    <span className="text-[11px] font-semibold text-slate-600">Apollo Critical</span>
                  </a>
                </div>
              </div>

              {/* Location Permission & Input */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    Pickup Location Coordinates
                  </label>
                  <button
                    onClick={fetchBrowserLocation}
                    disabled={currentLocation.fetching}
                    className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    {currentLocation.fetching ? 'Acquiring GPS...' : 'Use Current Live GPS'}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={manualAddress || currentLocation.address}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Enter locality, landmark, or street address..."
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                {currentLocation.isRealGps && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    ✓ Verified GPS Location acquired accurately within ~15 meters
                  </p>
                )}
                {currentLocation.error && (
                  <p className="text-[11px] text-amber-600 font-medium">
                    {currentLocation.error}
                  </p>
                )}
              </div>

              {/* Service Provider & Ambulance Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Ambulance Specification */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Ambulance Care Level</label>
                  <div className="space-y-2">
                    {[
                      { id: 'Advanced Cardiac Life Support (ALS)', desc: 'Equipped with transport ventilator, defibrillator, cardiac monitor, EMT' },
                      { id: 'Basic Life Support (BLS)', desc: 'Oxygen support, patient stretcher, primary first-aid equipment' },
                      { id: 'Patient Transport / Wheelchair', desc: 'Non-emergency stable patient hospital transfer' }
                    ].map((type) => (
                      <label 
                        key={type.id} 
                        className={`block p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          ambulanceType === type.id 
                            ? 'border-red-500 bg-red-50/60 font-semibold text-slate-900' 
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ambType"
                          value={type.id}
                          checked={ambulanceType === type.id}
                          onChange={(e) => setAmbulanceType(e.target.value)}
                          className="mr-2 text-red-600 focus:ring-red-500"
                        />
                        <span className="font-bold">{type.id}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5 ml-5">{type.desc}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Target Hospital Destination */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">Destination Emergency Hospital</label>
                  <select
                    value={selectedHospital}
                    onChange={(e) => setSelectedHospital(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  >
                    {MOCK_HOSPITALS.map((hosp) => (
                      <option key={hosp.id} value={hosp.name}>
                        {hosp.name} ({hosp.city}) - {hosp.icuBedsAvailable} ICU Beds
                      </option>
                    ))}
                  </select>

                  <div className="mt-3">
                    <label className="text-xs font-bold text-slate-800 block mb-1">Select Emergency Network</label>
                    <div className="space-y-2">
                      {MOCK_AMBULANCE_PROVIDERS.map((prov) => (
                        <div
                          key={prov.id}
                          onClick={() => setSelectedProvider(prov)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                            selectedProvider.id === prov.id
                              ? 'border-sky-500 bg-sky-50/70 font-semibold text-slate-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <span className="font-bold">{prov.providerName}</span>
                            <p className="text-[10px] text-slate-500">{prov.charge}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                            ~{prov.etaMinutes}m ETA
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Close Window
                </button>
                <button
                  type="button"
                  onClick={handleTriggerBooking}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  Confirm Ambulance Dispatch
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
