import { useMemo, useState ,useEffect} from "react";
import { Upload, FileJson, Brain, Waves, Sparkles, XCircle } from "lucide-react";
import { predictEEG } from "../api/eegApi";
import LoadingSpinner from "../components/AnalyzingSpiiner";
import { usePredictionStore } from "../store/predictionStore";
import Compare from "./Compare";
import Analytics from "./Analytics";


import HB from "../assets/HB.webm";
import RTImg from "../assets/webp/RTImg.webp";


import Temporal from "../assets/webp/Temporal.webp";
import Occipital from "../assets/webp/Occipital.webp";
import Parietal from "../assets/webp/Parietal.webp";
import Frontal from "../assets/webp/Frontal.webp";






const requiredKeys = ["theta_rel", "alpha_rel", "beta_rel", "gamma_rel", "channel"];

const InsightCard = ({ title, value, icon: Icon }) => (
  <div className="rounded-xl border border-indigo-100 dark:border-indigo-800 bg-white/80 dark:bg-gray-900/40 p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className="text-indigo-600 dark:text-indigo-300" />
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>
    </div>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value}</p>
  </div>
);

const UploadEEGData = () => {
  const { prediction, fileName, setPredictionData, clearPredictionData } = usePredictionStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const [activeTab, setActiveTab] = useState("upload");

  const title = useMemo(() => {
    if (activeTab === "compare") return "EEG Compare Analysis";
    if (activeTab === "analytics") return "EEG Analytics Overview";
    return "Regional Classifier Evaluation";
  }, [activeTab]);

  const validatePayload = (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("JSON must contain a single object.");
    }

    const missing = requiredKeys.filter((key) => !(key in data));
    if (missing.length > 0) {
      throw new Error(`Missing keys: ${missing.join(", ")}`);
    }

    for (const key of ["theta_rel", "alpha_rel", "beta_rel", "gamma_rel"]) {
      if (Number.isNaN(Number(data[key]))) {
        throw new Error(`Field '${key}' must be numeric.`);
      }
    }

    if (!String(data.channel || "").trim()) {
      throw new Error("Field 'channel' must be a non-empty string.");
    }
  };

  //no spinning
  // const onFileChange = async (event) => {
  //   const file = event.target.files?.[0];
  //   setError("");

  //   if (!file) return;
  //   if (!file.name.toLowerCase().endsWith(".json")) {
  //     setError("Please upload a .json file.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const text = await file.text();
  //     const payload = JSON.parse(text);
  //     validatePayload(payload);

  //     const response = await predictEEG(payload);
  //     const result = response?.prediction;
  //     if (!result?.region) {
  //       throw new Error("Invalid response from backend.");
  //     }

  //     setPredictionData({ prediction: result, fileName: file.name });
  //   } catch (err) {
  //     setError(err.message || "Failed to process file.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // spin for 2 seconds
  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Please upload a .json file.");
      return;
    }

    setLoading(true);

    const startTime = Date.now();

    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      validatePayload(payload);

      const response = await predictEEG(payload);
      const result = response?.prediction;

      if (!result?.region) {
        throw new Error("Invalid response from backend.");
      }

      setPredictionData({ prediction: result, fileName: file.name });

    } catch (err) {
      setError(err.message || "Failed to process file.");
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = 2500 - elapsed;

      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    }
  };




  //============================================================


  const regionImages = {
    Frontal: Frontal,
    Parietal: Parietal,
    Occipital: Occipital,
    Temporal: Temporal,
  };

  const selectedImage = prediction?.region
    ? regionImages[prediction.region] || Frontal
    : null;

  const renderUploadContent = () => (

    
    <>
    
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-8 sm:px-8 sm:py-10 mb-5">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            {/* Left — main heading + description */}
            <div className="space-y-5 lg:max-w-2xl">
              <div className="inline-flex items-center gap-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  MedNeuro
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="text-xs font-medium text-slate-500">
                  EEG System
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Regional Classifier
              </h1>

              <p className="text-base leading-relaxed text-slate-600">
              Input EEG features are classified into a specific brain region, 
              which provide insights on brainwave patterns and cognitive 
              states based on subject Meditative State
              </p>
            </div>
            {/* Right — 4 status blocks in 2×2 grid */}
            <div className="grid grid-cols-2 gap-4 self-start lg:grid-cols-2 lg:gap-5 lg:min-w-[320px] xl:min-w-[360px]">
             

              {/* Card 4 - Last Recommendation (capsule icon) */}
              <div className="rounded-xl    px-3 py-3 flex flex-col justify-between min-h-[110px]">
                <img
                  className="w-40"
                  src={RTImg} />
              </div>


              {/* Card 1 - Available Symptoms */}
              
              <div className="rounded-xl border border-slate-100 bg-slate-100/50 px-5 py-5 flex flex-col justify-between min-h-[110px]">
                <div className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                  Meditation Traditions
                </div>
                <div className="mt-3 text-2xl font-semibold text-slate-900">
                  5
                </div>
              </div>

              

              {/* Card 2 - Detected Diseases */}
              <div className="rounded-xl border border-slate-100 bg-slate-100/50 px-5 py-5 flex flex-col justify-between min-h-[110px]">
                <div className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                  Subjects
                </div>
                <div className="mt-3 text-2xl font-semibold text-slate-900">
                  76 {/* ← replace with real count when available */}
                </div>
              </div>
              {/* Status */}




              <div className="rounded-xl border border-slate-100 bg-slate-100/50 px-5 py-4">
                <div className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                  Status
                </div>
                <div className={`
          mt-2.5 text-lg font-medium
          ${loading ? 'text-amber-700' : 'text-emerald-700'}
        `}>
                  {loading ? 'Analyzing…' : 'Ready'}
                </div>
              </div>


            </div>


          </div>
        </section>


    <section className="rounded-2xl border border-gray-200 bg-white  dark:border-gray-700 shadow-sm p-5 md:p-8">
      <label className="block border-2 border-dashed border-[#0eb1e3] dark:border-indigo-700 rounded-xl p-10 text-center cursor-pointer hover:bg-[#f5feff] dark:hover:bg-indigo-900/20 transition-colors">
        <input type="file" accept=".json,application/json" className="hidden" onChange={onFileChange} />
        <Upload className="w-10 h-10 mx-auto text-[#0eb1e3] dark:text-indigo-300 mb-3" />
        <p className="text-gray-800 dark:text-gray-200 font-semibold">Upload EEG Signature</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {/* Required fields: theta_rel, alpha_rel, beta_rel, gamma_rel, channel */}
          Please Input JSON Data
        </p>
      </label>

      {fileName && (
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
          <FileJson size={16} /> {fileName}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex justify-center h-[100px] items-center">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <p className="mt-5 text-red-600 dark:text-red-400 font-medium">{error}</p>
      )}

        {prediction && !loading && (
          <div className="mt-8 space-y-5">

            {/* ===== TOP RESULT CARD ===== */}
            <div className="relative rounded-2xl border border-emerald-300/60 bg-green-100/50 dark:from-emerald-900/30 dark:to-gray-900 p-6 shadow-sm">

              {/* subtle glow */}
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/5 blur-xl pointer-events-none"></div>

              <div className="relative flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                    Predicted Brain Region
                  </p>

                  {/*  Highlighted result */}
                  <div className="mt-2 flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-200 text-sm font-semibold tracking-wide shadow-sm">
                      {prediction.region}
                    </span>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      High Confidence Mapping
                    </span>
                  </div>
                </div>

                <button
                  onClick={clearPredictionData}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  <XCircle size={14} /> Clear
                </button>
              </div>
            </div>

            {/* ===== INSIGHT CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

              {/* LEFT SIDE */}
              <div className="flex flex-col gap-4">

                {/* Brainwaves */}
                <div className="rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-indigo-900/20 p-4 h-[150px]">
                  <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
                    <Waves size={16} />
                    <span className="text-sm font-semibold uppercase">Brainwaves</span>
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {prediction.brainwaves?.join(", ") || "N/A"}
                  </p>
                </div>

                {/* Technical */}
                <div className="rounded-xl border border-sky-200 dark:border-sky-700 bg-white dark:bg-sky-900/20 p-4 h-[150px]">
                  <div className="flex items-center gap-2 mb-2 text-sky-700 dark:text-sky-300">
                    <Brain size={16} />
                    <span className="text-am font-semibold uppercase">Technical</span>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {prediction.description || "N/A"}
                  </p>
                </div>

              </div>

              {/* CENTER IMAGE */}
              <div className="flex justify-center items-center">
                <div className="w-[320px] h-[300px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center">

                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={prediction?.region}
                      className="w-full h-full object-contain transition-all duration-300"
                    />
                  ) : (
                    <p className="text-xs text-gray-400">No prediction yet</p>
                  )}

                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col gap-4">

                {/* Cognitive State */}
                <div className="rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-purple-900/20 p-4 h-[150px]">
                  <div className="flex items-center gap-2 mb-2 text-purple-700 dark:text-purple-300">
                    <Sparkles size={16} />
                    <span className="text-sm font-semibold uppercase">Cognitive State</span>
                  </div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    {prediction.state || "N/A"}
                  </p>
                </div>

                {/* Interpretation */}
                <div className="rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-amber-900/20 p-4 h-[150px]">
                  <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-300">
                    <FileJson size={16} />
                    <span className="text-sm font-semibold uppercase">Interpretation</span>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {prediction.insight || "N/A"}
                  </p>
                </div>

              </div>

            </div>


          </div>
        )}
    </section>
    </>
  );

  return (
    // <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:from-gray-950 dark:to-gray-900 p-6 md:p-8">
    <div className="min-h-screen  dark:from-gray-950 dark:to-gray-900 p-6 md:p-8">
      <div className=" ">
      {/* <div className="max-w-7xl mx-auto gap-6  "> */}
        <div className="flex items-center gap-2 mb-2">
          {/* <Brain className="w-7 h-7 text-indigo-600 dark:text-indigo-300" /> */}

          <div className="p-2">
            <video
              src={HB}
              autoPlay
              loop
              muted
              playsInline
              className="w-20  object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">
            {title}
          </h1>

        </div>

        <div className="border-b border-slate-200 mb-6">
          <nav className="flex items-center gap-8 overflow-x-auto">
            {[
              { id: "upload", label: "Upload Data" },
              { id: "compare", label: "Compare" },
              { id: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-amber-600 border-b-2 border-amber-500"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "upload" && renderUploadContent()}
        {activeTab === "compare" && (
          <div className=" p-2">
          {/* <div className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-2"> */}
            <Compare />
          </div>
        )}
        {activeTab === "analytics" && (
          <div className=" p-2">
          {/* <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-2"> */}
            <Analytics />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadEEGData;
