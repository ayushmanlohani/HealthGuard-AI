import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";
import { predictHealthRisk } from "../services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRiskLevel = (v) => {
    if (v == null || isNaN(v)) return "Unknown";
    if (v <= 30) return "Low";
    if (v <= 55) return "Moderate";
    if (v <= 75) return "High";
    return "Critical";
};
const getRiskColor = (v) => {
    if (v == null || isNaN(v)) return "#94a3b8";
    if (v <= 30) return "#10b981";
    if (v <= 55) return "#f59e0b";
    if (v <= 75) return "#f97316";
    return "#ef4444";
};
const safeNum = (v, fallback = 0) =>
    v == null || isNaN(Number(v)) ? fallback : Number(v);

// ─── Half-Circle Gauge (flat side down, perfectly horizontal) ─────────────────
const HalfGauge = ({ value, origValue }) => {
    const safe = Math.min(100, Math.max(0, safeNum(value, 0)));
    const orig = safeNum(origValue, safe);
    const color = getRiskColor(safe);
    const level = getRiskLevel(safe);
    const diff = +(safe - orig).toFixed(1);
    const diffColor = diff < 0 ? "#10b981" : diff > 0 ? "#ef4444" : "#94a3b8";

    // PERFECT MATH & SCALING
    const R = 70; // Slightly smaller to prevent text clipping
    const cx = 100, cy = 90; // Shifted up to give bottom labels room
    const fillDeg = 180 - (safe / 100) * 180;

    const toRad = (d) => (d * Math.PI) / 180;

    // CRITICAL: Both px and py MUST be calculated this way to draw the dome properly
    const px = (deg) => cx + R * Math.cos(toRad(deg));
    const py = (deg) => cy - R * Math.sin(toRad(deg)); // The minus sign fixes the blob!

    const bgStart = { x: px(180), y: py(180) };
    const bgEnd = { x: px(0), y: py(0) };
    const fgEnd = { x: px(fillDeg), y: py(fillDeg) };
    const largeArc = (180 - fillDeg) > 180 ? 1 : 0;

    // Needle dot coordinates perfectly centered on the line
    const nx = px(fillDeg);
    const ny = py(fillDeg);

    return (
        // Added justifyContent: "center" to center both items perfectly
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px", width: "100%" }}>

            {/* Gauge SVG — left side */}
            <div style={{ flexShrink: 0, width: "145px" }}>
                <svg
                    viewBox="20 10 160 115"
                    style={{ width: "100%", display: "block", overflow: "visible" }}
                >
                    {/* Track arc */}
                    <path
                        d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 0 1 ${bgEnd.x} ${bgEnd.y}`}
                        fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round"
                    />
                    {/* Filled green/orange/red arc */}
                    {safe > 0 && (
                        <path
                            d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 ${largeArc} 1 ${fgEnd.x} ${fgEnd.y}`}
                            fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                            style={{ transition: "all 0.5s ease" }}
                        />
                    )}
                    {/* Needle dot */}
                    <circle cx={nx} cy={ny} r="6" fill="white" stroke={color} strokeWidth="3.5"
                        style={{ transition: "all 0.5s ease" }} />

                    {/* Value inside */}
                    <text x={cx} y={cy - 10} textAnchor="middle"
                        fontSize="22" fontWeight="900" fill={color}
                        style={{ transition: "fill 0.4s" }}>
                        {safe}%
                    </text>
                    <text x={cx} y={cy + 8} textAnchor="middle"
                        fontSize="10" fill="#94a3b8" fontWeight="800" textTransform="uppercase">
                        {level}
                    </text>

                    {/* Zone labels */}
                    <text x="30" y="110" textAnchor="middle" fontSize="9" fill="#10b981" fontWeight="800">LOW</text>
                    <text x="170" y="110" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="800">HIGH</text>
                </svg>
            </div>

            {/* Delta info — right side */}
            {/* Removed flex: 1 so it hugs the center tightly next to the SVG */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

                {/* Hides the pill completely if there is no change */}
                {diff !== 0 && (
                    <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        padding: "5px 12px", borderRadius: "999px",
                        backgroundColor: diff < 0 ? "#ecfdf5" : "#fef2f2",
                        border: `1px solid ${diff < 0 ? "#6ee7b7" : "#fca5a5"}`,
                        fontSize: "20px", fontWeight: 900,
                        color: diffColor, alignSelf: "flex-start",
                        transition: "all 0.4s ease",
                    }}>
                        {diff > 0 ? `+${diff}%` : `${diff}%`}
                    </div>
                )}

                <div style={{ fontSize: "12px", fontWeight: 700, color: diffColor }}>
                    {diff < 0 ? "↓ improvement" : diff > 0 ? "↑ getting worse" : "no change yet"}
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, lineHeight: 1.4 }}>
                    {orig}% → <span style={{ color, fontWeight: 800 }}>{safe}%</span>
                    <br />{getRiskLevel(orig)} → <span style={{ color, fontWeight: 800 }}>{level}</span>
                </div>
            </div>
        </div>
    );
}
// ─── Smooth Slider ────────────────────────────────────────────────────────────
const SmoothSlider = ({ value, min, max, step = 1, onChange, helperText }) => {
    const pct = ((value - min) / (max - min)) * 100;
    const col = pct === 0 ? "#cbd5e1" : pct < 40 ? "#10b981" : pct < 70 ? "#f59e0b" : "#ef4444";
    return (
        <div>
            <div style={{
                position: "relative", height: "8px", borderRadius: "999px",
                background: `linear-gradient(90deg,${col} 0%,${col} ${pct}%,#e2e8f0 ${pct}%)`,
                marginTop: "8px",
            }}>
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)",
                        width: "100%", height: "30px", /* Expanded height for easier grabbing */
                        opacity: 0, cursor: "pointer", margin: 0, zIndex: 2,
                        touchAction: "none",
                    }}
                />
                <div style={{
                    position: "absolute", top: "50%", left: `${pct}%`,
                    transform: "translate(-50%,-50%)",
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: "white",
                    border: `3px solid ${pct === 0 ? "#cbd5e1" : "#0ea5e9"}`,
                    boxShadow: `0 2px 10px ${pct === 0 ? "rgba(0,0,0,0.08)" : "rgba(14,165,233,0.35)"}`,
                    pointerEvents: "none",
                    transition: "left 0.05s linear, border-color 0.3s",
                    zIndex: 1,
                }} />
            </div>
            {helperText && (
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px", lineHeight: 1.4 }}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

// ─── Toggle Pill ──────────────────────────────────────────────────────────────
const TogglePill = ({ label, active, onClick, color = "#0ea5e9" }) => (
    <button onClick={onClick} style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "8px 16px", borderRadius: "999px",
        border: `2px solid ${active ? color : "#e2e8f0"}`,
        backgroundColor: active ? color + "18" : "white",
        color: active ? color : "#94a3b8",
        fontSize: "13px", fontWeight: 700,
        cursor: "pointer", transition: "all 0.18s ease", outline: "none",
        boxShadow: active ? `0 0 0 3px ${color}18` : "none",
    }}>
        <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            backgroundColor: active ? color : "#cbd5e1",
            flexShrink: 0, transition: "background 0.18s",
        }} />
        {label}
    </button>
);

// ─── Achievement Toast ────────────────────────────────────────────────────────
const AchievementToast = ({ message, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div style={{
            position: "fixed", top: "24px", right: "24px", zIndex: 9999,
            background: "linear-gradient(135deg,#1e1b4b,#312e81)",
            color: "white", borderRadius: "16px", padding: "16px 20px",
            boxShadow: "0 20px 60px rgba(79,70,229,0.45)",
            display: "flex", alignItems: "center", gap: "12px",
            maxWidth: "340px", animation: "toastIn 0.4s ease",
        }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🏆</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 800, marginBottom: "2px" }}>Milestone Reached!</div>
                <div style={{ fontSize: "12px", color: "#c4b5fd", lineHeight: 1.4 }}>{message}</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", fontSize: "20px", padding: 0 }}>×</button>
        </div>
    );
};

// ─── Guard ────────────────────────────────────────────────────────────────────
const Simulator = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, userData } = location.state || {};
    if (!results || !userData) {
        return (
            <div style={{ fontFamily: "'Inter',sans-serif", backgroundColor: "#f4f9fd", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
                <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "48px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "420px" }}>
                    <div style={{ fontSize: "52px", marginBottom: "16px" }}>⚠️</div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", marginBottom: "10px" }}>No Results Found</h2>
                    <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, marginBottom: "24px" }}>Please complete the health assessment first.</p>
                    <button style={{ background: "linear-gradient(90deg,#18d4ba,#0ca7e8)", color: "white", padding: "14px 28px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, border: "none", cursor: "pointer" }} onClick={() => navigate("/assessment")}>
                        Go to Assessment →
                    </button>
                </div>
            </div>
        );
    }
    return <SimulatorInner results={results} userData={userData} />;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const SimulatorInner = ({ results, userData }) => {
    const navigate = useNavigate();

    const card = {
        backgroundColor: "white", borderRadius: "20px", padding: "28px",
        boxShadow: "0 4px 24px -4px rgba(0,0,0,0.06),0 0 0 1px rgba(14,165,233,0.1),0 0 20px rgba(14,165,233,0.07)",
        border: "1px solid rgba(14,165,233,0.14)",
    };
    const iconBox = (g, sh) => ({
        width: "52px", height: "52px", borderRadius: "16px", background: g, boxShadow: sh,
        display: "flex", alignItems: "center", justifyContent: "center",
    });
    const cardHead = {
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: "8px", marginBottom: "24px",
    };

    // ── Safe originals ─────────────────────────────────────────────────────────
    const origDia = safeNum(results?.diabetes_risk, 0);
    const origHeart = safeNum(results?.heart_disease_risk, 0);
    // FIX 3: lock smoking to user's original value if they are a non-smoker
    const userIsSmoker = userData.smoking_history === "Yes";
    const userExercises = userData.exercise === "Yes";

    // ── State ──────────────────────────────────────────────────────────────────
    const [weightLossKg, setWeightLossKg] = useState(0);
    const [exercise, setExercise] = useState(userExercises ? "yes" : "no");
    // FIX 3: non-smoker value is locked — can't be changed to smoker via applyOptimal
    const [smoking, setSmoking] = useState(userIsSmoker ? "yes" : "no");
    const [diet, setDiet] = useState("current");
    // FIX 4: alcohol slider — start at user's current value
    const [alcoholPerWeek, setAlcoholPerWeek] = useState(safeNum(userData.alcohol_consumption, 0));

    const [projected, setProjected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiErr, setApiErr] = useState("");
    const debounceRef = useRef(null);

    const [toast, setToast] = useState(null);
    const prevLevelRef = useRef({
        dia: getRiskLevel(origDia),
        heart: getRiskLevel(origHeart),
    });

    const [weightProjection, setWeightProjection] = useState([]);
    const [projectionLoading, setProjectionLoading] = useState(false);

    const [optimalResult, setOptimalResult] = useState(null);
    const [optimalLoading, setOptimalLoading] = useState(false);
    const [optimalBuilt, setOptimalBuilt] = useState(false);

    // ── Modified payload ───────────────────────────────────────────────────────
    const modifiedPayload = useMemo(() => {
        const mod = { ...userData };
        mod.weight = Math.max(30, safeNum(userData.weight, 70) - weightLossKg);
        mod.exercise = exercise === "yes" ? "Yes" : "No";
        mod.smoking_history = smoking === "yes" ? "Yes" : "No";
        mod.alcohol_consumption = alcoholPerWeek; // FIX 4
        if (diet === "improve") {
            mod.fruit_consumption = Math.min(120, safeNum(userData.fruit_consumption, 0) + 20);
            mod.green_vegetables_consumption = Math.min(120, safeNum(userData.green_vegetables_consumption, 0) + 15);
            mod.fried_potato_consumption = Math.max(0, safeNum(userData.fried_potato_consumption, 0) - 10);
        } else if (diet === "optimal") {
            mod.fruit_consumption = 60;
            mod.green_vegetables_consumption = 60;
            mod.fried_potato_consumption = 5;
        }
        return mod;
    }, [userData, weightLossKg, exercise, smoking, diet, alcoholPerWeek, userIsSmoker]);

    // ── Live prediction ────────────────────────────────────────────────────────
    useEffect(() => {
        setApiErr("");
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await predictHealthRisk(modifiedPayload);
                setProjected(res);
                const nd = getRiskLevel(safeNum(res?.diabetes_risk));
                const nh = getRiskLevel(safeNum(res?.heart_disease_risk));
                const prev = prevLevelRef.current;
                const order = ["Critical", "High", "Moderate", "Low"];
                const improved = (p, n) => order.indexOf(n) > order.indexOf(p);
                if (improved(prev.dia, nd)) setToast(`🩸 Diabetes moved from ${prev.dia} → ${nd} Risk!`);
                else if (improved(prev.heart, nh)) setToast(`❤️ Heart moved from ${prev.heart} → ${nh} Risk!`);
                prevLevelRef.current = { dia: nd, heart: nh };
            } catch (e) {
                setApiErr(e?.response?.data?.detail || "Simulation failed.");
            } finally {
                setLoading(false);
            }
        }, 120);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [modifiedPayload]);

    // ── Weight projection on mount ─────────────────────────────────────────────
    useEffect(() => {
        const run = async () => {
            setProjectionLoading(true);
            try {
                const steps = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
                const rows = await Promise.all(steps.map(async (kg) => {
                    const payload = { ...userData, weight: Math.max(30, safeNum(userData.weight, 70) - kg) };
                    const r = await predictHealthRisk(payload);
                    return { kg, diabetes: safeNum(r?.diabetes_risk, origDia), heart: safeNum(r?.heart_disease_risk, origHeart) };
                }));
                setWeightProjection(rows);
            } catch (e) { console.error(e); }
            finally { setProjectionLoading(false); }
        };
        run();
    }, [userData]);

    // ── Optimal changes ────────────────────────────────────────────────────────
    const buildOptimalChanges = useCallback(async () => {
        setOptimalLoading(true);
        setOptimalBuilt(false);
        try {
            const base = { ...userData };
            const smokingVals = ["No"]; // The optimal health recommendation will always be 'No'
            const exerciseVals = userExercises ? ["Yes"] : ["No", "Yes"];
            const dietVals = ["current", "improve", "optimal"];
            const weightVals = [0, 5, 10, 15, 20];
            // FIX 4: alcohol options — try reducing in steps, but not lower than 0
            const currentAlcohol = safeNum(userData.alcohol_consumption, 0);
            const alcoholVals = currentAlcohol <= 2
                ? [currentAlcohol]  // already low — don't bother changing
                : [currentAlcohol, Math.max(0, currentAlcohol - 3), Math.max(0, currentAlcohol - 7), 0];

            const combos = [];
            for (const sm of smokingVals)
                for (const ex of exerciseVals)
                    for (const dt of dietVals)
                        for (const wt of weightVals)
                            for (const al of alcoholVals) {
                                const payload = { ...base };
                                payload.smoking_history = sm;
                                payload.exercise = ex;
                                payload.weight = Math.max(30, safeNum(base.weight, 70) - wt);
                                payload.alcohol_consumption = al;
                                if (dt === "improve") {
                                    payload.fruit_consumption = Math.min(120, safeNum(base.fruit_consumption, 0) + 20);
                                    payload.green_vegetables_consumption = Math.min(120, safeNum(base.green_vegetables_consumption, 0) + 15);
                                    payload.fried_potato_consumption = Math.max(0, safeNum(base.fried_potato_consumption, 0) - 10);
                                } else if (dt === "optimal") {
                                    payload.fruit_consumption = 60;
                                    payload.green_vegetables_consumption = 60;
                                    payload.fried_potato_consumption = 5;
                                }
                                combos.push({ payload, sm, ex, dt, wt, al });
                            }

            const results_all = await Promise.all(combos.map(async (c) => {
                const r = await predictHealthRisk(c.payload);
                return {
                    ...c,
                    dia: safeNum(r?.diabetes_risk, origDia),
                    heart: safeNum(r?.heart_disease_risk, origHeart),
                    total: safeNum(r?.diabetes_risk, origDia) + safeNum(r?.heart_disease_risk, origHeart),
                };
            }));

            const best = results_all.reduce((a, b) => b.total < a.total ? b : a);
            setOptimalResult(best);
            setOptimalBuilt(true);
        } catch (e) {
            setApiErr("Could not calculate optimal changes.");
        } finally {
            setOptimalLoading(false);
        }
    }, [userData, origDia, origHeart, userIsSmoker, userExercises]);

    // ── Apply optimal — FIX 3: never touches smoking if user is non-smoker ────
    const applyOptimal = () => {
        if (!optimalResult) return;
        setWeightLossKg(optimalResult.wt);
        setExercise(optimalResult.ex === "Yes" ? "yes" : "no");
        setSmoking(optimalResult.sm === "Yes" ? "yes" : "no");
        // FIX 4: apply optimal alcohol
        setAlcoholPerWeek(optimalResult.al);
        setDiet(optimalResult.dt);
    };

    // ── Derived ────────────────────────────────────────────────────────────────
    const afterDia = safeNum(projected?.diabetes_risk, origDia);
    const afterHeart = safeNum(projected?.heart_disease_risk, origHeart);
    const diffDia = +(afterDia - origDia).toFixed(1);
    const diffHeart = +(afterHeart - origHeart).toFixed(1);

    const nothingChanged = weightLossKg === 0
        && exercise === (userExercises ? "yes" : "no")
        && smoking === (userIsSmoker ? "yes" : "no")
        && diet === "current"
        && alcoholPerWeek === safeNum(userData.alcohol_consumption, 0);

    const planItems = [
        weightLossKg > 0 && `⚖️ Lose ${weightLossKg} kg  (${safeNum(userData.weight)} kg → ${Math.max(30, safeNum(userData.weight) - weightLossKg)} kg)`,
        exercise === "yes" && !userExercises && "🏃 Start exercising regularly",
        smoking !== (userIsSmoker ? "yes" : "no") && (smoking === "yes" ? "🚬 Start smoking (Increases risk)" : "🚭 Quit smoking"),
        diet === "improve" && "🥗 Improve diet — more fruit & veg, less fried food",
        diet === "optimal" && "🥗 Switch to optimal diet (recommended targets)",
        alcoholPerWeek < safeNum(userData.alcohol_consumption, 0) && `🍺 Reduce alcohol: ${safeNum(userData.alcohol_consumption, 0)} → ${alcoholPerWeek} drinks/week`,
    ].filter(Boolean);

    const projYDomain = useMemo(() => {
        if (weightProjection.length === 0) return [0, 100];
        const allVals = weightProjection.flatMap((r) => [r.diabetes, r.heart]);
        const mn = Math.min(...allVals), mx = Math.max(...allVals);
        const pad = Math.max(4, (mx - mn) * 0.6);
        return [Math.max(0, Math.floor(mn - pad)), Math.min(100, Math.ceil(mx + pad))];
    }, [weightProjection]);

    const currentAlcohol = safeNum(userData.alcohol_consumption, 0);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ fontFamily: "'Inter','Segoe UI',Roboto,sans-serif", backgroundColor: "#f4f9fd", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
            <style>{`
                @keyframes toastIn { from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1} }
                @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.35} }
                button:focus{outline:none;}
                input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;}
                input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:30px;height:30px;cursor:pointer;}
                input[type=range]::-moz-range-thumb{width:30px;height:30px;border:none;cursor:pointer;background:transparent;}
            `}</style>

            {/* Decor */}
            <div style={{ position: "absolute", top: 0, right: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(77,184,255,0.22) 0%,transparent 70%)", filter: "blur(70px)", zIndex: 0, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "15%", left: "-8%", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }} />

            {toast && <AchievementToast message={toast} onClose={() => setToast(null)} />}

            {/* Nav */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 8%", position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#1a365d", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/")}>
                    <span style={{ color: "#1cbccf", fontSize: "26px" }}>🛡️</span> HealthGuard AI
                </div>
                <div style={{ display: "flex", gap: "28px", fontSize: "14px", fontWeight: 600, color: "#64748b" }}>
                    {["Home", "Assessment", "Results"].map((l) => (
                        <span key={l} style={{ cursor: "pointer" }}
                            onClick={() => navigate(l === "Home" ? "/" : `/${l.toLowerCase()}`, l === "Results" ? { state: { results, userData } } : undefined)}>
                            {l}
                        </span>
                    ))}
                </div>
            </nav>

            <div style={{ maxWidth: "1020px", margin: "0 auto", padding: "10px 24px 80px", position: "relative", zIndex: 1 }}>

                {/* Back */}
                <button
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#64748b", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginBottom: "24px" }}
                    onClick={() => navigate("/results", { state: { results, userData } })}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back to Results
                </button>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(6,182,212,0.1)", color: "#0e7490", padding: "7px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: 700, marginBottom: "14px" }}>
                        🎯 What-If Simulator
                    </div>
                    <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
                        Lifestyle <span style={{ color: "#1cbccf" }}>Impact</span> Simulator
                    </h1>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, maxWidth: "620px", margin: "0 auto" }}>
                        Adjust your habits and watch your risk scores update <strong>live</strong> using the same ML model from your assessment.
                    </p>
                </div>

                {/* ══ SECTION 1: Controls + Projected Risk side by side ══ */}
                {/* FIX 1: align-items stretch so both cards match height */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px",
                    alignItems: "stretch",   // ← FIX 1
                }}>

                    {/* LEFT: Adjust Lifestyle */}
                    <div style={{ ...card, display: "flex", flexDirection: "column" }}>
                        <div style={cardHead}>
                            <div style={iconBox("linear-gradient(135deg,#2dd4bf,#0ea5e9)", "0 6px 20px rgba(14,165,233,0.25)")}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="5" r="2" /><circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
                                    <line x1="12" y1="7" x2="12" y2="19" /><line x1="6" y1="14" x2="6" y2="19" /><line x1="18" y1="14" x2="18" y2="19" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1e293b", margin: 0 }}>Adjust Your Lifestyle</h3>
                            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Changes update your risk live on the right</p>
                        </div>

                        {/* Weight */}
                        <div style={{ marginBottom: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>⚖️ Weight Loss</label>
                                <span style={{ fontSize: "13px", fontWeight: 800, background: "linear-gradient(90deg,#18d4ba,#0ca7e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    {weightLossKg === 0 ? "No change" : `−${weightLossKg} kg`}
                                </span>
                            </div>
                            <SmoothSlider
                                value={weightLossKg} min={0} max={20} step={1}
                                onChange={setWeightLossKg}
                                helperText={weightLossKg === 0
                                    ? `Current: ${safeNum(userData.weight, "?")} kg — drag right to simulate loss`
                                    : `${safeNum(userData.weight, 0)} kg → ${Math.max(30, safeNum(userData.weight, 0) - weightLossKg)} kg`}
                            />
                        </div>

                        {/* Exercise */}
                        <div style={{ marginBottom: "18px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>🏃 Exercise</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                <TogglePill label="Not Exercising" active={exercise === "no"} onClick={() => setExercise("no")} color="#94a3b8" />
                                <TogglePill label="Exercising Regularly" active={exercise === "yes"} onClick={() => setExercise("yes")} color="#10b981" />
                            </div>
                        </div>

                        {/* Smoking */}
                        <div style={{ marginBottom: "18px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>🚭 Smoking</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                <TogglePill label="Non-smoker" active={smoking === "no"} onClick={() => setSmoking("no")} color="#10b981" />
                                <TogglePill label="Smoking" active={smoking === "yes"} onClick={() => setSmoking("yes")} color="#ef4444" />
                            </div>
                        </div>

                        {/* Diet */}
                        <div style={{ marginBottom: "18px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>🥗 Diet Quality</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                <TogglePill label="Current Diet" active={diet === "current"} onClick={() => setDiet("current")} color="#94a3b8" />
                                <TogglePill label="Improved" active={diet === "improve"} onClick={() => setDiet("improve")} color="#f59e0b" />
                                <TogglePill label="Optimal" active={diet === "optimal"} onClick={() => setDiet("optimal")} color="#10b981" />
                            </div>
                            {diet === "improve" && <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>+20 fruit, +15 veg, −10 fried servings/month</div>}
                            {diet === "optimal" && <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>60 fruit, 60 veg, 5 fried food servings/month</div>}
                        </div>

                        {/* FIX 4: Alcohol slider */}
                        <div style={{ marginBottom: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>🍺 Alcohol Consumption</label>
                                <span style={{
                                    fontSize: "13px", fontWeight: 800,
                                    color: alcoholPerWeek === 0 ? "#10b981" : alcoholPerWeek <= 7 ? "#f59e0b" : "#ef4444",
                                    backgroundColor: alcoholPerWeek === 0 ? "#ecfdf5" : alcoholPerWeek <= 7 ? "#fffbeb" : "#fef2f2",
                                    padding: "2px 10px", borderRadius: "999px",
                                    border: `1px solid ${alcoholPerWeek === 0 ? "#6ee7b7" : alcoholPerWeek <= 7 ? "#fde68a" : "#fca5a5"}`,
                                }}>
                                    {alcoholPerWeek === 0 ? "None" : `${alcoholPerWeek} drinks/wk`}
                                </span>
                            </div>
                            <SmoothSlider
                                value={alcoholPerWeek}
                                min={0}
                                max={30}
                                step={1}
                                onChange={setAlcoholPerWeek}
                                helperText={
                                    alcoholPerWeek === 0 ? "No alcohol — optimal for health"
                                        : alcoholPerWeek <= 7 ? `${alcoholPerWeek} drinks/week — moderate (recommended limit: 7/week)`
                                            : `${alcoholPerWeek} drinks/week — above recommended limit. Consider reducing.`
                                }
                            />
                        </div>

                        {/* Loading/error — pushed to bottom */}
                        <div style={{ marginTop: "auto" }}>
                            {loading && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                                    <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#0ea5e9", animation: "blink 1s infinite" }} />
                                    <span style={{ fontSize: "12px", color: "#0ea5e9", fontWeight: 700 }}>Recalculating...</span>
                                </div>
                            )}
                            {apiErr && (
                                <div style={{ marginTop: "10px", padding: "10px 14px", backgroundColor: "#fef2f2", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 600 }}>
                                    ⚠️ {apiErr}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Projected Risk — 2 horizontal half-gauges stacked */}
                    {/* FIX 1: flex column + stretch to fill */}
                    <div style={{ ...card, display: "flex", flexDirection: "column" }}>
                        <div style={cardHead}>
                            <div style={iconBox("linear-gradient(135deg,#06b6d4,#6366f1)", "0 6px 20px rgba(99,102,241,0.25)")}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1e293b", margin: 0 }}>Your Projected Risk</h3>
                            <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                                {nothingChanged ? "Change something on the left to see your risk shift" : "Live ML prediction based on your choices"}
                            </p>
                        </div>

                        {/* FIX 2: Two horizontal half-circle gauges stacked */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>

                            {/* Diabetes gauge box */}
                            <div style={{
                                padding: "18px 20px",
                                backgroundColor: "#f8fafc",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "10px", textAlign: "center" }}>
                                    🩸 Diabetes Risk
                                </div>
                                <HalfGauge value={afterDia} origValue={origDia} />
                            </div>

                            {/* Heart gauge box */}
                            <div style={{
                                padding: "18px 20px",
                                backgroundColor: "#f8fafc",
                                borderRadius: "16px",
                                border: "1px solid #e2e8f0",
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "10px", textAlign: "center" }}>
                                    ❤️ Heart Disease Risk
                                </div>
                                <HalfGauge value={afterHeart} origValue={origHeart} />
                            </div>

                        </div>

                        {nothingChanged && (
                            <div style={{ marginTop: "16px", textAlign: "center", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1", color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                                👈 Adjust controls to see changes
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ SECTION 2: Weight Loss Trajectory ═══════════════════════ */}
                <div style={{ ...card, marginBottom: "20px" }}>
                    <div style={cardHead}>
                        <div style={iconBox("linear-gradient(135deg,#f59e0b,#f97316)", "0 6px 20px rgba(245,158,11,0.28)")}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1e293b", margin: 0 }}>Weight Loss Risk Trajectory</h3>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Each point is a live ML prediction — Y-axis zoomed to show every change clearly</p>
                    </div>
                    {projectionLoading ? (
                        <div style={{ textAlign: "center", padding: "48px 20px", color: "#0ea5e9", fontWeight: 700 }}>
                            <div style={{ animation: "blink 1.2s infinite", marginBottom: "8px", fontSize: "20px" }}>⚡</div>
                            Building trajectory from 11 live ML predictions...
                        </div>
                    ) : weightProjection.length > 0 ? (
                        <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0" }}>
                            <div style={{ fontSize: "13px", fontWeight: 800, color: "#1e293b", marginBottom: "2px" }}>Risk % vs Weight Lost</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "14px" }}>Y-axis zoomed to your data range — blue dashed line marks your current slider position</div>
                            <div style={{ width: "100%", height: 280 }}>
                                <ResponsiveContainer>
                                    <LineChart data={weightProjection} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="kg" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}kg`}
                                            label={{ value: "kg lost →", position: "insideBottomRight", offset: -4, fill: "#94a3b8", fontSize: 10 }} />
                                        <YAxis stroke="#64748b" fontSize={11} domain={projYDomain} tickFormatter={(v) => `${v}%`} />
                                        <ReferenceLine x={weightLossKg} stroke="#0ea5e9" strokeDasharray="4 4"
                                            label={{ value: "You", fill: "#0ea5e9", fontSize: 11, position: "top" }} />
                                        <Tooltip
                                            formatter={(val, name) => [`${val}%`, name === "diabetes" ? "🩸 Diabetes" : "❤️ Heart"]}
                                            labelFormatter={(v) => `Weight lost: ${v} kg`}
                                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontSize: "13px" }}
                                        />
                                        <Legend formatter={(v) => v === "diabetes" ? "🩸 Diabetes Risk" : "❤️ Heart Risk"} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                                        <Line type="monotone" dataKey="diabetes" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: "#06b6d4", strokeWidth: 0 }} activeDot={{ r: 6 }} name="diabetes" />
                                        <Line type="monotone" dataKey="heart" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6 }} name="heart" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8" }}>Trajectory unavailable — check connection.</div>
                    )}
                </div>

                {/* ══ SECTION 3: Optimal Changes ══════════════════════════════ */}
                <div style={{ ...card, marginBottom: "20px" }}>
                    <div style={cardHead}>
                        <div style={iconBox("linear-gradient(135deg,#8b5cf6,#6366f1)", "0 6px 20px rgba(139,92,246,0.28)")}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#1e293b", margin: 0 }}>Optimal Changes For You</h3>
                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0, maxWidth: "480px" }}>
                            Tests every combination of your lifestyle inputs to find the lowest possible risk — then tells you exactly what to change
                        </p>
                    </div>

                    {!optimalBuilt ? (
                        <div style={{ textAlign: "center" }}>
                            <button
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "10px",
                                    background: "linear-gradient(90deg,#8b5cf6,#6366f1)",
                                    color: "white", padding: "14px 28px", borderRadius: "12px",
                                    fontSize: "14px", fontWeight: 800, border: "none", cursor: "pointer",
                                    boxShadow: "0 8px 24px -4px rgba(139,92,246,0.4)",
                                    opacity: optimalLoading ? 0.7 : 1, transition: "transform 0.2s",
                                }}
                                onClick={buildOptimalChanges}
                                disabled={optimalLoading}
                                onMouseOver={(e) => !optimalLoading && (e.currentTarget.style.transform = "translateY(-2px)")}
                                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                {optimalLoading ? (
                                    <><span style={{ animation: "blink 1s infinite" }}>⚡</span> Testing combinations...</>
                                ) : (
                                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg> Find My Optimal Changes</>
                                )}
                            </button>
                            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>
                                Tests multiple combinations using your ML model
                            </div>
                        </div>
                    ) : optimalResult && (
                        <>
                            {/* FIX 5: Best possible outcome — centred */}
                            <div style={{
                                background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
                                borderRadius: "16px", padding: "24px 20px",
                                border: "1px solid #c4b5fd",
                                marginBottom: "20px",
                                textAlign: "center",       // ← FIX 5
                            }}>
                                <div style={{ fontSize: "12px", fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
                                    ✨ Best Possible Outcome
                                </div>
                                {/* FIX 5: centred flex row */}
                                <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Diabetes Risk</div>
                                        <div style={{ fontSize: "38px", fontWeight: 900, color: "#10b981", lineHeight: 1 }}>
                                            {optimalResult.dia.toFixed(1)}%
                                        </div>
                                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", marginTop: "4px" }}>
                                            was {origDia}% &nbsp;·&nbsp; −{(origDia - optimalResult.dia).toFixed(1)}%
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ width: "1px", height: "60px", backgroundColor: "#c4b5fd", flexShrink: 0 }} />

                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>Heart Risk</div>
                                        <div style={{ fontSize: "38px", fontWeight: 900, color: "#10b981", lineHeight: 1 }}>
                                            {optimalResult.heart.toFixed(1)}%
                                        </div>
                                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", marginTop: "4px" }}>
                                            was {origHeart}% &nbsp;·&nbsp; −{(origHeart - optimalResult.heart).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommended changes */}
                            <div style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b", marginBottom: "12px" }}>
                                📋 To achieve this, here's what to do:
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                                {/* Weight */}
                                {[
                                    {
                                        emoji: "⚖️",
                                        bg: "#dbeafe",
                                        title: optimalResult.wt === 0 ? "Maintain current weight" : `Lose ${optimalResult.wt} kg`,
                                        desc: optimalResult.wt === 0 ? `Keep your current weight of ${safeNum(userData.weight)} kg` : `${safeNum(userData.weight)} kg → ${Math.max(30, safeNum(userData.weight) - optimalResult.wt)} kg`,
                                        changed: optimalResult.wt > 0,
                                    },
                                    {
                                        emoji: "🏃",
                                        bg: "#dcfce7",
                                        title: optimalResult.ex === "Yes" ? "Exercise regularly" : "Maintain current exercise level",
                                        desc: optimalResult.ex === "Yes" ? "At least 150 min/week of moderate activity" : "No change required",
                                        changed: !userExercises && optimalResult.ex === "Yes",
                                    },
                                    {
                                        emoji: "🚭",
                                        bg: optimalResult.sm === "No" ? "#dcfce7" : "#fee2e2",
                                        title: optimalResult.sm === "No" ? "Non-smoker" : "Quit smoking",
                                        desc: optimalResult.sm === "No" ? "Optimal for heart health" : "Reduces heart risk significantly",
                                        changed: optimalResult.sm !== (userIsSmoker ? "Yes" : "No"),
                                    },
                                    {
                                        emoji: "🥗",
                                        bg: "#fef3c7",
                                        title: optimalResult.dt === "current" ? "Keep current diet" : optimalResult.dt === "improve" ? "Improve your diet" : "Switch to optimal diet",
                                        desc: optimalResult.dt === "current" ? "No dietary changes needed" : optimalResult.dt === "improve" ? "+20 fruit, +15 veg, −10 fried servings/month" : "60 fruit, 60 veg, max 5 fried servings/month",
                                        changed: optimalResult.dt !== "current",
                                    },
                                    // FIX 4: Alcohol recommendation
                                    {
                                        emoji: "🍺",
                                        bg: "#fef9c3",
                                        title: optimalResult.al === currentAlcohol
                                            ? "Keep current alcohol intake"
                                            : optimalResult.al === 0
                                                ? "Stop drinking alcohol"
                                                : `Reduce alcohol to ${optimalResult.al} drinks/week`,
                                        desc: optimalResult.al === currentAlcohol
                                            ? currentAlcohol <= 2
                                                ? "Your alcohol intake is already low — no change needed"
                                                : `${currentAlcohol} drinks/week — reducing would help but other changes are more impactful`
                                            : optimalResult.al === 0
                                                ? `Currently ${currentAlcohol} drinks/week — eliminating alcohol reduces cardiac risk`
                                                : `Reduce from ${currentAlcohol} to ${optimalResult.al} drinks/week`,
                                        changed: optimalResult.al < currentAlcohol,
                                    },
                                ].map((item) => (
                                    <div key={item.emoji} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                                            {item.emoji}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{item.title}</div>
                                            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{item.desc}</div>
                                        </div>
                                        <div style={{ marginLeft: "auto", flexShrink: 0, fontSize: "12px", fontWeight: 700, color: item.changed ? "#10b981" : "#94a3b8", backgroundColor: item.changed ? "#ecfdf5" : "#f8fafc", padding: "4px 10px", borderRadius: "999px", border: `1px solid ${item.changed ? "#6ee7b7" : "#e2e8f0"}` }}>
                                            {item.changed ? "✅ Change" : "✓ Keep"}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Apply + recalculate */}
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                <button
                                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(90deg,#8b5cf6,#6366f1)", color: "white", padding: "12px 22px", borderRadius: "12px", fontSize: "13px", fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 8px 20px -4px rgba(139,92,246,0.35)", transition: "transform 0.2s" }}
                                    onClick={applyOptimal}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                                >
                                    ✨ Apply These Changes to Simulator
                                </button>
                                <button
                                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "white", color: "#64748b", padding: "12px 22px", borderRadius: "12px", fontSize: "13px", fontWeight: 700, border: "1.5px solid #e2e8f0", cursor: "pointer", transition: "border-color 0.2s" }}
                                    onClick={() => { setOptimalBuilt(false); setOptimalResult(null); }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#94a3b8"}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                                >
                                    ↺ Recalculate
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* ══ SECTION 4: Action Plan ════════════════════════════════════ */}
                <div style={{
                    background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                    borderRadius: "20px", padding: "28px",
                    border: "1px solid rgba(14,165,233,0.25)",
                    boxShadow: "0 10px 40px -10px rgba(14,165,233,0.2)",
                    marginBottom: "20px",
                }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(14,165,233,0.12)", color: "#0369a1", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>
                        🔒 Your Committed Action Plan
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 16px 0" }}>
                        {planItems.length > 0 ? "Here's what you've chosen to change:" : "No changes selected yet"}
                    </h3>

                    {planItems.length > 0 ? (
                        <>
                            {planItems.map((item) => (
                                <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600, color: "#0f172a", padding: "11px 14px", borderRadius: "10px", backgroundColor: "white", border: "1px solid #bae6fd", marginBottom: "8px" }}>
                                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#10b981", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "white", fontWeight: 800 }}>✓</div>
                                    {item}
                                </div>
                            ))}
                            <div style={{ marginTop: "16px", padding: "16px 20px", backgroundColor: "white", borderRadius: "14px", border: "1px solid #bae6fd", display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Diabetes projection</div>
                                    <div style={{ fontSize: "28px", fontWeight: 900, color: diffDia <= 0 ? "#10b981" : "#ef4444" }}>
                                        {diffDia > 0 ? "+" : ""}{diffDia}%
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Heart risk projection</div>
                                    <div style={{ fontSize: "28px", fontWeight: 900, color: diffHeart <= 0 ? "#10b981" : "#ef4444" }}>
                                        {diffHeart > 0 ? "+" : ""}{diffHeart}%
                                    </div>
                                </div>
                                {(diffDia < 0 || diffHeart < 0) && (
                                    <div style={{ alignSelf: "center", fontSize: "14px", fontWeight: 700, color: "#0369a1" }}>
                                        🎉 Moving from <strong>{getRiskLevel(Math.max(origDia, origHeart))}</strong> → <strong style={{ color: "#10b981" }}>{getRiskLevel(Math.max(afterDia, afterHeart))}</strong> Risk
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.7 }}>
                            Use the controls above to select lifestyle changes. Your personalised action plan will appear here automatically.
                        </p>
                    )}

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
                        <button
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(90deg,#18d4ba,#0ca7e8)", color: "white", padding: "13px 26px", borderRadius: "12px", fontSize: "14px", fontWeight: 800, border: "none", cursor: "pointer", boxShadow: "0 8px 24px -4px rgba(12,167,232,0.35)", transition: "transform 0.2s" }}
                            onClick={() => navigate("/download", { state: { results, userData, simulation: { weightLossKg, exercisePlan: exercise, smokingPlan: smoking, dietPlan: diet, alcoholPerWeek }, projected } })}
                            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download Full Report
                        </button>
                        <button
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "white", color: "#0f172a", padding: "13px 26px", borderRadius: "12px", fontSize: "14px", fontWeight: 800, border: "1.5px solid #e2e8f0", cursor: "pointer", transition: "border-color 0.2s" }}
                            onClick={() =>
                                navigate("/download", {
                                    state: {
                                        results,
                                        userData,
                                        simulation: {
                                            weightLossKg,
                                            exercisePlan: exercise,
                                            smokingPlan: smoking,
                                            dietPlan: diet,
                                            alcoholPerWeek,
                                        },
                                        projected,
                                        weightProjection,   // for weight trajectory chart
                                        optimalResult,      // to show optimal values (if applied)
                                        planItems,          // action plan checklist
                                    }
                                })
                            }
                            onMouseOver={(e) => e.currentTarget.style.borderColor = "#0ea5e9"}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                        >
                            ← Back to Results
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Simulator;