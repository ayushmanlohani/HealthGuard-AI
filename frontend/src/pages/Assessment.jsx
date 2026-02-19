import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictHealthRisk } from '../services/api'; // Keep your API import

const Assessment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        general_health: 'Good',
        checkup: 'Within the past year',
        exercise: 'Yes',
        skin_cancer: 'No',
        other_cancer: 'No',
        depression: 'No',
        arthritis: 'No',
        diabetes: 'No', // Added based on your screenshot
        sex: 'Female',
        age_category: '30-34',
        height: 170,
        weight: 70,
        smoking_history: 'No',
        alcohol_consumption: 0,
        fruit_consumption: 30,
        green_vegetables_consumption: 15,
        fried_potato_consumption: 5
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('consumption') || name === 'height' || name === 'weight'
                ? parseFloat(value) || 0
                : value
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Remove 'diabetes' field since backend doesn't expect it
            const { diabetes, ...apiData } = formData;

            const result = await predictHealthRisk(apiData);
            navigate('/results', { state: { results: result, userData: formData } });
        } catch (error) {
            alert('Error: ' + (error.response?.data?.detail || 'Failed to get prediction'));
        } finally {
            setLoading(false);
        }
    };

    // Calculations
    const bmi = (formData.weight / ((formData.height / 100) ** 2)).toFixed(1);
    const getBmiStatus = (bmiValue) => {
        if (bmiValue < 18.5) return { text: 'Underweight', color: '#0ea5e9' };
        if (bmiValue < 25) return { text: 'Normal weight', color: '#10b981' };
        if (bmiValue < 30) return { text: 'Overweight', color: '#f59e0b' };
        return { text: 'Obese', color: '#ef4444' };
    };
    const bmiStatus = getBmiStatus(bmi);

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#2c3e50',
            backgroundColor: '#f4f9fd', // Soft background matching the image
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            position: 'relative',
            overflowX: 'hidden',
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
        formWrapper: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px 20px 80px 20px',
            position: 'relative',
            zIndex: 1,
        },
        // --- Progress Bar Styles ---
        progressContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px',
            gap: '15px',
        },
        stepNode: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        stepCircle: (active) => ({
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: active ? '#1cbccf' : '#e2e8f0',
            color: active ? 'white' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s',
        }),
        stepText: (active) => ({
            fontSize: '15px',
            fontWeight: '500',
            color: active ? '#1e293b' : '#94a3b8',
        }),
        stepLine: (filled) => ({
            width: '60px',
            height: '3px',
            backgroundColor: filled ? '#1cbccf' : '#e2e8f0',
            borderRadius: '2px',
            transition: 'all 0.3s',
        }),
        // --- Main Card Styles ---
        formCard: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '50px',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
        },
        mainTitle: {
            fontSize: '32px',
            fontWeight: '700',
            color: '#1cbccf',
            marginBottom: '5px',
        },
        subTitle: {
            fontSize: '15px',
            color: '#64748b',
            marginBottom: '40px',
        },
        sectionHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '30px',
        },
        sectionIconBox: {
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
        },
        sectionTitleText: {
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '2px',
        },
        sectionSubText: {
            fontSize: '14px',
            color: '#64748b',
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px 40px', // Row gap 24, Col gap 40
            marginBottom: '30px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        },
        label: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#334155',
        },
        input: {
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '15px',
            color: '#1e293b',
            backgroundColor: '#ffffff',
            outline: 'none',
            transition: 'border-color 0.2s',
        },
        select: {
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '15px',
            color: '#1e293b',
            backgroundColor: '#ffffff',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none', // Remove default arrow to match image
            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 16px top 50%',
            backgroundSize: '10px auto',
        },
        // --- Footer Buttons ---
        footerSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
        },
        prevButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            color: '#64748b',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            visibility: currentStep === 1 ? 'hidden' : 'visible',
        },
        nextButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            background: 'linear-gradient(90deg, #18d4ba 0%, #0ca7e8 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(12, 167, 232, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
        },
        // --- Slider Specific Styles ---
        sliderRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
        },
        sliderValue: {
            fontSize: '16px',
            fontWeight: '700',
            color: '#0d9488', // Teal value text
        },
        // --- Loading ---
        loadingContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f9fd',
            fontFamily: "'Inter', sans-serif",
        },
        spinner: {
            width: '60px', height: '60px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#1cbccf',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        },
    };

    // Helper for slider background fill
    const getSliderBackground = (value, max) => {
        const percentage = (value / max) * 100;
        return `linear-gradient(to right, #1cbccf ${percentage}%, #e2e8f0 ${percentage}%)`;
    };

    // Custom CSS for Sliders and Animations
    const customCSS = `
        @keyframes spin { to { transform: rotate(360deg); } }
        .focus-outline:focus { border-color: #1cbccf !important; }
        
        .custom-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            border-radius: 5px;
            outline: none;
            margin-bottom: 25px;
        }
        .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid #1cbccf;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    `;

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <style>{customCSS}</style>
                <div style={styles.spinner}></div>
                <p style={{ marginTop: '24px', fontSize: '18px', color: '#475569', fontWeight: '500' }}>
                    🔍 Analyzing your health data...
                </p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{customCSS}</style>

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

            <div style={styles.formWrapper}>

                {/* PROGRESS BAR (Matches top of your images) */}
                <div style={styles.progressContainer}>
                    <div style={styles.stepNode}>
                        <div style={styles.stepCircle(currentStep >= 1)}>1</div>
                        <span style={styles.stepText(currentStep >= 1)}>Personal</span>
                    </div>
                    <div style={styles.stepLine(currentStep >= 2)} />
                    <div style={styles.stepNode}>
                        <div style={styles.stepCircle(currentStep >= 2)}>2</div>
                        <span style={styles.stepText(currentStep >= 2)}>Health</span>
                    </div>
                    <div style={styles.stepLine(currentStep >= 3)} />
                    <div style={styles.stepNode}>
                        <div style={styles.stepCircle(currentStep >= 3)}>3</div>
                        <span style={styles.stepText(currentStep >= 3)}>Lifestyle</span>
                    </div>
                </div>

                {/* FORM CARD */}
                <form style={styles.formCard} onSubmit={handleSubmit}>

                    <h1 style={styles.mainTitle}>Health Assessment</h1>
                    <p style={styles.subTitle}>
                        Step {currentStep} of 3: {
                            currentStep === 1 ? 'Personal Information' :
                                currentStep === 2 ? 'Health Information' :
                                    'Lifestyle Information'
                        }
                    </p>

                    {/* ================= STEP 1: PERSONAL ================= */}
                    {currentStep === 1 && (
                        <div>
                            <div style={styles.sectionHeader}>
                                <div style={styles.sectionIconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div>
                                    <div style={styles.sectionTitleText}>Personal Information</div>
                                    <div style={styles.sectionSubText}>Basic details about you</div>
                                </div>
                            </div>

                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Sex</label>
                                    <select style={styles.select} className="focus-outline" name="sex" value={formData.sex} onChange={handleChange}>
                                        <option>Female</option>
                                        <option>Male</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Age Category</label>
                                    <select style={styles.select} className="focus-outline" name="age_category" value={formData.age_category} onChange={handleChange}>
                                        {['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'].map(age => (
                                            <option key={age}>{age}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Height (cm)</label>
                                    <input style={styles.input} className="focus-outline" type="number" name="height" value={formData.height} onChange={handleChange} min="120" max="220" />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Weight (kg)</label>
                                    <input style={styles.input} className="focus-outline" type="number" name="weight" value={formData.weight} onChange={handleChange} min="30" max="200" />
                                </div>
                            </div>

                            {/* Auto-Calculated BMI matching the image */}
                            <div style={{ marginTop: '10px' }}>
                                <label style={styles.label}>BMI (Auto-calculated)</label>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginTop: '5px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: '800', color: '#1cbccf' }}>{bmi}</span>
                                    <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>{bmiStatus.text}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 2: HEALTH ================= */}
                    {currentStep === 2 && (
                        <div>
                            <div style={styles.sectionHeader}>
                                <div style={styles.sectionIconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                </div>
                                <div>
                                    <div style={styles.sectionTitleText}>Health Status</div>
                                    <div style={styles.sectionSubText}>Your current health conditions</div>
                                </div>
                            </div>

                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>General Health</label>
                                    <select style={styles.select} className="focus-outline" name="general_health" value={formData.general_health} onChange={handleChange}>
                                        <option>Poor</option><option>Fair</option><option>Good</option><option>Very Good</option><option>Excellent</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Last Checkup</label>
                                    <select style={styles.select} className="focus-outline" name="checkup" value={formData.checkup} onChange={handleChange}>
                                        <option>Within the past year</option><option>Within the past 2 years</option><option>Within the past 5 years</option><option>5 or more years ago</option><option>Never</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Regular Exercise</label>
                                    <select style={styles.select} className="focus-outline" name="exercise" value={formData.exercise} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Smoking History</label>
                                    <select style={styles.select} className="focus-outline" name="smoking_history" value={formData.smoking_history} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Diabetes</label>
                                    <select style={styles.select} className="focus-outline" name="diabetes" value={formData.diabetes} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Arthritis</label>
                                    <select style={styles.select} className="focus-outline" name="arthritis" value={formData.arthritis} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Skin Cancer</label>
                                    <select style={styles.select} className="focus-outline" name="skin_cancer" value={formData.skin_cancer} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Other Cancer</label>
                                    <select style={styles.select} className="focus-outline" name="other_cancer" value={formData.other_cancer} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Depression</label>
                                    <select style={styles.select} className="focus-outline" name="depression" value={formData.depression} onChange={handleChange}><option>No</option><option>Yes</option></select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 3: LIFESTYLE ================= */}
                    {currentStep === 3 && (
                        <div>
                            <div style={styles.sectionHeader}>
                                <div style={styles.sectionIconBox}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
                                </div>
                                <div>
                                    <div style={styles.sectionTitleText}>Lifestyle & Diet</div>
                                    <div style={styles.sectionSubText}>Your eating and drinking habits</div>
                                </div>
                            </div>

                            {/* Sliders matching Image 3 */}
                            <div>
                                {/* Alcohol Slider */}
                                <div style={styles.sliderRow}>
                                    <label style={styles.label}>Alcohol Consumption (drinks per month)</label>
                                    <span style={styles.sliderValue}>{formData.alcohol_consumption}</span>
                                </div>
                                <input type="range" name="alcohol_consumption" className="custom-slider"
                                    min="0" max="60" value={formData.alcohol_consumption} onChange={handleChange}
                                    style={{ background: getSliderBackground(formData.alcohol_consumption, 60) }}
                                />

                                {/* Fruit Slider */}
                                <div style={styles.sliderRow}>
                                    <label style={styles.label}>Fruit Consumption (servings per month)</label>
                                    <span style={styles.sliderValue}>{formData.fruit_consumption}</span>
                                </div>
                                <input type="range" name="fruit_consumption" className="custom-slider"
                                    min="0" max="120" value={formData.fruit_consumption} onChange={handleChange}
                                    style={{ background: getSliderBackground(formData.fruit_consumption, 120) }}
                                />

                                {/* Vegetables Slider */}
                                <div style={styles.sliderRow}>
                                    <label style={styles.label}>Green Vegetables Consumption (servings per month)</label>
                                    <span style={styles.sliderValue}>{formData.green_vegetables_consumption}</span>
                                </div>
                                <input type="range" name="green_vegetables_consumption" className="custom-slider"
                                    min="0" max="120" value={formData.green_vegetables_consumption} onChange={handleChange}
                                    style={{ background: getSliderBackground(formData.green_vegetables_consumption, 120) }}
                                />

                                {/* Fried Potato Slider */}
                                <div style={styles.sliderRow}>
                                    <label style={styles.label}>Fried Potato Consumption (servings per month)</label>
                                    <span style={styles.sliderValue}>{formData.fried_potato_consumption}</span>
                                </div>
                                <input type="range" name="fried_potato_consumption" className="custom-slider"
                                    min="0" max="60" value={formData.fried_potato_consumption} onChange={handleChange}
                                    style={{ background: getSliderBackground(formData.fried_potato_consumption, 60) }}
                                />
                            </div>
                        </div>
                    )}

                    {/* FOOTER BUTTONS */}
                    <div style={styles.footerSection}>
                        <button
                            type="button"
                            style={styles.prevButton}
                            onClick={prevStep}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            Previous
                        </button>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                style={styles.nextButton}
                                onClick={nextStep}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 167, 232, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(12, 167, 232, 0.3)';
                                }}
                            >
                                Next
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                style={styles.nextButton}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 167, 232, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(12, 167, 232, 0.3)';
                                }}
                            >
                                Analyze My Health
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Assessment;