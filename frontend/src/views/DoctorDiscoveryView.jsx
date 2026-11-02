import React, { useState, useEffect, useMemo } from 'react';
import { 
  Stethoscope, 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Video, 
  Phone, 
  Clock, 
  Map as MapIcon, 
  List, 
  Navigation, 
  CheckCircle2, 
  X,
  Building,
  UserCheck
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { SPECIALTIES, MOCK_DOCTORS, MOCK_REVIEWS } from '../data/mockData';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';

// Fix leaflet default marker icons in modern bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom medical pin icon
const medicalIcon = new L.DivIcon({
  className: 'custom-doctor-marker',
  html: `<div style="background-color:#0284c7; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 6px -1px rgba(0,0,0,0.3); font-weight:bold; font-size:16px;">🩺</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

export default function DoctorDiscoveryView({ initialSpecialty = 'all', setActiveTab, setSelectedDoctorForCall }) {
  const { currentLocation, fetchBrowserLocation } = useEmergency();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [maxFee, setMaxFee] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [patientConsentAttached, setPatientConsentAttached] = useState(true);

  useEffect(() => {
    if (initialSpecialty) {
      setSelectedSpecialty(initialSpecialty);
    }
  }, [initialSpecialty]);

  // Haversine distance calculator in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      // Specialty
      if (selectedSpecialty !== 'all' && doc.specialtyId !== selectedSpecialty) {
        return false;
      }
      // Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesCity = doc.city.toLowerCase().includes(q);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(q);
        const matchesClinic = doc.clinicName.toLowerCase().includes(q);
        const matchesPin = doc.pincode.includes(q);
        if (!matchesName && !matchesCity && !matchesSpecialty && !matchesClinic && !matchesPin) {
          return false;
        }
      }
      // Fee
      if (doc.consultationFee > maxFee) return false;
      // Rating
      if (doc.rating < minRating) return false;
      // Online
      if (onlineOnly && !doc.onlineConsultAvailable) return false;

      return true;
    });
  }, [selectedSpecialty, searchQuery, maxFee, minRating, onlineOnly]);

  const handleOpenBooking = (doc) => {
    setSelectedDoctor(doc);
    setSelectedSlot(doc.availableSlots[0] || 'Tomorrow 10:00 AM');
    setBookingConfirmed(false);
    setBookingModalOpen(true);
  };

  const handleConfirmAppointment = () => {
    setBookingConfirmed(true);
  };

  const handleLaunchInstantVideo = (doc) => {
    if (setSelectedDoctorForCall) {
      setSelectedDoctorForCall(doc);
    }
    setActiveTab('consultation');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified Medical Practitioners
            </span>
            <span className="text-xs text-slate-500 font-medium">NMC & State Medical Council Vetted</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find a Verified Doctor Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search by live GPS proximity or city PIN code. Book clinic appointments or start an encrypted video consultation.
          </p>
        </div>

        {/* View Mode Switcher: List vs Map */}
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
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Search & Location Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Query input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, clinic, or PIN code (e.g. Delhi, 110048)..."
              className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* GPS Auto-detect button */}
          <div className="md:col-span-5 flex items-center gap-2">
            <button
              onClick={fetchBrowserLocation}
              disabled={currentLocation.fetching}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-sky-50 text-slate-800 hover:text-sky-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentLocation.fetching ? 'Acquiring GPS...' : 'Use Current GPS'}</span>
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

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          
          {/* Specialty Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            >
              {SPECIALTIES.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Max Fee Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Max Fee: ₹{maxFee}</span>
            <input
              type="range"
              min="500"
              max="2500"
              step="100"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-24 accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Min Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-700"
            >
              <option value={0}>All Ratings</option>
              <option value={4.5}>4.5★ and above</option>
              <option value={4.8}>4.8★ and above</option>
            </select>
          </div>

          {/* Online Consult checkbox */}
          <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-indigo-600" />
              Online Video Consultation Available
            </span>
          </label>
        </div>
      </div>

      {/* Main Results Container: List vs Map */}
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
              {filteredDoctors.map((doc) => (
                <Marker
                  key={doc.id}
                  position={[doc.lat, doc.lng]}
                  icon={medicalIcon}
                >
                  <Popup>
                    <div className="p-1 space-y-1.5 text-xs max-w-[220px]">
                      <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                      <div className="text-sky-700 font-semibold">{doc.specialty}</div>
                      <div className="text-slate-600 text-[11px]">{doc.clinicName}</div>
                      <div className="text-emerald-700 font-medium">{doc.medicalRegistration}</div>
                      <div className="font-bold text-slate-800">Fee: ₹{doc.consultationFee}</div>
                      <button
                        onClick={() => handleOpenBooking(doc)}
                        className="w-full mt-1 px-2.5 py-1 bg-sky-600 text-white rounded-md font-bold text-xs"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <p className="text-xs text-slate-500 italic text-center">
            Click on any medical marker on the map to view verified doctor credentials, clinic timings, and book appointments.
          </p>
        </div>
      ) : (
        /* Doctor Cards Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing <strong>{filteredDoctors.length}</strong> verified medical specialists</span>
            <span>Sorted by clinic relevance & rating</span>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No verified doctors match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your fee filter, clearing the search query, or choosing "All Specialties".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDoctors.map((doc) => {
                const distanceKm = calculateDistance(currentLocation.lat, currentLocation.lng, doc.lat, doc.lng);
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Photo + Core Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-20 h-20 rounded-2xl object-cover object-top border border-slate-200"
                        />
                        {doc.onlineConsultAvailable && (
                          <span
                            className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs"
                            title="Online Video Consultation Ready"
                          >
                            <Video className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                            {doc.specialty}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {doc.rating} ({doc.reviewCount})
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{doc.qualifications}</p>

                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{doc.medicalRegistration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Info: Clinic, Distance, Experience */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-1.5 text-slate-700">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">{doc.clinicName}</span>
                            <p className="text-[11px] text-slate-500">{doc.address}</p>
                          </div>
                        </div>
                        <span className="shrink-0 font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          ~{distanceKm} km
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-600">
                          <strong>Exp:</strong> {doc.experienceYears} Years Clinical
                        </span>
                        <span className="text-slate-600">
                          <strong>Hours:</strong> {doc.openingHours.split('(')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Fees & Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">Consultation Fee</span>
                        <span className="text-base font-black text-slate-900">₹{doc.consultationFee}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.onlineConsultAvailable && (
                          <button
                            onClick={() => handleLaunchInstantVideo(doc)}
                            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1"
                            title="Start encrypted video teleconsultation"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Video Room</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenBooking(doc)}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Slot</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Appointment Booking Modal */}
      {bookingModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">Confirm Doctor Appointment</h3>
                <p className="text-xs text-slate-400 mt-0.5">Verified Medical Practice Booking</p>
              </div>
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {bookingConfirmed ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-slate-900 text-lg">Appointment Confirmed!</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Your appointment with <strong>{selectedDoctor.name}</strong> for <strong>{selectedSlot}</strong> has been booked and synced to your dashboard.
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                    Booking Reference: APT-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setBookingModalOpen(false); setActiveTab('user-dashboard'); }}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold"
                    >
                      View in My Dashboard
                    </button>
                    {selectedDoctor.onlineConsultAvailable && (
                      <button
                        onClick={() => { setBookingModalOpen(false); handleLaunchInstantVideo(selectedDoctor); }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" /> Test Video Room
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Doctor Mini Card */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <img
                      src={selectedDoctor.photo}
                      alt={selectedDoctor.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedDoctor.name}</h4>
                      <p className="text-xs text-sky-700 font-semibold">{selectedDoctor.specialty}</p>
                      <p className="text-[11px] text-slate-500">{selectedDoctor.clinicName}</p>
                    </div>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-2">Available Consultation Slots</label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedDoctor.availableSlots.map((slot, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            selectedSlot === slot
                              ? 'border-sky-600 bg-sky-50 text-sky-800 shadow-2xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consent to share medical history */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-sky-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patientConsentAttached}
                      onChange={(e) => setPatientConsentAttached(e.target.checked)}
                      className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span>
                      Attach my recent <strong>Vera Health AI Screening Reports & Medical Summary</strong> to this appointment so the clinician can review prior to consultation (Consent-Protected under DPDP Act).
                    </span>
                  </label>

                  {/* Summary & Price */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Consultation Fee</span>
                    <span className="text-lg font-black text-slate-900">₹{selectedDoctor.consultationFee}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleConfirmAppointment}
                    className="w-full py-3 bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                  >
                    Confirm Booking for {selectedSlot}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
