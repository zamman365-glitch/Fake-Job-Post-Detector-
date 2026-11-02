import React, { useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scan,
  RotateCcw,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Check,
  HelpCircle,
  FileWarning,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Button } from '../components/Button';
import { Panel } from '../components/Panel';
import { ResultCard } from '../components/ResultCard';
import { IconBadge } from '../components/IconBadge';
import { StaticGraphicFallback } from '../components/StaticGraphicFallback';
import { predictJob } from '../api/client';
import { useScanHistory } from '../hooks/useScanHistory';
import { useTheme } from '../hooks/useTheme';

// Lazy-load 3D reaction shield
const ShieldReactionScene = lazy(() => import('../three/ShieldReactionScene'));

const EMPLOYMENT_TYPES = [
  'Unknown',
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Other'
];

const EXPERIENCES = [
  'Unknown',
  'Internship',
  'Entry level',
  'Associate',
  'Mid-Senior level',
  'Director',
  'Executive',
  'Not Applicable'
];

const EDUCATIONS = [
  'Unknown',
  'Unspecified',
  'High School or equivalent',
  'Vocational',
  'Certification',
  'Some College Coursework Completed',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Professional',
  'Doctorate'
];

// Presets for rapid testing
const PRESETS = {
  scam: {
    title: 'Urgent Remote Data Entry Clerk - Instant Hiring',
    company_profile: 'Global Financial Crypto Network is rapidly expanding remote operations.',
    description: 'We are seeking an enthusiastic remote worker. No experience needed. $45/hour starting salary. Work from home whenever you want. We will mail you a check for home office equipment.',
    requirements: 'Must have a computer and Telegram account for the instant interview. High school diploma.',
    employment_type: 'Full-time',
    required_experience: 'Entry level',
    required_education: 'High School or equivalent',
    telecommuting: 1,
    has_company_logo: 0,
    has_questions: 0
  },
  legit: {
    title: 'Senior Software Engineer (Distributed Systems)',
    company_profile: 'Stripe powers online commerce for millions of businesses worldwide, operating high-availability cloud payment infrastructure.',
    description: 'Join our Core Infrastructure engineering group to design, build, and maintain fault-tolerant API pipelines processing billions in transaction volume.',
    requirements: 'BS/MS in Computer Science or equivalent. 5+ years of production experience in Go, Java, or C++. Strong understanding of distributed consensus, observability, and SQL databases.',
    employment_type: 'Full-time',
    required_experience: 'Mid-Senior level',
    required_education: "Bachelor's Degree",
    telecommuting: 1,
    has_company_logo: 1,
    has_questions: 1
  }
};

export default function ScannerPage() {
  const navigate = useNavigate();
  const { addScan } = useScanHistory();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState({
    title: '',
    company_profile: '',
    description: '',
    requirements: '',
    employment_type: 'Full-time',
    required_experience: 'Mid-Senior level',
    required_education: "Bachelor's Degree",
    telecommuting: 0,
    has_company_logo: 1,
    has_questions: 1
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [result, setResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const loadPreset = (type) => {
    setFormData(PRESETS[type]);
    setErrors({});
    setApiError(null);
    setResult(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.title || !formData.title.trim()) {
      errs.title = 'Job title is required and cannot be blank.';
    } else if (formData.title.length > 300) {
      errs.title = 'Job title must be under 300 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const scanResult = await predictJob(formData);
      setResult(scanResult);

      // Persist to client history
      addScan({
        title: formData.title.trim(),
        company_profile: formData.company_profile,
        employment_type: formData.employment_type,
        required_experience: formData.required_experience,
        required_education: formData.required_education,
        telecommuting: formData.telecommuting,
        has_company_logo: formData.has_company_logo,
        has_questions: formData.has_questions,
        probability: scanResult.probability,
        isFraud: scanResult.isFraud
      });
    } catch (err) {
      console.error('Scan failed:', err);
      setApiError(err.message || 'An unexpected communication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      company_profile: '',
      description: '',
      requirements: '',
      employment_type: 'Full-time',
      required_experience: 'Mid-Senior level',
      required_education: "Bachelor's Degree",
      telecommuting: 0,
      has_company_logo: 1,
      has_questions: 1
    });
    setResult(null);
    setApiError(null);
    setErrors({});
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Header Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--forest-300)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
              fontWeight: '600'
            }}
          >
            // SCANNER CORE
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            Job Post Authenticity Scanner
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            Feed posting content and metadata into our supervised classifier to evaluate risk anomalies.
          </p>
        </div>

        {/* Quick Presets Bar with CLEAR SHAPED ICONS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1rem 1.25rem',
            background: 'var(--charcoal-900)',
            border: '1px solid var(--charcoal-700)',
            flexWrap: 'wrap'
          }}
          className="sharp-cut"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <IconBadge
              icon={Zap}
              shape="octagonal"
              size="sm"
              variant="default"
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: '700'
              }}
            >
              Quick Benchmarks:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Load Sample Scam Post Button with Clear Shaped Icon Badge */}
            <button
              type="button"
              onClick={() => loadPreset('scam')}
              className="sharp-cut-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.95rem 0.45rem 0.55rem',
                background: 'var(--crimson-tint)',
                border: '1px solid var(--crimson-500)',
                color: 'var(--crimson-300)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                fontWeight: '700',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
              }}
            >
              <IconBadge
                icon={ShieldAlert}
                shape="octagonal"
                size="xs"
                variant="fraud"
              />
              <span>Load Sample Scam Post</span>
            </button>

            {/* Load Sample Legit Post Button with Clear Shaped Icon Badge */}
            <button
              type="button"
              onClick={() => loadPreset('legit')}
              className="sharp-cut-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.95rem 0.45rem 0.55rem',
                background: 'var(--forest-tint)',
                border: '1px solid var(--forest-500)',
                color: 'var(--forest-300)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                fontWeight: '700',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
              }}
            >
              <IconBadge
                icon={ShieldCheck}
                shape="octagonal"
                size="xs"
                variant="genuine"
              />
              <span>Load Sample Legit Post</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2rem',
            alignItems: 'start'
          }}
          id="scanner-grid"
        >
          {/* Left Column: Input Form */}
          <Panel
            tag="INPUT"
            title="Posting Attributes"
            subtitle="Parameters"
          >
            <form onSubmit={handleSubmit} noValidate>
              {/* Job Title (Required) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="job-title"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.4rem',
                    color: errors.title ? 'var(--crimson-300)' : 'var(--text)'
                  }}
                >
                  Job Title <span style={{ color: 'var(--crimson-500)' }}>*</span>
                </label>
                <input
                  id="job-title"
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'var(--input-bg)',
                    border: `1px solid ${errors.title ? 'var(--crimson-500)' : 'var(--charcoal-700)'}`,
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                {errors.title && (
                  <div
                    style={{
                      color: 'var(--crimson-300)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      marginTop: '0.35rem'
                    }}
                  >
                    {errors.title}
                  </div>
                )}
              </div>

              {/* Categorical Dropdowns */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <label
                    htmlFor="employment-type"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--muted)',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}
                  >
                    Employment Type
                  </label>
                  <select
                    id="employment-type"
                    value={formData.employment_type}
                    onChange={(e) => handleInputChange('employment_type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="required-experience"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--muted)',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}
                  >
                    Experience Level
                  </label>
                  <select
                    id="required-experience"
                    value={formData.required_experience}
                    onChange={(e) => handleInputChange('required_experience', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {EXPERIENCES.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="required-education"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--muted)',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}
                  >
                    Education Requirement
                  </label>
                  <select
                    id="required-education"
                    value={formData.required_education}
                    onChange={(e) => handleInputChange('required_education', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {EDUCATIONS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Binary Feature Toggles with Geometric Check Badges */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: 'var(--panel-tint)',
                  border: '1px solid var(--charcoal-700)'
                }}
              >
                <BinaryToggle
                  id="toggle-telecommuting"
                  label="Telecommuting"
                  description="Remote / Work from home"
                  checked={formData.telecommuting === 1}
                  onChange={(val) => handleInputChange('telecommuting', val ? 1 : 0)}
                />
                <BinaryToggle
                  id="toggle-logo"
                  label="Has Company Logo"
                  description="Verified corporate emblem"
                  checked={formData.has_company_logo === 1}
                  onChange={(val) => handleInputChange('has_company_logo', val ? 1 : 0)}
                />
                <BinaryToggle
                  id="toggle-questions"
                  label="Has Questions"
                  description="Applicant screening questionnaire"
                  checked={formData.has_questions === 1}
                  onChange={(val) => handleInputChange('has_questions', val ? 1 : 0)}
                />
              </div>

              {/* Text Areas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label
                    htmlFor="company-profile"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '0.4rem',
                      color: 'var(--text)'
                    }}
                  >
                    Company Profile
                  </label>
                  <textarea
                    id="company-profile"
                    rows={2}
                    placeholder="Brief background about the hiring entity..."
                    value={formData.company_profile}
                    onChange={(e) => handleInputChange('company_profile', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-description"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '0.4rem',
                      color: 'var(--text)'
                    }}
                  >
                    Job Description
                  </label>
                  <textarea
                    id="job-description"
                    rows={4}
                    placeholder="Responsibilities, daily workflow, team culture..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="job-requirements"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '0.4rem',
                      color: 'var(--text)'
                    }}
                  >
                    Job Requirements
                  </label>
                  <textarea
                    id="job-requirements"
                    rows={3}
                    placeholder="Skills, competencies, certifications, prerequisites..."
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Inline Error Message */}
              {apiError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--crimson-tint)',
                    border: '1px solid var(--crimson-500)',
                    marginBottom: '1.5rem',
                    color: 'var(--crimson-300)',
                    fontSize: '0.85rem'
                  }}
                  role="alert"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <AlertCircle size={18} />
                    <span>{apiError}</span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleSubmit}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  id="submit-scan-btn"
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={Scan}
                >
                  {loading ? 'Evaluating Model...' : 'Execute Fraud Scan'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  icon={RotateCcw}
                  onClick={handleReset}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Panel>

          {/* Right Column: 3D Reactive Shield & Inspection Result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 3D Reaction Chamber */}
            <div
              className={`sharp-cut ${result?.isFraud ? 'glow-fraud' : result ? 'glow-genuine' : ''}`}
              style={{
                height: '300px',
                background: 'var(--charcoal-900)',
                border: `1px solid ${
                  result?.isFraud
                    ? 'var(--crimson-500)'
                    : result
                    ? 'var(--forest-500)'
                    : 'var(--charcoal-700)'
                }`,
                position: 'relative'
              }}
            >
              <Suspense
                fallback={
                  <StaticGraphicFallback
                    state={result?.isFraud ? 'fraud' : result ? 'genuine' : 'neutral'}
                  />
                }
              >
                <ShieldReactionScene
                  result={result}
                  isScanning={loading}
                />
              </Suspense>

              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: 'var(--muted)'
                }}
              >
                REACTIVE_INSPECTOR // VIRTUAL_CHAMBER
              </div>
            </div>

            {/* Verdict Result Card */}
            {result ? (
              <ResultCard
                result={result}
                inputData={formData}
                onReset={handleReset}
                onViewDashboard={() => navigate('/dashboard')}
              />
            ) : (
              <Panel
                tag="AWAITING"
                title="Awaiting Scan Execution"
              >
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--muted)' }}>
                  <IconBadge
                    icon={HelpCircle}
                    shape="octagonal"
                    size="xl"
                    variant="neutral"
                    style={{ margin: '0 auto 1.25rem auto' }}
                  />
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: '600' }}>
                    Complete posting details & click Execute Fraud Scan
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--muted)', maxWidth: '42ch', margin: '0 auto' }}>
                    The 3D defense shield above will dynamically shift into a stable green barrier for genuine offers
                    or a glitching crimson state for fraudulent submissions.
                  </p>
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          #scanner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function BinaryToggle({ id, label, description, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      {/* Precision Vector Checkbox Badge */}
      <div
        style={{
          width: '22px',
          height: '22px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px'
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22">
          <polygon
            points="6,1 16,1 21,6 21,16 16,21 6,21 1,16 1,6"
            fill={checked ? 'var(--forest-500)' : 'var(--charcoal-900)'}
            stroke={checked ? 'var(--forest-300)' : 'var(--charcoal-600)'}
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />
        </svg>
        {checked && (
          <Check
            size={13}
            color="#ffffff"
            strokeWidth={3.2}
            style={{ position: 'absolute' }}
          />
        )}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
          {description}
        </div>
      </div>
    </label>
  );
}
