import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  User, 
  Send, 
  Clock, 
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-react';
import { MOCK_DOCTORS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { askAiQuestion } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function ConsultationView({ doctorForCall = null, setActiveTab }) {
  const { currentUser } = useAuth();
  const [activeDoctor, setActiveDoctor] = useState(doctorForCall || MOCK_DOCTORS[0]);
  
  // Media states
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState('connected'); // 'connecting' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(145); // seconds
  const [cameraError, setCameraError] = useState(null);

  // Tabs in consultation room
  const [activePanel, setActivePanel] = useState('chat'); // 'chat' | 'records' | 'prescription'

  // Chat messages
  const [messages, setMessages] = useState([
    { sender: 'doctor', text: 'Hello! I am Dr. Priya Sharma. I have received your consent and am currently reviewing your dermatological screening report.', time: '04:32 PM' },
    { sender: 'user', text: 'Thank you doctor. The rash appeared about 4 days ago with mild itching.', time: '04:33 PM' },
    { sender: 'doctor', text: 'The erythema and mild scaling are very consistent with contact dermatitis. Could you show me the area under natural lighting?', time: '04:34 PM' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isDoctorTyping, setIsDoctorTyping] = useState(false);

  // Prescription notes
  const [prescription, setPrescription] = useState({
    diagnosis: 'Contact Dermatitis / Mild Eczematous Reaction (ICD-10 L25.9)',
    medications: [
      { name: 'Cetirizine 10mg Tablets', dosage: '1 tablet at bedtime for 5 days', instructions: 'After food' },
      { name: 'Hydrocortisone 1% Topical Cream', dosage: 'Apply thin film twice daily for 5 days', instructions: 'Apply only on affected patches' },
      { name: 'Liquid Paraffin + White Soft Paraffin Emollient', dosage: 'Apply liberally 3-4 times daily', instructions: 'Maintain skin barrier hydration' },
    ],
    advice: 'Avoid harsh scented soaps, wool fabrics, or chemical solvents. Return if blistering or bacterial weeping occurs.',
    followUp: '7 Days via Video Teleconsultation',
  });

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Start local camera stream
  useEffect(() => {
    let localStream = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamRef.current = localStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
          setCameraError(null);
        }
      } catch (err) {
        console.warn('Camera/Mic access denied or simulated environment:', err.message);
        setCameraError('Camera/Mic permission not granted. Running in simulated clinical video mode.');
      }
    };

    startCamera();

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoActive;
      }
    }
    setIsVideoActive(!isVideoActive);
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isAudioMuted;
      }
    }
    setIsAudioMuted(!isAudioMuted);
  };

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCallStatus('ended');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userText = inputMessage.trim();
    if (!userText) return;

    const isUser = currentUser?.role !== 'doctor';
    const newMsg = {
      sender: isUser ? 'user' : 'doctor',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // If patient asked a question, attending clinician dynamically responds
    if (isUser) {
      setIsDoctorTyping(true);
      try {
        const response = await askAiQuestion(userText);
        setTimeout(() => {
          setIsDoctorTyping(false);
          const doctorReply = {
            sender: 'doctor',
            text: response.answer,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, doctorReply]);
        }, 1200);
      } catch (err) {
        setIsDoctorTyping(false);
      }
    }
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Session Status Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Video className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">Live Telemedicine Consultation</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                End-to-End Encrypted WebRTC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Consulting with <span className="text-white font-semibold">{activeDoctor.name}</span> ({activeDoctor.specialty})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-slate-300">{formatDuration(callDuration)}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-4 h-4" />
            <span>NMC Telemedicine Verified</span>
          </div>
        </div>
      </div>

      {callStatus === 'ended' ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-600">
            <PhoneOff className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Consultation Session Completed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your telemedicine consultation with {activeDoctor.name} has concluded. Your digital prescription and clinical notes are saved in your Health Dashboard.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('user-dashboard')}
              className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-500"
            >
              Go to Patient Dashboard
            </button>
            <button
              onClick={() => { setCallStatus('connected'); setCallDuration(0); }}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
            >
              Rejoin Session
            </button>
          </div>
        </div>
      ) : (
        /* Video Conference Room Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Video Stage & Controls (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Main Stage: Remote Doctor Feed + Local Floating PiP */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
              
              {/* Doctor Main Video (Simulated HD Clinical Feed) */}
              <img
                src={activeDoctor.photo}
                alt={activeDoctor.name}
                className="w-full h-full object-cover opacity-90"
              />

              {/* Doctor Name Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>{activeDoctor.name} (Attending Physician)</span>
              </div>

              {/* Clinical AI Report Overlay Indicator */}
              <div className="absolute top-4 right-4 bg-sky-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-400/30 text-sky-200 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>AI Screening Data Synced with Consent</span>
              </div>

              {/* Floating Self-View (Local PiP Video) */}
              <div className="absolute bottom-4 right-4 w-44 sm:w-52 aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-white/30 shadow-2xl">
                {isVideoActive ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs gap-1">
                    <VideoOff className="w-5 h-5 text-slate-500" />
                    <span>Camera Off</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white font-medium">
                  You {isAudioMuted && '(Muted)'}
                </div>
              </div>

              {cameraError && (
                <div className="absolute bottom-4 left-4 bg-amber-950/90 border border-amber-600/40 text-amber-200 text-[11px] p-2 rounded-xl max-w-xs">
                  {cameraError}
                </div>
              )}
            </div>

            {/* Bottom Call Controls Bar */}
            <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {/* Audio Toggle */}
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-xl border transition-all ${
                    isAudioMuted
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                >
                  {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Video Toggle */}
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-xl border transition-all ${
                    !isVideoActive
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isVideoActive ? 'Stop Video' : 'Start Video'}
                >
                  {isVideoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Screen Share */}
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-xl border transition-all ${
                    isScreenSharing
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="Share Medical Scans / Screen"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="px-6 py-3 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Consultation</span>
              </button>
            </div>

          </div>

          {/* Right: Interactive Consultation Workspace (Chat, AI Report, Prescription) (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[580px]">
            
            {/* Tab Header */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
              <button
                onClick={() => setActivePanel('chat')}
                className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activePanel === 'chat'
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => setActivePanel('records')}
                className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activePanel === 'records'
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Report</span>
              </button>

              <button
                onClick={() => setActivePanel('prescription')}
                className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                  activePanel === 'prescription'
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Rx Pad</span>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {/* CHAT TAB */}
              {activePanel === 'chat' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-3 overflow-y-auto pr-1">
                    {messages.map((msg, i) => {
                      const isMe = msg.sender === 'user';
                      return (
                        <div
                          key={i}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs ${
                              isMe
                                ? 'bg-sky-600 text-white rounded-br-xs'
                                : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                            }`}
                          >
                            <span className="text-[10px] font-bold block opacity-75 mb-0.5">
                              {isMe ? 'You' : activeDoctor.name}
                            </span>
                            {isMe ? (
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                              <MarkdownRenderer content={msg.text} />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                        </div>
                      );
                    })}

                    {isDoctorTyping && (
                      <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-2xl rounded-bl-xs text-xs text-slate-500 max-w-[85%]">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                        <span className="font-medium">{activeDoctor.name} is reviewing and formulating clinical advice...</span>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type clinical question or observation..."
                      className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* AI REPORT TAB */}
              {activePanel === 'records' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200">
                    <span className="text-[10px] font-bold uppercase text-sky-800 block mb-1">
                      Patient Consented Screening File
                    </span>
                    <h4 className="font-bold text-slate-900">Module: Dermatological Screener</h4>
                    <p className="text-slate-600 text-[11px] mt-1 leading-normal">
                      Findings: Superficial erythematous patch with mild scaling consistent with contact dermatitis.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px] block">
                      Differential Likelihood:
                    </span>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Contact Dermatitis</span>
                      <span className="font-bold text-sky-700">74% ± 6%</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Seborrheic Dermatitis</span>
                      <span className="font-bold text-slate-600">18% ± 4%</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                    <strong>Clinician Disclaimer:</strong> Patient health records shared under the DPDP Act 2023 with verified time-limited token.
                  </div>
                </div>
              )}

              {/* PRESCRIPTION TAB */}
              {activePanel === 'prescription' && (
                <div className="space-y-3 text-xs">
                  <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Official e-Prescription</h4>
                      <p className="text-[11px] text-slate-500">MCI-38291 • {activeDoctor.name}</p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Clinical Diagnosis</span>
                    <p className="font-bold text-slate-800 mt-0.5">{prescription.diagnosis}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      Prescribed Medications:
                    </span>
                    {prescription.medications.map((med, i) => (
                      <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-0.5">
                        <span className="font-bold text-sky-800">{med.name}</span>
                        <p className="text-slate-600 text-[11px]">{med.dosage}</p>
                        <p className="text-slate-400 text-[10px] italic">{med.instructions}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    <strong>Advice:</strong> {prescription.advice}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
