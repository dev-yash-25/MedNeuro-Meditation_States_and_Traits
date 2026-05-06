import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Activity, BarChart3, Upload, Users, Lightbulb, FileText, Code2 } from "lucide-react";
import {
    ResponsiveContainer,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,

    LineChart,
    Line,

    BarChart,
    Bar,
    XAxis,
    YAxis,

    CartesianGrid,

} from "recharts";


// import HB from "../assets/Epilepsy.mp4";
// import HB from "../assets/BV.webm";
import HB from "../../assets/HB.webm";

import MedLoop from "../../assets/MedA2.webm";
// import MedLoop from "../assets/EEG.mp4";

import BrainWaveEEGTracings from "../../components/UI/BrainWaveEEGTracings";
import ParticipantsPage from "./Participants";
import KeyInsightsPage from "./KeyInsights";

const summaryCards = [
    { title: "Participants", value: 76, icon: Users, tone: "bg-rose-50 text-rose-600" },
    { title: "EEG Channels", value: "64 + 8", icon: Brain, tone: "bg-blue-50 text-blue-600" },
    { title: "Model Accuracy", value: "92.9%", icon: Activity, tone: "bg-emerald-50 text-emerald-600" },
    { title: "Meditation Groups", value: 5, icon: Lightbulb, tone: "bg-amber-50 text-amber-600" },
];

const modules = [
    { title: "EEG Group Analysis", desc: "Compare bands across traditions.", to: "/analytics", icon: BarChart3 },
    { title: "Model Performance", desc: "Review metrics and model behavior.", to: "/compare", icon: Activity },
    { title: "Upload EEG Data", desc: "Predict region from JSON spectral input.", to: "/upload-eeg", icon: Upload },
];


const bandTrendData = [
    { time: "T1", alpha: 0.4, gamma: 0.3 },
    { time: "T2", alpha: 0.55, gamma: 0.45 },
    { time: "T3", alpha: 0.7, gamma: 0.5 },
    { time: "T4", alpha: 0.75, gamma: 0.65 },
    { time: "T5", alpha: 0.8, gamma: 0.7 },
];

const donutData = [
  { name: "SNY", value: 28, color: "#6658d3" },
  { name: "VIP", value: 24, color: "#eb6b8f" },
  { name: "HTR", value: 19, color: "#2db1c4" },
  { name: "TM", value: 16, color: "#f4ba4f" },
  { name: "CTR", value: 13, color: "#f08f3c" },
];

const bandComparisonData = [
    { group: "CTR", alpha: 0.45, gamma: 0.30 },
    { group: "HTR", alpha: 0.40, gamma: 0.28 },
    { group: "SNY", alpha: 0.50, gamma: 0.75 }, // high gamma
    { group: "VIP", alpha: 0.80, gamma: 0.55 }, // high alpha
];

const DashboardMain = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const memoSummaryCards = useMemo(() => summaryCards, []);
    const memoModules = useMemo(() => modules, []);
      const memoDonutData = useMemo(() => donutData, []);


    const sidebarStats = useMemo(
        () => [
            { label: "Shoonya Group", pct: 28, color: "#6658d3" },
            { label: "Vipassana Group", pct: 24, color: "#2db1c4" },
            { label: "Himalayan Group", pct: 19, color: "#eb6b8f" },
            { label: "Transcendental", pct: 16, color: "#f4ba4f" },
            { label: "Control Group", pct: 13, color: "#f08f3c" },
        ],
        []
    );
    const countryRows = useMemo(
        () => [
            { country: "India", weight: "40%", sessions: "3,450" },
            { country: "Nepal", weight: "25%", sessions: "1,950" },
            { country: "Sri Lanka", weight: "20%", sessions: "1,550" },
            { country: "Bhutan", weight: "15%", sessions: "950" },
        ],
        []
    );
    const headingText = useMemo(() => {
        if (activeTab === "participants") return " Electrode Placements & Participants Information";
        if (activeTab === "insights") return "EEG System Key Insights";
        return "EEG Dashboard Overview";
    }, [activeTab]);
    const tabs = useMemo(
        () => [
            { id: "overview", label: "Overview" },
            { id: "participants", label: "Participants" },
            { id: "insights", label: "Key Insights" },
        ],
        []
    );

    return (


        <section className=" ">
            {/* <section className="flex items-stretch gap-5"> */}
            <main className="p-5 sm:p-7 flex-1">


                {/* <h1 className="text-2xl font-semibold text-slate-800 mb-5">EEG Dashboard Overview</h1> */}

                <div className="flex items-center gap-2 mb-2">
                    <video
                        src={HB}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-20 object-contain select-none pointer-events-none"
                    />

                    <h1 className="text-2xl font-semibold text-slate-800">
                        {headingText}
                    </h1>
                </div>
                <div className="border-b border-slate-200 mb-6">
                    <nav className="flex items-center gap-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-2 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? "text-amber-600 border-b-2 border-amber-500"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === "overview" && (
                    <>
                        <section className="flex gap-6">

                            {/* LEFT SIDE (ALL MAIN CONTENT) */}
                            <div className="flex-1 space-y-6">

                                {/* Summary Cards */}
                                {/* <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"> */}
                                <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                                    {memoSummaryCards.map(({ title, value, icon: Icon, tone }) => (
                                        <div key={title} className="rounded-xl border border-slate-200 bg-white p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs text-slate-500">{title}</p>
                                                <span className={`inline-flex p-2 rounded-lg ${tone}`}>
                                                    <Icon size={14} />
                                                </span>
                                            </div>
                                            <p className="text-2xl font-semibold text-slate-800">{value}</p>
                                        </div>
                                    ))}
                                </section>

                                {/* Charts + Quick Actions */}
                                <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                    {/* Donut Chart */}
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 hidden max-sm:block">
                                      <p className="text-sm font-semibold text-slate-700 mb-3">
                                          Tradition Distribution
                                      </p>

                                      <div className="h-64">
                                          <ResponsiveContainer width="100%" height="100%">
                                              <PieChart>
                                                  <Pie
                                                      data={memoDonutData}
                                                      dataKey="value"
                                                      nameKey="name"
                                                      innerRadius={58}
                                                      outerRadius={88}
                                                      paddingAngle={1}
                                                  >
                                                      {memoDonutData.map((entry) => (
                                                          <Cell key={entry.name} fill={entry.color} />
                                                      ))}
                                                  </Pie>
                                                  <Tooltip />
                                                  <Legend />
                                              </PieChart>
                                          </ResponsiveContainer>
                                      </div>
                                  </div>



                                    {/* Bar Chart: Gamma Power Comparison */}
                                    {/* Alpha vs Gamma Comparison */}
                                    <div className="rounded-xl border border-slate-200 bg-white p-5">

                                        {/* Header */}
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-slate-800">
                                                Alpha vs Gamma Power Across Groups
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Comparative spectral modulation across meditation traditions
                                            </p>
                                        </div>

                                        {/* Chart */}
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={bandComparisonData}
                                                    barCategoryGap="25%"
                                                >
                                                    <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />

                                                    <XAxis
                                                        dataKey="group"
                                                        tick={{ fontSize: 12, fill: "#475569" }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />

                                                    <YAxis
                                                        tick={{ fontSize: 12, fill: "#475569" }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />

                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: "8px",
                                                            border: "1px solid #e2e8f0",
                                                            fontSize: "12px",
                                                        }}
                                                    />

                                                    {/* Alpha */}
                                                    <Bar
                                                        dataKey="alpha"
                                                        name="Alpha"
                                                        radius={[6, 6, 0, 0]}
                                                        fill="#6366F1"
                                                    />

                                                    {/* Gamma */}
                                                    <Bar
                                                        dataKey="gamma"
                                                        name="Gamma"
                                                        radius={[6, 6, 0, 0]}
                                                        fill="#22C55E"
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Insight */}
                                        {/* <div className="mt-4 text-xs text-slate-500 leading-relaxed">
                                          Vipassana (VIP) demonstrates dominant alpha activity indicating relaxed awareness,
                                          while Shoonya (SNY) exhibits strong gamma modulation linked to higher-order cognition
                                          and integrative neural processing.
                                      </div> */}
                                    </div>


                                    {/* Quick Actions + Video */}
                                    <div className="rounded-xl border border-slate-200 bg-white p-4 flex gap-4">

                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-700 mb-3">
                                                Quick Actions
                                            </p>

                                            <div className="grid grid-cols-1 gap-3">



                                                {/* 3. Upload EEG */}
                                                <Link
                                                    to="/upload-eeg"
                                                    className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 mb-1 text-slate-700">
                                                        <Upload size={16} className="text-sky-600" />
                                                        <span className="text-sm font-medium">Upload EEG Data</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Upload EEG JSON data to classify and interpret brain activity.
                                                    </p>
                                                </Link>


                                                {/* 1. Research Paper */}
                                                <a
                                                    href="https://link.springer.com/chapter/10.1007/978-3-032-13803-3_14"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 mb-1 text-slate-700">
                                                        <FileText size={16} className="text-black" />
                                                        <span className="text-sm font-medium">Research Publication</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        View the published paper detailing methodology and findings.
                                                    </p>
                                                </a>

                                                {/* 2. Colab Research */}
                                                <a
                                                    href="https://colab.research.google.com/drive/15ZKUyFSTHukC9o8vtCAol-1-3G67iOWc?usp=sharing"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hidden sm:block rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 mb-1 text-slate-700">
                                                        <Code2 size={16} className="text-black" />
                                                        <span className="text-sm font-medium">Research Notebook</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        Explore data processing, analysis, and model implementation.
                                                    </p>
                                                </a>

                                            </div>
                                        </div>

                                        {/* -------------- */}



                                        <div className="w-1/2 flex items-center justify-center">
                                            <video
                                                src={MedLoop}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="w-full h-full max-h-[220px] object-contain rounded-lg select-none pointer-events-none"
                                            />
                                        </div>

                                    </div>
                                </section>

                                {/* EEG Tracing */}
                                <BrainWaveEEGTracings />

                            </div>

                            {/* RIGHT SIDE (ASIDE) */}
                            <aside className="hidden xl:block w-[320px] shrink-0 ">
                                <div className="h-full space-y-5">

                                    {/* Categories */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-slate-700">
                                                Categories Analysis
                                            </p>
                                            <span className="text-slate-400">•••</span>
                                        </div>

                                        {/* Chart */}
                                        <div className="relative w-full h-40">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={sidebarStats}
                                                        dataKey="pct"
                                                        nameKey="label"
                                                        cx="50%"
                                                        cy="100%"
                                                        startAngle={180}
                                                        endAngle={0}
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={2}
                                                        isAnimationActive={true}
                                                        animationDuration={800}
                                                    >
                                                        {sidebarStats.map((entry, index) => (
                                                            <Cell key={index} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>

                                            {/* Center Value */}
                                            <div className="absolute inset-0 flex items-end justify-center pb-4">
                                                <p className="text-xl font-semibold text-slate-800">
                                                    {sidebarStats.reduce((acc, cur) => acc + cur.pct, 0)}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="mt-4 space-y-2">
                                            {sidebarStats.map((row) => (
                                                <div
                                                    key={row.label}
                                                    className="flex items-center justify-between text-xs"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ backgroundColor: row.color }}
                                                        />
                                                        <span className="text-slate-600">{row.label}</span>
                                                    </div>
                                                    <span className="text-slate-500">{row.pct}%</span>
                                                </div>
                                            ))}
                                        </div>

                                    </div>


                                    {/* EEG Trend (Alpha vs Gamma) */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-slate-700">
                                                EEG Band Trends
                                            </p>
                                            <span className="text-slate-400">•••</span>
                                        </div>

                                        {/* Chart */}
                                        <div className="h-44">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={bandTrendData}>

                                                    <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" />

                                                    <XAxis
                                                        dataKey="time"
                                                        tick={{ fontSize: 10 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />

                                                    <YAxis
                                                        hide
                                                    />

                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: "8px",
                                                            border: "1px solid #e2e8f0",
                                                            fontSize: "12px",
                                                        }}
                                                    />

                                                    {/* Alpha */}
                                                    <Line
                                                        type="monotone"
                                                        dataKey="alpha"
                                                        stroke="#6366F1"
                                                        strokeWidth={2}
                                                        dot={false}
                                                    />

                                                    {/* Gamma */}
                                                    <Line
                                                        type="monotone"
                                                        dataKey="gamma"
                                                        stroke="#22C55E"
                                                        strokeWidth={2}
                                                        dot={false}
                                                    />

                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Footer Insight */}
                                        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                                            Alpha shows stable relaxation patterns while gamma reflects cognitive engagement.
                                        </p>

                                    </div>


                                    {/* Countries */}
                                    <div className="rounded-2xl border border-slate-200 bg-white p-4 pb-5">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-slate-700">
                                                Data Collection
                                            </p>
                                            <span className="text-slate-400">•••</span>
                                        </div>

                                        {/* Map (Focused on Rishikesh) */}
                                        <div className="rounded-xl overflow-hidden border border-slate-200 h-48 mb-4">
                                            <iframe
                                                title="Rishikesh Location"
                                                src="https://maps.google.com/maps?q=Rishikesh,India&z=6&output=embed"
                                                className="w-full h-full"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-4 text-xs">

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Location</span>
                                                <span className="text-slate-700 font-medium">Rishikesh, India</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Participants</span>
                                                <span className="text-slate-700 font-medium">~76 Subjects</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Groups</span>
                                                <span className="text-slate-700 font-medium">CTR, HTR, SNY, VIP</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Sessions</span>
                                                <span className="text-slate-700 font-medium">Meditation + Thinking</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">EEG Setup</span>
                                                <span className="text-slate-700 font-medium">64 Channels (10–20)</span>
                                            </div>

                                        </div>

                                        {/* Insight */}
                                        {/* <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                                            EEG data was collected from experienced meditators in Rishikesh, capturing both
                                            meditation and cognitive task states to analyze spectral brainwave patterns.
                                        </p> */}

                                    </div>

                                </div>
                            </aside>

                        </section>
                    </>
                )}

                {activeTab === "participants" && <ParticipantsPage />}
                {activeTab === "insights" && <KeyInsightsPage />}

            </main>




        </section>
    );
};

export default React.memo(DashboardMain);
