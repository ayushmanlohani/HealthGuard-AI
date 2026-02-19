import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#2c3e50',
            backgroundColor: '#f0f7ff',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            overflowX: 'hidden',
            position: 'relative',
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
            flexWrap: 'wrap',
            gap: '20px',
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
        },
        navLinks: {
            display: 'flex',
            gap: '30px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#64748b',
            flexWrap: 'wrap',
        },
        hero: {
            textAlign: 'center',
            padding: '60px 10% 40px 10%',
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        heroBadge: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            color: '#0e7490',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '30px',
        },
        tagline: {
            fontSize: '64px',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px',
            color: '#0f172a',
            textAlign: 'center',
            whiteSpace: 'nowrap',
        },
        taglineHighlight: {
            color: '#06b6d4',
        },
        subText: {
            fontSize: '20px',
            color: '#475569',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '750px',
        },
        ctaButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'linear-gradient(90deg, #18d4ba 0%, #0ca7e8 100%)',
            color: 'white',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 30px -5px rgba(12, 167, 232, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            marginBottom: '60px',
        },
        heroStats: {
            display: 'flex',
            justifyContent: 'center',
            gap: '120px',
            flexWrap: 'nowrap',
            width: '100%',
            marginBottom: '40px',
        },
        statItem: {
            textAlign: 'center',
        },
        statNumber: {
            display: 'block',
            fontSize: '36px',
            fontWeight: '700',
            color: '#1dbdd5',
            marginBottom: '8px',
            lineHeight: '1',
        },
        statLabel: {
            fontSize: '16px',
            color: '#829ab1',
            fontWeight: '500',
        },
        featuresSection: {
            textAlign: 'center',
            padding: '60px 5%',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        featuresTitle: {
            fontSize: '36px',
            fontWeight: '800',
            color: '#1a365d',
            marginBottom: '16px',
            textAlign: 'center',
            width: '100%',
        },
        featuresSubtitle: {
            fontSize: '18px',
            color: '#64748b',
            maxWidth: '800px',
            margin: '0 auto 60px auto',
            lineHeight: '1.6',
            textAlign: 'center',
        },
        featuresGrid: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
        },
        newFeatureCard: {
            flex: '1',
            minWidth: '0',
            height: '260px',
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'left',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
            border: '2px solid transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
        },
        featureIconBox: {
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: 'white',
            flexShrink: 0,
            transition: 'transform 0.3s ease',
        },
        featureCardTitle: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '10px',
            lineHeight: '1.3',
        },
        featureCardText: {
            fontSize: '13px',
            color: '#64748b',
            lineHeight: '1.6',
        },
        techSection: {
            textAlign: 'center',
            padding: '60px 5%',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        techGrid: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            alignItems: 'stretch',
        },
        techCard: {
            flex: '1',
            minWidth: '0',
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px 24px',
            textAlign: 'left',
            border: '1px solid #d1fae5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
        },
        techHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
        },
        techIconBox: {
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#ccfbf1',
            color: '#0d9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        techTitle: {
            fontSize: '18px',
            fontWeight: '700',
            color: '#0f172a',
        },
        techList: {
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        },
        techListItem: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
        },
        techBullet: {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            marginTop: '8px',
            flexShrink: 0,
        },
        techItemContent: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
        },
        techItemName: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e293b',
        },
        techItemDesc: {
            fontSize: '13px',
            color: '#64748b',
        },
        // ─── NEW: CTA AND FOOTER STYLES ───
        ctaSection: {
            padding: '60px 5% 80px 5%',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            boxSizing: 'border-box',
            width: '100%',
        },
        ctaCard: {
            background: 'linear-gradient(90deg, #18d4ba 0%, #0ca7e8 100%)',
            borderRadius: '24px',
            padding: '60px 20px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 40px -10px rgba(12, 167, 232, 0.3)',
        },
        ctaTitle: {
            fontSize: '36px',
            fontWeight: '800',
            marginBottom: '16px',
            color: 'white',
        },
        ctaSubtitle: {
            fontSize: '18px',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)',
        },
        ctaInnerButton: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            backgroundColor: 'white',
            color: '#0d9488', // Teal text matching gradient
            padding: '16px 36px',
            borderRadius: '50px', // Pill shape from image
            fontSize: '16px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        },
        footer: {
            padding: '30px 8%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            position: 'relative',
            zIndex: 1,
        },
        footerLogo: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1a365d',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        footerText: {
            fontSize: '14px',
            color: '#829ab1', // Subtle grey
        },
    };

    // Hover functions
    const handleCardHover = (e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.border = '2px solid #0ea5e9';
        e.currentTarget.style.borderRadius = '20px';
        e.currentTarget.style.boxShadow = '0 20px 50px -10px rgba(14, 165, 233, 0.2)';
        const iconBox = e.currentTarget.querySelector('.feature-icon');
        if (iconBox) {
            iconBox.style.transform = 'scale(1.25)';
        }
    };

    const handleCardLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.border = '2px solid transparent';
        e.currentTarget.style.borderRadius = '20px';
        e.currentTarget.style.boxShadow = '0 10px 40px -10px rgba(0,0,0,0.05)';
        const iconBox = e.currentTarget.querySelector('.feature-icon');
        if (iconBox) {
            iconBox.style.transform = 'scale(1)';
        }
    };

    const handleTechHover = (e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(20, 184, 166, 0.15)';
        e.currentTarget.style.borderColor = '#99f6e4';
    };

    const handleTechLeave = (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
        e.currentTarget.style.borderColor = '#d1fae5';
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundDecor} />

            <nav style={styles.navbar}>
                <div style={styles.logo}>
                    <span style={{ color: '#4db8ff', fontSize: '28px' }}>🛡️</span> HealthGuard AI
                </div>
                <div style={styles.navLinks}>
                    <span style={{ cursor: 'pointer' }}>Home</span>
                    <span style={{ cursor: 'pointer' }}>About us</span>
                    <span style={{ cursor: 'pointer' }}>Pricing</span>
                    <span style={{ cursor: 'pointer' }}>Contact</span>
                </div>
                <div>
                    <button style={{ ...styles.ctaButton, background: '#4db8ff', padding: '10px 24px', fontSize: '14px', marginBottom: 0, boxShadow: 'none' }}>
                        Sign up free
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section style={styles.hero}>
                <div style={styles.heroBadge}>
                    <span>🛡️</span> Trusted Health Analytics Platform
                </div>

                <h1 style={styles.tagline}>
                    Predict. Compare. <span style={styles.taglineHighlight}>Protect.</span>
                </h1>

                <p style={styles.subText}>
                    Health Guard AI uses advanced machine learning to analyze your health data, predict heart disease risk, and provide personalized recommendations for a healthier life.
                </p>

                <button
                    style={styles.ctaButton}
                    onClick={() => navigate('/assessment')}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(12, 167, 232, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(12, 167, 232, 0.4)';
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Start Your Health Check
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                <div style={styles.heroStats}>
                    <div style={styles.statItem}>
                        <span style={styles.statNumber}>300K+</span>
                        <span style={styles.statLabel}>Health Records</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statNumber}>80%</span>
                        <span style={styles.statLabel}>Prediction Accuracy</span>
                    </div>
                    <div style={styles.statItem}>
                        <span style={styles.statNumber}>18</span>
                        <span style={styles.statLabel}>Health Metrics</span>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section style={styles.featuresSection}>
                <h2 style={styles.featuresTitle}>Powerful Health Features</h2>
                <p style={styles.featuresSubtitle}>
                    Comprehensive tools to help you understand and improve your cardiovascular health
                </p>

                <div style={styles.featuresGrid}>
                    <div style={styles.newFeatureCard} onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
                        <div className="feature-icon" style={styles.featureIconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9.5 2C7 2 5 4 5 6.5c0 .8.2 1.5.5 2.1C4 9.2 3 10.5 3 12c0 1.4.8 2.6 2 3.2C5 16.4 5 17.2 5 18c0 1.7 1.3 3 3 3h1" />
                                <path d="M14.5 2C17 2 19 4 19 6.5c0 .8-.2 1.5-.5 2.1C19.9 9.2 21 10.5 21 12c0 1.4-.8 2.6-2 3.2C19 16.4 19 17.2 19 18c0 1.7-1.3 3-3 3h-1" />
                                <line x1="12" y1="2" x2="12" y2="21" />
                                <path d="M9 7c-.8.5-1.5 1.3-1.5 2.5" />
                                <path d="M7.5 13C8 14 9 14.5 10 14.5" />
                                <path d="M15 7c.8.5 1.5 1.3 1.5 2.5" />
                                <path d="M16.5 13C16 14 15 14.5 14 14.5" />
                            </svg>
                        </div>
                        <h3 style={styles.featureCardTitle}>AI-Powered Prediction</h3>
                        <p style={styles.featureCardText}>
                            Advanced machine learning model trained on 300K+ health records to predict heart disease risk with high accuracy.
                        </p>
                    </div>

                    <div style={styles.newFeatureCard} onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
                        <div className="feature-icon" style={styles.featureIconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <h3 style={styles.featureCardTitle}>Health Comparison</h3>
                        <p style={styles.featureCardText}>
                            Compare your health metrics against population averages to understand where you stand.
                        </p>
                    </div>

                    <div style={styles.newFeatureCard} onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
                        <div className="feature-icon" style={styles.featureIconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <h3 style={styles.featureCardTitle}>Interactive Charts</h3>
                        <p style={styles.featureCardText}>
                            Visualize health data with beautiful, interactive charts and gain actionable insights.
                        </p>
                    </div>

                    <div style={styles.newFeatureCard} onMouseEnter={handleCardHover} onMouseLeave={handleCardLeave}>
                        <div className="feature-icon" style={styles.featureIconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <h3 style={styles.featureCardTitle}>PDF Reports</h3>
                        <p style={styles.featureCardText}>
                            Download comprehensive health reports with personalized recommendations.
                        </p>
                    </div>
                </div>
            </section>

            {/* TECH STACK SECTION */}
            <section style={styles.techSection}>
                <h2 style={styles.featuresTitle}>Built with Modern Technology</h2>
                <p style={styles.featuresSubtitle}>
                    Our tech stack combines the best tools for performance, reliability, and scalability
                </p>

                <div style={styles.techGrid}>
                    <div style={styles.techCard} onMouseEnter={handleTechHover} onMouseLeave={handleTechLeave}>
                        <div style={styles.techHeader}>
                            <div style={styles.techIconBox}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="16 18 22 12 16 6"></polyline>
                                    <polyline points="8 6 2 12 8 18"></polyline>
                                </svg>
                            </div>
                            <span style={styles.techTitle}>Frontend</span>
                        </div>
                        <ul style={styles.techList}>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>React 18</span>
                                    <span style={styles.techItemDesc}>Modern UI library with hooks</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>TypeScript</span>
                                    <span style={styles.techItemDesc}>Type-safe JavaScript</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>Tailwind CSS</span>
                                    <span style={styles.techItemDesc}>Utility-first styling</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>shadcn/ui</span>
                                    <span style={styles.techItemDesc}>Beautiful components</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div style={styles.techCard} onMouseEnter={handleTechHover} onMouseLeave={handleTechLeave}>
                        <div style={styles.techHeader}>
                            <div style={styles.techIconBox}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="8" rx="2" ry="2"></rect>
                                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                    <line x1="6" y1="8" x2="6.01" y2="8"></line>
                                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                </svg>
                            </div>
                            <span style={styles.techTitle}>Backend</span>
                        </div>
                        <ul style={styles.techList}>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>FastAPI</span>
                                    <span style={styles.techItemDesc}>High-performance Python API</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>Pydantic</span>
                                    <span style={styles.techItemDesc}>Data validation</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>Uvicorn</span>
                                    <span style={styles.techItemDesc}>ASGI server</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div style={styles.techCard} onMouseEnter={handleTechHover} onMouseLeave={handleTechLeave}>
                        <div style={styles.techHeader}>
                            <div style={styles.techIconBox}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                                    <rect x="9" y="9" width="6" height="6"></rect>
                                    <line x1="9" y1="1" x2="9" y2="4"></line>
                                    <line x1="15" y1="1" x2="15" y2="4"></line>
                                    <line x1="9" y1="20" x2="9" y2="23"></line>
                                    <line x1="15" y1="20" x2="15" y2="23"></line>
                                    <line x1="20" y1="9" x2="23" y2="9"></line>
                                    <line x1="20" y1="14" x2="23" y2="14"></line>
                                    <line x1="1" y1="9" x2="4" y2="9"></line>
                                    <line x1="1" y1="14" x2="4" y2="14"></line>
                                </svg>
                            </div>
                            <span style={styles.techTitle}>ML/AI</span>
                        </div>
                        <ul style={styles.techList}>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>Scikit-learn</span>
                                    <span style={styles.techItemDesc}>Machine learning library</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>Random Forest</span>
                                    <span style={styles.techItemDesc}>Ensemble learning algorithm</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>Pandas/NumPy</span>
                                    <span style={styles.techItemDesc}>Data processing</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div style={styles.techCard} onMouseEnter={handleTechHover} onMouseLeave={handleTechLeave}>
                        <div style={styles.techHeader}>
                            <div style={styles.techIconBox}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                </svg>
                            </div>
                            <span style={styles.techTitle}>Data</span>
                        </div>
                        <ul style={styles.techList}>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>CVD Dataset</span>
                                    <span style={styles.techItemDesc}>300K+ health records</span>
                                </div>
                            </li>
                            <li style={styles.techListItem}>
                                <div style={styles.techBullet}></div>
                                <div style={styles.techItemContent}>
                                    <span style={styles.techItemName}>JSON API</span>
                                    <span style={styles.techItemDesc}>RESTful data exchange</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* NEW: CTA BANNER SECTION */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaCard}>
                    <h2 style={styles.ctaTitle}>Ready to Check Your Heart Health?</h2>
                    <p style={styles.ctaSubtitle}>
                        Take the first step towards better cardiovascular health. Our AI-powered analysis takes just a few minutes.
                    </p>
                    <button
                        style={styles.ctaInnerButton}
                        onClick={() => navigate('/assessment')}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 15px 25px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        Start Health Assessment
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </section>

            {/* NEW: FOOTER */}
            <footer style={styles.footer}>
                <div style={styles.footerLogo}>
                    <span style={{ color: '#4db8ff', fontSize: '24px' }}>🛡️</span> HealthGuard AI
                </div>
                <div style={styles.footerText}>
                    © 2024 Health Guard AI. Built for educational purposes.
                </div>
            </footer>
        </div>
    );
};

export default Home;