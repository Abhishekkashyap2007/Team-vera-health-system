import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  ShieldAlert, 
  Stethoscope, 
  Clock, 
  Camera, 
  Info,
  HelpCircle,
  Eye,
  Smile,
  Wind,
  HeartPulse,
  Brain,
  Bone,
  Activity,
  Printer
} from 'lucide-react';
import { AI_SCREENING_MODULES } from '../data/mockData';
import { runAiScreening } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function AiScreeningView({ selectedModuleId, setActiveTab, setSelectedDoctorSpecialty }) {
  const [activeModule, setActiveModule] = useState(
    () => AI_SCREENING_MODULES.find(m => m.id === selectedModuleId) || AI_SCREENING_MODULES[0]
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('3-5 days');
  const [severity, setSeverity] = useState('Mild / Moderate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [report, setReport] = useState(null);

  const handleSelectModule = (mod) => {
    setActiveModule(mod);
    setSelectedFile(null);
    setPreviewUrl('');
    setReport(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setReport(null);
    }
  };

  const handleUseSampleImage = (url) => {
    setPreviewUrl(url);
    setSelectedFile({ name: 'sample_medical_reference.jpg', size: 124000 });
    setReport(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setReport(null);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 250);

    const result = await runAiScreening(activeModule.id, {
      file: selectedFile,
      symptoms,
      duration,
      severity,
    });

    clearInterval(interval);
    setAnalysisProgress(100);
    setTimeout(() => {
      setIsAnalyzing(false);
      setReport(result);
    }, 400);
  };

  const handleConsultDoctorWithReport = () => {
    if (report?.specialtyId && setSelectedDoctorSpecialty) {
      setSelectedDoctorSpecialty(report.specialtyId);
    }
    setActiveTab('doctors');
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Headline & Safety Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
              Clinical Decision Support
            </span>
            <span className="text-xs text-slate-500 font-medium">Model Ver. 4.2-MedCalibrated</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Health Screening & Clinical Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Computer-vision screening calibrated with clinical uncertainty metrics across 8 organ systems. Preliminary triage only.
          </p>
        </div>

        {/* Medical disclaimer alert badge */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 max-w-md">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-snug">
            <strong>Clinical Safety Notice:</strong> AI screening provides risk stratification only and does not diagnose disease or replace emergency care. If experiencing acute distress, call 112 immediately.
          </p>
        </div>
      </div>

      {/* Module Selector (8 Systems Grid) */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
          Select Body System / Organ for Screening:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {AI_SCREENING_MODULES.map((mod) => {
            const isSelected = activeModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/90 text-sky-800 shadow-xs font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs leading-tight">{mod.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Workspace: Input Column & Live Report Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form & Upload */}
        <div className="lg:col-span-5 space-y-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                {activeModule.badge}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{activeModule.title}</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">{activeModule.bodyPart}</span>
          </div>

          {/* Description & guidelines */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>Supported Input:</strong> {activeModule.supportedInput}</span>
          </div>

          {/* Image Upload Area */}
          {activeModule.id !== 'general' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Upload Medical Photo / Scan / ECG Strip
              </label>

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500 bg-slate-950 max-h-56 flex items-center justify-center group">
                  <img src={previewUrl} alt="Screening Preview" className="max-h-56 w-full object-contain" />
                  <button
                    onClick={() => { setPreviewUrl(''); setSelectedFile(null); }}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-xs transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-2xl p-6 bg-slate-50/50 hover:bg-sky-50/20 cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Click to upload photo or DICOM image</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, DICOM up to 25MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Sample Images Quick Pick */}
              {activeModule.sampleImages?.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                    Or select a reference test image:
                  </span>
                  <div className="flex gap-2">
                    {activeModule.sampleImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleUseSampleImage(img.url)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 font-medium transition-colors border border-slate-200"
                      >
                        Sample: {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Symptoms description input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Describe Symptoms & Health Concern
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Red itchy rash spreading along forearm for 4 days, mild flaking, no fever..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>

          {/* Duration & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option>Less than 24 hours</option>
                <option>1 - 3 days</option>
                <option>3 - 7 days</option>
                <option>1 - 2 weeks</option>
                <option>Over 1 month (Chronic)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Discomfort Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              >
                <option>Mild (Noticeable)</option>
                <option>Moderate (Impacting routine)</option>
                <option>Severe (Significant pain/distress)</option>
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Inference ({analysisProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with {activeModule.badge}</span>
              </>
            )}
          </button>

          {/* Progress Bar when analyzing */}
          {isAnalyzing && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-sky-600 h-1.5 transition-all duration-300 rounded-full"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          )}

        </div>

        {/* Right Column: AI Screening Report */}
        <div className="lg:col-span-7">
          {report ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ✓ AI Analysis Complete
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">{report.screeningId}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">Preliminary Screening Findings</h3>
                  <span className="text-[11px] text-slate-400">
                    Generated: {new Date(report.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintReport}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs flex items-center gap-1 font-semibold"
                    title="Print or Export PDF"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                  <button
                    onClick={handleConsultDoctorWithReport}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" /> Consult Doctor
                  </button>
                </div>
              </div>

              {/* Evaluated Symptom Concern Badge */}
              {report.analyzedSymptoms && report.analyzedSymptoms !== 'Clinical image inspection' && (
                <div className="bg-sky-50/90 border border-sky-200 rounded-2xl px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sky-900">
                    <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="font-semibold text-slate-600">Evaluated Patient Concern:</span>
                    <span className="font-bold text-sky-950 italic">"{report.analyzedSymptoms}"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium">Duration: {report.duration || duration}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-800">
                      {report.severity || severity}
                    </span>
                  </div>
                </div>
              )}

              {/* ChatGPT Clinical Assessment Card */}
              {report.chatGptResponse && (
                <div className="bg-slate-50/90 border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-200 text-xs font-bold text-sky-900">
                    <Sparkles className="w-4 h-4 text-sky-600 animate-spin-slow" />
                    <span>AI Clinical Assessment & Direct Answer (ChatGPT Format)</span>
                    <span className="ml-auto text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Accurate & Calibrated
                    </span>
                  </div>
                  <MarkdownRenderer content={report.chatGptResponse} />
                </div>
              )}

              {/* Primary Observation Card */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-sky-800 tracking-wider block mb-1">
                  Primary Radiographic / Visual Observation
                </span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {report.findings}
                </p>
              </div>

              {/* Calibrated Probability Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Probabilistic Differential Screening
                  </h4>
                  <span className="text-[11px] text-slate-400">Calibrated Confidence Interval</span>
                </div>

                <div className="space-y-2.5">
                  {report.conditions?.map((c, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-normal text-[11px]">Uncertainty {c.uncertainty}</span>
                          <span className="text-sky-700 font-bold">{c.probability}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            i === 0 ? 'bg-sky-600' : i === 1 ? 'bg-cyan-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${c.probability}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triage Urgency & Recommended Specialist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">Triage Priority</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {report.urgency}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Stratification: {report.riskLevel} Risk
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">Recommended Specialist</span>
                  <span className="text-sm font-bold text-sky-700 mt-1 block">
                    {report.recommendedSpecialist}
                  </span>
                  <button
                    onClick={handleConsultDoctorWithReport}
                    className="text-[11px] text-sky-600 font-bold hover:underline mt-0.5 flex items-center gap-1"
                  >
                    View Doctors in this Specialty →
                  </button>
                </div>
              </div>

              {/* Red Flags Alert Box */}
              {report.redFlags?.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Red Flag Warning Signs (Seek Urgent Care if Present):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-rose-900 font-medium">
                    {report.redFlags.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Next Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Recommended Clinical Next Steps
                </h4>
                <div className="space-y-1.5">
                  {report.nextSteps?.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Disclaimers */}
              <div className="bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-normal">
                <strong>Legal & Medical Limitations:</strong> {report.clinicalDisclaimer}
              </div>

              {/* Bottom CTA to attach report to consultation */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-medium">
                  Would you like to share this report with a doctor?
                </span>
                <button
                  onClick={handleConsultDoctorWithReport}
                  className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Book Consultation with this Report</span>
                </button>
              </div>

            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Awaiting Screening Input</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Upload a medical image or enter your symptoms in the left panel, then tap <strong>Analyze</strong> to generate calibrated clinical differential screening metrics.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">✓ Privacy Protected</span>
                <span>•</span>
                <span className="flex items-center gap-1">✓ Calibrated Uncertainty</span>
                <span>•</span>
                <span className="flex items-center gap-1">✓ Specialist Routing</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
