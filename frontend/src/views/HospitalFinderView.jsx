import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Search, 
  Navigation, 
  CheckCircle2, 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  Map as MapIcon, 
  List, 
  ExternalLink,
  Flame,
  Bed,
  PhoneCall
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_HOSPITALS } from '../data/mockData';
import { useEmergency } from '../context/EmergencyContext';

// Hospital pin icon for Leaflet
const hospitalIcon = new L.DivIcon({
  className: 'custom-hospital-marker',
  html: `<div style="background-color:#0284c7; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); font-weight:bold; font-size:16px;">🏥</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

export default function HospitalFinderView() {
  const { currentLocation, fetchBrowserLocation, setIsModalOpen } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [hasEmergencyTrauma, setHasEmergencyTrauma] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const filteredHospitals = useMemo(() => {
    return MOCK_HOSPITALS.filter((hosp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = hosp.name.toLowerCase().includes(q);
        const matchesCity = hosp.city.toLowerCase().includes(q);
        const matchesAddress = hosp.address.toLowerCase().includes(q);
        const matchesPin = hosp.pincode.includes(q);
        if (!matchesName && !matchesCity && !matchesAddress && !matchesPin) return false;
      }
      if (selectedSpecialty !== 'all') {
        const hasSpec = hosp.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
        if (!hasSpec) return false;
      }
      return true;
    });
  }, [searchQuery, selectedSpecialty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              Healthcare Facilities Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">Verified NABH & Level-1 Trauma Centers</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Nearby Hospitals & Trauma Centers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Locate acute emergency departments, intensive care units (ICU), diagnostic centers, and verified contact numbers.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals by name, city, locality, or PIN code (e.g. AIIMS, Saket, 110029)..."
              className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={fetchBrowserLocation}
              disabled={currentLocation.fetching}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentLocation.fetching ? 'Locating...' : 'Hospitals Near My GPS'}</span>
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-3 text-xs text-slate-400 hover:text-slate-700 bg-slate-50 rounded-xl border border-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Department:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            >
              <option value="all">All Specialties</option>
              <option value="Trauma">Trauma & Emergency</option>
              <option value="Cardiology">Cardiology / Cath Lab</option>
              <option value="Neurology">Neurology / Stroke</option>
              <option value="Pulmonology">Pulmonology & Respiratory</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>24x7 Emergency Casualty Units Active</span>
          </div>
        </div>
      </div>

      {/* Main Results: List vs Map */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="h-[550px] w-full rounded-2xl overflow-hidden relative">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredHospitals.map((hosp) => (
                <Marker
                  key={hosp.id}
                  position={[hosp.lat, hosp.lng]}
                  icon={hospitalIcon}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs max-w-[220px]">
                      <div className="font-bold text-slate-900 text-sm">{hosp.name}</div>
                      <div className="text-red-600 font-semibold">{hosp.emergencyOpen}</div>
                      <div className="text-slate-600 text-[11px]">{hosp.address}</div>
                      <div className="text-emerald-700 font-bold">ICU Beds: {hosp.icuBedsAvailable} Available</div>
                      <a
                        href={`tel:${hosp.emergencyHotline.split('/')[0]}`}
                        className="block mt-1 text-center py-1 bg-red-600 text-white rounded font-bold text-xs"
                      >
                        Call Emergency Hotline
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      ) : (
        /* Hospital Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHospitals.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    {hosp.type}
                  </span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ★ {hosp.rating}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{hosp.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{hosp.address}</span>
                </p>

                {/* Badges: ICU beds, 24x7 emergency */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">ICU Beds Available</span>
                    <span className="text-lg font-black text-emerald-950">{hosp.icuBedsAvailable} Beds</span>
                  </div>
                  <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-rose-700 uppercase font-bold block">Casualty & Trauma</span>
                    <span className="text-xs font-bold text-rose-950 mt-1 block">{hosp.emergencyOpen}</span>
                  </div>
                </div>

                {/* Specialties chips */}
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                    Key Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.specialties.map((s, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${hosp.emergencyHotline.split('/')[0]}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Emergency: {hosp.emergencyHotline.split('/')[0]}</span>
                </a>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Route Ambulance Here
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
