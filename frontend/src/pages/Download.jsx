import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toPng } from "html-to-image";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

/** OUTER component: guard only */
const Download = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state || {};

    if (!state.results || !state.userData) {
        return (
            <div style={{ padding: 40, fontFamily: "Inter, sans-serif" }}>
                <h2>No data found</h2>
                <p>Please complete the assessment and results first.</p>
                <button onClick={() => navigate("/assessment")}>Go to Assessment</button>
            </div>
        );
    }

    return <DownloadInner {...state} />;
};

/** INNER component: all hooks live here */
const DownloadInner = ({
    results,
    userData,
    simulation,
    projected,
    weightProjection,
    optimalResult,
    planItems,
}) => {
    const navigate = useNavigate();

    // ---------------- PDF-safe text helpers (NO emojis/unicode) ----------------
    const stripUnicode = (s) => String(s || "").replace(/[^\x20-\x7E]/g, "");
    const bulletize = (s) => `- ${stripUnicode(s)}`;

    // ---------------- Derived values ----------------
    const healthScore = useMemo(() => {
        const dia = Number(results.diabetes_risk || 0);
        const heart = Number(results.heart_disease_risk || 0);
        return +(100 - (dia + heart) / 2).toFixed(1);
    }, [results]);

    const projectedHealthScore = useMemo(() => {
        if (!projected) return null;
        const dia = Number(projected.diabetes_risk || 0);
        const heart = Number(projected.heart_disease_risk || 0);
        return +(100 - (dia + heart) / 2).toFixed(1);
    }, [projected]);

    // ---------------- Recommendations (clean bullets) ----------------
    const recommendations = useMemo(() => {
        const recs = [];
        const bmi = Number(results.bmi || 0);

        if (bmi > 25) recs.push(`Weight management: Your BMI is ${bmi}. Aim to lose 5-10% body weight.`);
        if (userData.exercise === "No") recs.push(`Start exercise: Target 150 minutes/week moderate activity.`);
        if (userData.smoking_history === "Yes") recs.push(`Stop smoking: Quitting reduces heart risk significantly.`);
        if (Number(userData.alcohol_consumption || 0) > 7) recs.push(`Reduce alcohol: Keep <= 7 drinks/week (recommended).`);
        if (
            Number(userData.fruit_consumption || 0) < 20 ||
            Number(userData.green_vegetables_consumption || 0) < 20
        ) recs.push(`Improve diet: Increase fruits/vegetables and reduce fried foods.`);
        recs.push(`Regular checkups: Schedule annual screenings and monitor BP and glucose.`);
        return recs;
    }, [results, userData]);

    // ---------------- Charts data ----------------
    const chartRiskSummary = useMemo(
        () => [
            { name: "Diabetes", Risk: Number(results.diabetes_risk || 0) },
            { name: "Heart Disease", Risk: Number(results.heart_disease_risk || 0) },
        ],
        [results]
    );

    const chartBeforeAfter = useMemo(
        () => [
            {
                name: "Diabetes",
                Current: Number(results.diabetes_risk || 0),
                After: Number(projected?.diabetes_risk ?? results.diabetes_risk ?? 0),
            },
            {
                name: "Heart Disease",
                Current: Number(results.heart_disease_risk || 0),
                After: Number(projected?.heart_disease_risk ?? results.heart_disease_risk ?? 0),
            },
        ],
        [results, projected]
    );

    const weightSeries = Array.isArray(weightProjection) ? weightProjection : [];

    // ---------------- Chart DOM refs for capture ----------------
    const riskBoxRef = useRef(null);
    const beforeAfterBoxRef = useRef(null);
    const trajBoxRef = useRef(null);

    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfError, setPdfError] = useState("");

    // ---------------- PDF generator ----------------
    const downloadPDF = async () => {
        setPdfError("");
        setPdfLoading(true);

        try {
            // Make sure charts are rendered before capture
            await new Promise((r) => setTimeout(r, 150));

            const doc = new jsPDF({ unit: "pt", format: "a4" });
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const margin = 44;

            const line = (y) => {
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(1);
                doc.line(margin, y, pageW - margin, y);
            };

            const ensureSpace = (y, needed) => {
                if (y + needed > pageH - margin) {
                    doc.addPage();
                    return margin;
                }
                return y;
            };

            const sectionTitle = (title, y) => {
                y = ensureSpace(y, 44);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12.5);
                doc.setTextColor(15, 23, 42);
                doc.text(title, margin, y);
                line(y + 10);
                return y + 26;
            };

            /**
             * Keep heading WITH image:
             * - we reserve space for title+image together
             * - if not enough, we add a page first
             * - we also resize image to fit page safely
             */
            const addChartBlock = async (title, chartEl, y) => {
                const titleBlock = 26;
                const maxImgW = pageW - margin * 2;

                // capture DOM to PNG
                const dataUrl = await toPng(chartEl, {
                    cacheBust: true,
                    pixelRatio: 2,
                    backgroundColor: "#ffffff",
                });

                // choose height that fits (avoid huge blank spaces)
                const imgH = Math.min(260, maxImgW * 0.50);
                const blockNeeded = titleBlock + imgH + 16;

                y = ensureSpace(y, blockNeeded);

                // title + divider
                y = sectionTitle(title, y);

                // image
                doc.addImage(dataUrl, "PNG", margin, y, maxImgW, imgH);
                return y + imgH + 16;
            };

            // ================= HEADER (centered) =================
            const cx = pageW / 2;

            // logo circle
            doc.setFillColor(14, 165, 233);
            doc.circle(cx, 58, 18, "F");

            // simple white shield using lines (no polygon)
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(2);
            doc.line(cx, 44, cx + 12, 50);
            doc.line(cx + 12, 50, cx + 10, 64);
            doc.line(cx + 10, 64, cx, 73);
            doc.line(cx, 73, cx - 10, 64);
            doc.line(cx - 10, 64, cx - 12, 50);
            doc.line(cx - 12, 50, cx, 44);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(18);
            doc.text("HealthGuard AI", cx, 98, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(100, 116, 139);
            doc.text("Medical Risk Assessment Report", cx, 116, { align: "center" });
            doc.setFontSize(9.5);
            doc.text(`Generated: ${new Date().toLocaleString()}`, cx, 134, { align: "center" });

            line(148);

            let y = 174;

            // ================= Patient Snapshot =================
            y = sectionTitle("Patient Snapshot", y);

            autoTable(doc, {
                startY: y,
                head: [["Field", "Value"]],
                body: [
                    ["Age Category", stripUnicode(userData.age_category)],
                    ["Sex", stripUnicode(userData.sex)],
                    ["Height (cm)", String(userData.height)],
                    ["Weight (kg)", String(userData.weight)],
                    ["BMI", String(results.bmi)],
                    ["General Health", stripUnicode(userData.general_health)],
                ],
                theme: "grid",
                styles: { font: "helvetica", fontSize: 9.5, cellPadding: 7 },
                headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: margin, right: margin },
            });

            y = doc.lastAutoTable.finalY + 14;

            // ================= Risk Summary =================
            y = sectionTitle("Risk Summary", y);

            autoTable(doc, {
                startY: y,
                head: [["Metric", "Value", "Level"]],
                body: [
                    ["Diabetes Risk", `${results.diabetes_risk}%`, stripUnicode(results.diabetes_level)],
                    ["Heart Disease Risk", `${results.heart_disease_risk}%`, stripUnicode(results.heart_disease_level)],
                    ["Health Score", `${healthScore}/100`, healthScore >= 70 ? "Good" : healthScore >= 40 ? "Average" : "Low"],
                ],
                theme: "grid",
                styles: { font: "helvetica", fontSize: 9.5, cellPadding: 7 },
                headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: margin, right: margin },
            });

            y = doc.lastAutoTable.finalY + 12;

            // ================= Chart: Risk Summary =================
            y = await addChartBlock("Risk Summary Chart", riskBoxRef.current, y);

            // ================= Selected Changes & Impact =================
            y = sectionTitle("Selected Changes & Impact", y);

            const afterDia = Number(projected?.diabetes_risk ?? results.diabetes_risk ?? 0);
            const afterHeart = Number(projected?.heart_disease_risk ?? results.heart_disease_risk ?? 0);
            const deltaDia = +(afterDia - Number(results.diabetes_risk || 0)).toFixed(1);
            const deltaHeart = +(afterHeart - Number(results.heart_disease_risk || 0)).toFixed(1);

            const changes = [];

            // If optimal exists, show only optimal here (no repetition)
            if (optimalResult) {
                changes.push(["Plan Type", "Optimal plan (recommended)"]);
                changes.push(["Weight loss (kg)", String(optimalResult.wt)]);
                changes.push(["Exercise", stripUnicode(optimalResult.ex)]);
                changes.push(["Smoking", stripUnicode(optimalResult.sm)]);
                changes.push(["Diet", stripUnicode(optimalResult.dt)]);
                changes.push(["Alcohol (drinks/week)", String(optimalResult.al)]);
            } else if (simulation) {
                changes.push(["Plan Type", "User-selected plan"]);
                changes.push(["Weight loss (kg)", String(simulation.weightLossKg ?? 0)]);
                changes.push(["Exercise", stripUnicode(simulation.exercisePlan ?? "N/A")]);
                changes.push(["Smoking", stripUnicode(simulation.smokingPlan ?? "N/A")]);
                changes.push(["Diet", stripUnicode(simulation.dietPlan ?? "N/A")]);
                changes.push(["Alcohol (drinks/week)", String(simulation.alcoholPerWeek ?? "N/A")]);
            } else {
                changes.push(["Plan Type", "No simulator changes"]);
            }

            changes.push(["Impact (Diabetes)", `${results.diabetes_risk}% -> ${afterDia}% (${deltaDia > 0 ? "+" : ""}${deltaDia}%)`]);
            changes.push(["Impact (Heart)", `${results.heart_disease_risk}% -> ${afterHeart}% (${deltaHeart > 0 ? "+" : ""}${deltaHeart}%)`]);

            autoTable(doc, {
                startY: y,
                head: [["Change", "Value"]],
                body: changes,
                theme: "grid",
                styles: { font: "helvetica", fontSize: 9.5, cellPadding: 7 },
                headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: "bold" },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: margin, right: margin },
            });

            y = doc.lastAutoTable.finalY + 12;

            // ================= Chart: Before vs After =================
            y = await addChartBlock("Before vs After (Current vs Projected)", beforeAfterBoxRef.current, y);

            // ================= Chart: Weight Trajectory =================
            if (weightSeries.length > 0) {
                y = await addChartBlock("Weight-Loss Trajectory (Risk vs kg lost)", trajBoxRef.current, y);
            }

            // ================= Projected Results table =================
            y = sectionTitle("Projected Results", y);

            if (projected) {
                autoTable(doc, {
                    startY: y,
                    head: [["Metric", "Projected Value", "Level"]],
                    body: [
                        ["Diabetes Risk", `${projected.diabetes_risk}%`, stripUnicode(projected.diabetes_level)],
                        ["Heart Disease Risk", `${projected.heart_disease_risk}%`, stripUnicode(projected.heart_disease_level)],
                        ["Projected Health Score", `${projectedHealthScore}/100`, projectedHealthScore >= 70 ? "Good" : projectedHealthScore >= 40 ? "Average" : "Low"],
                    ],
                    theme: "grid",
                    styles: { font: "helvetica", fontSize: 9.5, cellPadding: 7 },
                    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    margin: { left: margin, right: margin },
                });
                y = doc.lastAutoTable.finalY + 14;
            } else {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(100, 116, 139);
                doc.text("Projected results not available yet. Wait for recalculation.", margin, y + 10);
                y += 26;
            }

            // ================= Personalized Recommendations (nice bullets) =================
            y = sectionTitle("Personalized Recommendations", y);

            // Draw bullets (NOT a table)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(30, 41, 59);

            const maxWidth = pageW - margin * 2;
            const lineH = 14;

            const bulletLines = recommendations.map(bulletize);
            let recY = y;

            for (const lineText of bulletLines) {
                const wrapped = doc.splitTextToSize(lineText, maxWidth);
                const needed = wrapped.length * lineH + 6;
                recY = ensureSpace(recY, needed);
                doc.text(wrapped, margin, recY);
                recY += wrapped.length * lineH + 6;
            }

            y = recY + 10;

            // ================= Disclaimer: centered + bottom of LAST page =================
            // Ensure disclaimer is at bottom: add a new page if we are too high up.
            if (y < pageH - 140) {
                // keep it on the same page if space is good
            } else {
                // if we're too close to bottom and it looks cramped, start a new page
                doc.addPage();
            }

            const discText = "This report is for educational purposes only and is not medical advice. Consult a healthcare professional.";
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(100, 116, 139);

            // Bottom-center
            const discY = pageH - margin;
            doc.text(doc.splitTextToSize(discText, maxWidth), cx, discY, { align: "center" });

            doc.save(`HealthGuard_Medical_Report_${Date.now()}.pdf`);
        } catch (e) {
            setPdfError(String(e?.message || e));
        } finally {
            setPdfLoading(false);
        }
    };

    // ---------------- UI (simple) ----------------
    return (
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#f4f9fd", minHeight: "100vh", padding: "28px 20px 80px" }}>
            <div style={{ maxWidth: 980, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 900, fontSize: 18, cursor: "pointer", color: "#1a365d" }} onClick={() => navigate("/")}>
                        HealthGuard AI
                    </div>
                    <button
                        onClick={() => navigate("/simulator", { state: { results, userData } })}
                        style={{
                            border: "1px solid #e2e8f0",
                            background: "white",
                            borderRadius: 12,
                            padding: "10px 14px",
                            cursor: "pointer",
                            fontWeight: 800,
                            color: "#64748b",
                        }}
                    >
                        ← Back to Simulator
                    </button>
                </div>

                <div style={{ background: "white", borderRadius: 18, padding: 22, border: "1px solid #e2e8f0", boxShadow: "0 10px 35px -12px rgba(0,0,0,0.12)" }}>
                    <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#0f172a" }}>Download Medical Report</h2>
                    <p style={{ marginTop: 8, color: "#64748b", lineHeight: 1.6 }}>
                        PDF includes snapshot, risks, charts, selected changes, projected results, recommendations, and disclaimer.
                    </p>

                    {pdfError && (
                        <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef2f2", color: "#ef4444", borderRadius: 12, fontWeight: 800 }}>
                            ⚠️ PDF Error: {pdfError}
                        </div>
                    )}

                    <button
                        onClick={downloadPDF}
                        disabled={pdfLoading}
                        style={{
                            marginTop: 12,
                            width: "100%",
                            background: "linear-gradient(90deg,#18d4ba,#0ca7e8)",
                            color: "white",
                            padding: "14px 18px",
                            borderRadius: 14,
                            border: "none",
                            cursor: pdfLoading ? "not-allowed" : "pointer",
                            fontWeight: 900,
                            fontSize: 14,
                            opacity: pdfLoading ? 0.7 : 1,
                            boxShadow: "0 10px 30px -10px rgba(12,167,232,0.45)",
                        }}
                    >
                        {pdfLoading ? "Generating PDF..." : "📥 Download PDF Report"}
                    </button>
                </div>
            </div>

            {/* Chart render boxes: visible to layout engine but hidden to user */}
            <div style={{ position: "fixed", left: 12, top: 12, opacity: 0, pointerEvents: "none", zIndex: -1 }}>
                <div ref={riskBoxRef} style={{ width: 760, height: 360, background: "white", padding: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartRiskSummary} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis domain={[0, 100]} stroke="#64748b" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Risk" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div ref={beforeAfterBoxRef} style={{ width: 760, height: 360, background: "white", padding: 16, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartBeforeAfter} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis domain={[0, 100]} stroke="#64748b" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Current" fill="#10b981" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="After" fill="#6366f1" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div ref={trajBoxRef} style={{ width: 760, height: 360, background: "white", padding: 16, marginTop: 16 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightSeries}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="kg" stroke="#64748b" />
                            <YAxis domain={[0, 100]} stroke="#64748b" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="diabetes" stroke="#06b6d4" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="heart" stroke="#6366f1" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Download;