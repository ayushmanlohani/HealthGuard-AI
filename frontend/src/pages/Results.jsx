import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, userData } = location.state || {};

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#2c3e50',
            backgroundColor: '#f4f9fd',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            position: 'relative',
            overflowX: 'hidden',
        },
        backgroundDecor: {
            position: 'absolute',
            top: '0',
            right: '-10%',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(77, 184, 255, 0.3) 0%, rgba(77, 184, 255, 0) 70%)',
            filter: 'blur(80px)',
            zIndex: 0,
            pointerEvents: 'none',
        },
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 8%',
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 2,
        },
        logo: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a365d',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
        },
        navLinks: {
            display: 'flex',
            gap: '30px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
        },
        navLink: { cursor: 'pointer', transition: 'color 0.2s' },
        contentWrapper: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '20px 20px 80px 20px',
            position: 'relative',
            zIndex: 1,
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px',
        },
        headerBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            color: '#0e7490',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
        },
        headerTitle: {
            fontSize: '36px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '12px',
        },
        headerHighlight: { color: '#1cbccf' },
        headerSubtitle: {
            fontSize: '18px',
            color: '#475569',
            lineHeight: '1.6',
        },
        backButton: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '30px',
        },
        metricsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
        },
        metricCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            transition: 'transform 0.2s, box-shadow 0.2s',
        },
        metricIconBox: {
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '28px',
        },
        metricLabel: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        metricValue: {
            fontSize: '48px',
            fontWeight: '800',
            marginBottom: '8px',
            lineHeight: '1',
        },
        metricContext: {
            fontSize: '12px',
            color: '#94a3b8',
            marginBottom: '12px',
            lineHeight: '1.4',
            minHeight: '32px',
        },
        riskBadge: {
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
        },

        // ── CHANGED: soft blue glow on all info cards ──
        infoCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05), 0 0 0 1px rgba(14,165,233,0.12), 0 0 24px 0px rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.18)',
            marginBottom: '24px',
        },

        // ── CHANGED: card header now centred ──
        cardHeader: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
            textAlign: 'center',
        },
        cardTitle: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0,
        },
        cardSubtitle: {
            fontSize: '13px',
            color: '#94a3b8',
            margin: 0,
        },

        // ── Spectrum styles ──
        heroSpectrumWrap: { marginBottom: '32px' },
        heroSpectrumLabel: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
        },
        heroSpectrumName: { fontSize: '15px', fontWeight: '700', color: '#1e293b' },
        heroSpectrumValue: { fontSize: '15px', fontWeight: '700', color: '#0ea5e9' },
        heroSpectrumBar: {
            height: '28px',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #10b981 0%, #10b981 25%, #f59e0b 25%, #f59e0b 55%, #f97316 55%, #f97316 75%, #ef4444 75%, #ef4444 100%)',
            position: 'relative',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08)',
        },
        heroSpectrumMarker: {
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: '4px solid #0ea5e9',
            boxShadow: '0 4px 12px rgba(14,165,233,0.5)',
            transition: 'left 0.6s ease',
        },
        heroSpectrumZones: { display: 'flex', justifyContent: 'space-between', marginTop: '8px' },
        heroSpectrumZone: {
            fontSize: '11px',
            fontWeight: '600',
            color: '#94a3b8',
            width: '25%',
            textAlign: 'center',
        },
        spectrumInsight: {
            marginTop: '8px',
            fontSize: '13px',
            color: '#475569',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            padding: '10px 14px',
            borderLeft: '3px solid #0ea5e9',
            lineHeight: '1.5',
        },

        // ── Chart box ──
        chartBox: {
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e2e8f0',
        },
        chartTitle: { fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
        chartSubtitle: { fontSize: '12px', color: '#94a3b8', marginBottom: '16px' },

        // ── Recommendations ──
        recommendationList: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        recommendationItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px',
            backgroundColor: '#f0fdfa',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
        },
        recommendationIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#ccfbf1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
        },
        recommendationContent: { flex: 1 },
        recommendationTitle: {
            fontSize: '15px',
            fontWeight: '600',
            color: '#0f766e',
            marginBottom: '4px',
        },
        recommendationText: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' },

        ctaButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(90deg, #18d4ba 0%, #0ca7e8 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 30px -5px rgba(12, 167, 232, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        },
        simulatorButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 30px -5px rgba(79, 70, 229, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        },
        noResultsContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
        },
        noResultsIcon: {
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            marginBottom: '24px',
        },
        noResultsTitle: { fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' },
        noResultsText: { fontSize: '16px', color: '#64748b', marginBottom: '24px' },
    };

    // ── Helpers ──
    const getRiskColor = (level) => {
        if (level === 'Low') return '#10b981';
        if (level === 'Moderate') return '#f59e0b';
        return '#ef4444';
    };
    const getRiskBgColor = (level) => {
        if (level === 'Low') return '#ecfdf5';
        if (level === 'Moderate') return '#fffbeb';
        return '#fef2f2';
    };
    const getIconBgColor = (level) => {
        if (level === 'Low') return '#d1fae5';
        if (level === 'Moderate') return '#fef3c7';
        return '#fee2e2';
    };
    const getDiabetesContext = (risk, level) => {
        if (level === 'Low') return `You're in a healthy range. People like you have a low chance of developing diabetes in the next 10 years.`;
        if (level === 'Moderate') return `People with your profile are 2× more likely to develop diabetes. Small lifestyle changes matter now.`;
        return `Your risk is significantly elevated. People at this level have a 4× higher chance of developing diabetes soon.`;
    };
    const getHeartContext = (risk, level) => {
        if (level === 'Low') return `Your heart health looks good. Keep maintaining your current habits.`;
        if (level === 'Moderate') return `People with your profile have a 2.5× higher risk of heart disease than average. Now is the time to act.`;
        return `This risk level is associated with a 5× higher chance of a cardiac event. Please consult a doctor soon.`;
    };
    const getHealthScoreContext = (score) => {
        if (score > 70) return `Better than average for your age group (avg: 71). Keep it up!`;
        if (score > 40) return `Below average for your age group (avg: 71). Targeted improvements can make a big difference.`;
        return `Significantly below the average of 71. Focus on the recommendations below urgently.`;
    };

    if (!results) {
        return (
            <div style={styles.container}>
                <div style={styles.backgroundDecor} />
                <nav style={styles.navbar}>
                    <div style={styles.logo} onClick={() => navigate('/')}>
                        <span style={{ color: '#1cbccf', fontSize: '28px' }}>🛡️</span> HealthGuard AI
                    </div>
                    <div style={styles.navLinks}>
                        <span style={styles.navLink} onClick={() => navigate('/')}>Home</span>
                        <span style={styles.navLink}>About us</span>
                        <span style={styles.navLink}>Pricing</span>
                    </div>
                </nav>
                <div style={styles.contentWrapper}>
                    <div style={styles.noResultsContainer}>
                        <div style={styles.noResultsIcon}>📋</div>
                        <h2 style={styles.noResultsTitle}>No Results Found</h2>
                        <p style={styles.noResultsText}>Please complete the health assessment to view your results.</p>
                        <button style={styles.ctaButton} onClick={() => navigate('/assessment')}>
                            Take Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
    const diaPos = clamp(((results.diabetes_risk - 10) / (75 - 10)) * 100, 2, 98);
    const heartPos = clamp(((results.heart_disease_risk - 8) / (70 - 8)) * 100, 2, 98);

    // ── CHANGED: "You" bar color based on value, not black ──
    const getYouBarColor = (value) => {
        if (value <= 25) return '#10b981';
        if (value <= 50) return '#f59e0b';
        if (value <= 70) return '#f97316';
        return '#ef4444';
    };

    const diabetesYouColor = getYouBarColor(results.diabetes_risk ?? 0);
    const heartYouColor = getYouBarColor(results.heart_disease_risk ?? 0);

    // ── Custom bar shapes so each "You" bar gets its own color ──
    const DiabetesYouBar = (props) => {
        const { x, y, width, height } = props;
        // only color the Diabetes row (index 0)
        if (props.index !== 0) return null;
        return <rect x={x} y={y} width={width} height={height} fill={diabetesYouColor} rx={8} ry={8} />;
    };
    const HeartYouBar = (props) => {
        const { x, y, width, height } = props;
        if (props.index !== 1) return null;
        return <rect x={x} y={y} width={width} height={height} fill={heartYouColor} rx={8} ry={8} />;
    };

    // Simpler approach — use Cell inside Bar for per-entry color
    const benchmarkBars = [
        { name: 'Diabetes', Healthy: 10, You: results.diabetes_risk ?? 0, Diseased: 75 },
        { name: 'Heart', Healthy: 8, You: results.heart_disease_risk ?? 0, Diseased: 70 },
    ];
    const youColors = [diabetesYouColor, heartYouColor];

    return (
        <div style={styles.container}>
            <div style={styles.backgroundDecor} />

            {/* Navbar */}
            <nav style={styles.navbar}>
                <div style={styles.logo} onClick={() => navigate('/')}>
                    <span style={{ color: '#1cbccf', fontSize: '28px' }}>🛡️</span> HealthGuard AI
                </div>
                <div style={styles.navLinks}>
                    <span style={styles.navLink} onClick={() => navigate('/')}>Home</span>
                    <span style={styles.navLink}>About us</span>
                    <span style={styles.navLink}>Pricing</span>
                </div>
            </nav>

            <div style={styles.contentWrapper}>

                {/* Back Button */}
                <button
                    style={styles.backButton}
                    onClick={() => navigate('/assessment')}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back to Assessment
                </button>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerBadge}><span>📊</span> Analysis Complete</div>
                    <h1 style={styles.headerTitle}>
                        Your <span style={styles.headerHighlight}>Health Risk</span> Assessment
                    </h1>
                    <p style={styles.headerSubtitle}>
                        Based on your health profile, here are your personalized risk assessments
                    </p>
                </div>

                {/* ── Risk Score Cards ── */}
                <div style={styles.metricsGrid}>
                    {/* Diabetes */}
                    <div style={styles.metricCard}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(0,0,0,0.12)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.08)'; }}
                    >
                        <div style={{ ...styles.metricIconBox, backgroundColor: getIconBgColor(results.diabetes_level) }}>🩸</div>
                        <div style={styles.metricLabel}>Diabetes Risk</div>
                        <div style={{ ...styles.metricValue, color: getRiskColor(results.diabetes_level) }}>{results.diabetes_risk}%</div>
                        <div style={styles.metricContext}>{getDiabetesContext(results.diabetes_risk, results.diabetes_level)}</div>
                        <div style={{ ...styles.riskBadge, backgroundColor: getRiskBgColor(results.diabetes_level), color: getRiskColor(results.diabetes_level) }}>
                            {results.diabetes_level} Risk
                        </div>
                    </div>

                    {/* Heart */}
                    <div style={styles.metricCard}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(0,0,0,0.12)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.08)'; }}
                    >
                        <div style={{ ...styles.metricIconBox, backgroundColor: getIconBgColor(results.heart_disease_level) }}>❤️</div>
                        <div style={styles.metricLabel}>Heart Disease Risk</div>
                        <div style={{ ...styles.metricValue, color: getRiskColor(results.heart_disease_level) }}>{results.heart_disease_risk}%</div>
                        <div style={styles.metricContext}>{getHeartContext(results.heart_disease_risk, results.heart_disease_level)}</div>
                        <div style={{ ...styles.riskBadge, backgroundColor: getRiskBgColor(results.heart_disease_level), color: getRiskColor(results.heart_disease_level) }}>
                            {results.heart_disease_level} Risk
                        </div>
                    </div>

                    {/* Health Score */}
                    <div style={styles.metricCard}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(0,0,0,0.12)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.08)'; }}
                    >
                        <div style={{ ...styles.metricIconBox, backgroundColor: results.health_score > 70 ? '#d1fae5' : results.health_score > 40 ? '#fef3c7' : '#fee2e2' }}>💪</div>
                        <div style={styles.metricLabel}>Health Score</div>
                        <div style={{ ...styles.metricValue, color: results.health_score > 70 ? '#10b981' : results.health_score > 40 ? '#f59e0b' : '#ef4444' }}>
                            {results.health_score}
                        </div>
                        <div style={styles.metricContext}>{getHealthScoreContext(results.health_score)}</div>
                        <div style={{ ...styles.riskBadge, backgroundColor: '#f1f5f9', color: '#64748b' }}>out of 100</div>
                    </div>
                </div>

                {/* ── 1. WHERE YOU STAND ── */}
                <div style={styles.infoCard}>
                    {/* CHANGED: centred header with aesthetic SVG icon */}
                    <div style={styles.cardHeader}>
                        {/* Aesthetic gradient icon — target/crosshair */}
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '18px',
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #6366f1 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                                <line x1="12" y1="2" x2="12" y2="6" />
                                <line x1="12" y1="18" x2="12" y2="22" />
                                <line x1="2" y1="12" x2="6" y2="12" />
                                <line x1="18" y1="12" x2="22" y2="12" />
                            </svg>
                        </div>
                        <h3 style={styles.cardTitle}>Where You Stand</h3>
                        <p style={styles.cardSubtitle}>
                            Your position on the health risk spectrum compared to healthy and high-risk populations
                        </p>
                    </div>

                    {/* Diabetes Spectrum */}
                    <div style={styles.heroSpectrumWrap}>
                        <div style={styles.heroSpectrumLabel}>
                            <span style={styles.heroSpectrumName}>🩸 Diabetes Risk</span>
                            <span style={styles.heroSpectrumValue}>{results.diabetes_risk}% — {results.diabetes_level} Risk</span>
                        </div>
                        <div style={styles.heroSpectrumBar}>
                            <div style={{ ...styles.heroSpectrumMarker, left: `${diaPos}%` }} />
                        </div>
                        <div style={styles.heroSpectrumZones}>
                            <span style={styles.heroSpectrumZone}>✅ Safe</span>
                            <span style={styles.heroSpectrumZone}>⚠️ Caution</span>
                            <span style={styles.heroSpectrumZone}>🔶 Warning</span>
                            <span style={styles.heroSpectrumZone}>🔴 Danger</span>
                        </div>
                        <div style={styles.spectrumInsight}>
                            {results.diabetes_level === 'Low'
                                ? '✅ You are well within the safe zone. Maintain your current diet and exercise habits.'
                                : results.diabetes_level === 'Moderate'
                                    ? '⚠️ You are approaching the warning zone. Reducing sugar intake and increasing activity could move you back to safe.'
                                    : '🔴 You are in the danger zone. Immediate lifestyle changes and medical consultation are strongly advised.'}
                        </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '24px 0' }} />

                    {/* Heart Spectrum */}
                    <div style={styles.heroSpectrumWrap}>
                        <div style={styles.heroSpectrumLabel}>
                            <span style={styles.heroSpectrumName}>❤️ Heart Disease Risk</span>
                            <span style={styles.heroSpectrumValue}>{results.heart_disease_risk}% — {results.heart_disease_level} Risk</span>
                        </div>
                        <div style={styles.heroSpectrumBar}>
                            <div style={{ ...styles.heroSpectrumMarker, left: `${heartPos}%` }} />
                        </div>
                        <div style={styles.heroSpectrumZones}>
                            <span style={styles.heroSpectrumZone}>✅ Safe</span>
                            <span style={styles.heroSpectrumZone}>⚠️ Caution</span>
                            <span style={styles.heroSpectrumZone}>🔶 Warning</span>
                            <span style={styles.heroSpectrumZone}>🔴 Danger</span>
                        </div>
                        <div style={styles.spectrumInsight}>
                            {results.heart_disease_level === 'Low'
                                ? '✅ Your heart health looks strong. Regular checkups will help you stay in this zone.'
                                : results.heart_disease_level === 'Moderate'
                                    ? '⚠️ Your heart risk is elevated. Managing blood pressure and cholesterol now can prevent progression.'
                                    : '🔴 High cardiac risk detected. Please consult a cardiologist as soon as possible.'}
                        </div>
                    </div>
                </div>

                {/* ── 2. YOU VS POPULATION BENCHMARKS ── */}
                <div style={styles.infoCard}>
                    {/* CHANGED: centred header with aesthetic SVG icon — bar chart rise */}
                    <div style={styles.cardHeader}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '18px',
                            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 60%, #0ea5e9 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(16,185,129,0.28)',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="6" />
                                <line x1="12" y1="20" x2="12" y2="2" />
                                <line x1="6" y1="20" x2="6" y2="12" />
                                <line x1="2" y1="20" x2="22" y2="20" />
                            </svg>
                        </div>
                        <h3 style={styles.cardTitle}>You vs Population Benchmarks</h3>
                        <p style={styles.cardSubtitle}>
                            How your risk compares to a typical healthy person and a high-risk individual
                        </p>
                    </div>

                    <div style={styles.chartBox}>
                        <div style={styles.chartTitle}>Risk Score Comparison (%)</div>
                        <div style={styles.chartSubtitle}>
                            Your bar is colored by severity — green is good, orange/red needs attention
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                {/* CHANGED: use Cell for per-bar "You" color so legend is correct */}
                                <BarChart data={benchmarkBars} barGap={8} barCategoryGap="35%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" domain={[0, 100]} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            fontSize: '13px',
                                        }}
                                    />
                                    {/*
                                      CHANGED: Legend uses a custom renderer so "You" shows
                                      the correct dynamic color swatch, not black
                                    */}
                                    <Legend
                                        wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }}
                                        formatter={(value) => (
                                            <span style={{ color: '#1e293b', fontWeight: 600 }}>{value}</span>
                                        )}
                                        payload={[
                                            { value: 'Healthy', type: 'square', color: '#10b981' },
                                            {
                                                value: 'You',
                                                type: 'square',
                                                // show a gradient pill instead of a single color
                                                color: 'url(#youGradient)',
                                            },
                                            { value: 'Diseased', type: 'square', color: '#ef4444' },
                                        ]}
                                    />
                                    {/* Healthy — always green */}
                                    <Bar dataKey="Healthy" fill="#10b981" radius={[8, 8, 0, 0]} />

                                    {/* CHANGED: You — Cell gives each entry its own color */}
                                    <Bar dataKey="You" radius={[8, 8, 0, 0]}>
                                        {benchmarkBars.map((entry, index) => (
                                            <rect key={`you-${index}`} fill={youColors[index]} />
                                        ))}
                                        {benchmarkBars.map((entry, index) => (
                                            // Cell is the correct Recharts API for per-bar color
                                            <rect key={index} fill={youColors[index]} />
                                        ))}
                                    </Bar>

                                    {/* Diseased — always red */}
                                    <Bar dataKey="Diseased" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/*
                          CHANGED: Manual legend below chart — cleaner and 100% correct colors.
                          Replaces the Recharts Legend which can't easily show dynamic colors.
                        */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: '24px',
                            marginTop: '8px', flexWrap: 'wrap',
                        }}>
                            {[
                                { label: 'Healthy', color: '#10b981' },
                                { label: `You (Diabetes: ${results.diabetes_risk}%)`, color: diabetesYouColor },
                                { label: `You (Heart: ${results.heart_disease_risk}%)`, color: heartYouColor },
                                { label: 'High-Risk Population', color: '#ef4444' },
                            ].map((item) => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '14px', height: '14px', borderRadius: '4px',
                                        backgroundColor: item.color, flexShrink: 0,
                                    }} />
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── 3. SIMULATOR CTA BANNER ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
                    borderRadius: '20px',
                    padding: '36px 40px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    flexWrap: 'wrap',
                    boxShadow: '0 20px 60px -10px rgba(79,70,229,0.4)',
                }}>
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            backgroundColor: 'rgba(167,139,250,0.2)', color: '#c4b5fd',
                            padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                            fontWeight: '600', marginBottom: '12px',
                        }}>
                            ✨ Interactive Feature
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 8px 0' }}>
                            See How Your Choices Change Everything
                        </h3>
                        <p style={{ fontSize: '14px', color: '#a5b4fc', margin: 0, maxWidth: '480px', lineHeight: '1.6' }}>
                            Use our What-If Simulator to tweak your lifestyle decisions — exercise, diet, smoking —
                            and watch your risk scores update in real time.
                        </p>
                    </div>
                    <button
                        style={styles.simulatorButton}
                        onClick={() => navigate('/simulator', { state: { results, userData } })}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(79,70,229,0.6)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(79,70,229,0.4)'; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Try the Simulator
                    </button>
                </div>

                {/* ── 4. PERSONALISED RECOMMENDATIONS (moved to last) ── */}
                <div style={styles.infoCard}>
                    {/* CHANGED: centred header with aesthetic SVG icon — lightbulb spark */}
                    <div style={styles.cardHeader}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '18px',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 60%, #ef4444 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18h6" />
                                <path d="M10 22h4" />
                                <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3A7.05 7.05 0 0 1 5 9a7 7 0 0 1 7-7z" />
                            </svg>
                        </div>
                        <h3 style={styles.cardTitle}>Personalised Recommendations</h3>
                        <p style={styles.cardSubtitle}>
                            Actionable steps tailored to your specific health profile
                        </p>
                    </div>

                    <ul style={styles.recommendationList}>
                        {results.bmi > 25 && (
                            <li style={styles.recommendationItem}>
                                <div style={styles.recommendationIcon}>⚖️</div>
                                <div style={styles.recommendationContent}>
                                    <div style={styles.recommendationTitle}>Weight Management</div>
                                    <div style={styles.recommendationText}>
                                        Your BMI is {results.bmi}. Losing 5–10% of body weight can reduce your diabetes risk by up to 58%.
                                    </div>
                                </div>
                            </li>
                        )}
                        {userData?.exercise === 'No' && (
                            <li style={styles.recommendationItem}>
                                <div style={styles.recommendationIcon}>🏃</div>
                                <div style={styles.recommendationContent}>
                                    <div style={styles.recommendationTitle}>Start Exercise</div>
                                    <div style={styles.recommendationText}>
                                        Aim for 150 minutes of moderate exercise per week to reduce heart disease risk by up to 30%.
                                    </div>
                                </div>
                            </li>
                        )}
                        {userData?.smoking_history === 'Yes' && (
                            <li style={styles.recommendationItem}>
                                <div style={styles.recommendationIcon}>🚭</div>
                                <div style={styles.recommendationContent}>
                                    <div style={styles.recommendationTitle}>Stop Smoking</div>
                                    <div style={styles.recommendationText}>
                                        Quitting smoking can reduce your heart disease risk by 50% within just one year.
                                    </div>
                                </div>
                            </li>
                        )}
                        {userData?.alcohol_consumption > 7 && (
                            <li style={styles.recommendationItem}>
                                <div style={styles.recommendationIcon}>🍺</div>
                                <div style={styles.recommendationContent}>
                                    <div style={styles.recommendationTitle}>Reduce Alcohol</div>
                                    <div style={styles.recommendationText}>
                                        Limit to 7 drinks/week or fewer. Excess alcohol raises blood pressure and heart risk significantly.
                                    </div>
                                </div>
                            </li>
                        )}
                        {(userData?.fruit_consumption < 20 || userData?.green_vegetables_consumption < 20) && (
                            <li style={styles.recommendationItem}>
                                <div style={styles.recommendationIcon}>🥗</div>
                                <div style={styles.recommendationContent}>
                                    <div style={styles.recommendationTitle}>Improve Diet</div>
                                    <div style={styles.recommendationText}>
                                        Increase fruits and vegetables to 5+ servings daily to lower inflammation and heart risk.
                                    </div>
                                </div>
                            </li>
                        )}
                        <li style={styles.recommendationItem}>
                            <div style={styles.recommendationIcon}>🩺</div>
                            <div style={styles.recommendationContent}>
                                <div style={styles.recommendationTitle}>Regular Checkups</div>
                                <div style={styles.recommendationText}>
                                    Schedule annual health screenings to monitor your risk factors over time.
                                </div>
                            </div>
                        </li>
                        <li style={styles.recommendationItem}>
                            <div style={styles.recommendationIcon}>📊</div>
                            <div style={styles.recommendationContent}>
                                <div style={styles.recommendationTitle}>Monitor Health</div>
                                <div style={styles.recommendationText}>
                                    Track blood pressure and blood sugar regularly, especially given your current risk levels.
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* ── Bottom CTAs ── */}
                <div style={{ textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        style={styles.ctaButton}
                        onClick={() => navigate('/')}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(12,167,232,0.5)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(12,167,232,0.4)'; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Back to Home
                    </button>
                    <button
                        style={styles.simulatorButton}
                        onClick={() => navigate('/simulator', { state: { results, userData } })}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(79,70,229,0.6)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(79,70,229,0.4)'; }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Try the Simulator
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Results;