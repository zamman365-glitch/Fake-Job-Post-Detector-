import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Search,
  FileCheck2,
  FileWarning,
  Building,
  DollarSign,
  Mail,
  HelpCircle,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { Panel } from '../components/Panel';
import { IconBadge } from '../components/IconBadge';
import { StaticGraphicFallback } from '../components/StaticGraphicFallback';

// Lazy-load 3D Hero Scene
const HeroScene = lazy(() => import('../three/HeroScene'));

// Word tokens for Anti-gravity Float
const HEADLINE_WORDS = [
  { text: 'Fake', weight: '700' },
  { text: 'jobs', weight: '700' },
  { text: 'have', weight: '400' },
  { text: 'no', weight: '700' },
  { text: 'weight.', weight: '700' }
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(q.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    q.addEventListener('change', handler);
    return () => q.removeEventListener('change', handler);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* ====================================================================
          SIGNATURE ELEMENT: ANTI-GRAVITY HERO SECTION
          ==================================================================== */}
      <section
        style={{
          minHeight: 'calc(100vh - var(--header-height))',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '3rem 0',
          borderBottom: '1px solid var(--charcoal-700)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '2.5rem',
            alignItems: 'center',
            zIndex: 2
          }}
          id="hero-grid"
        >
          {/* Left Column: Anti-Gravity Floating Typography & CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                background: 'var(--charcoal-900)',
                border: '1px solid var(--charcoal-700)',
                marginBottom: '1.5rem'
              }}
              className="sharp-cut-sm"
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--forest-300)',
                  display: 'inline-block',
                  boxShadow: '0 0 6px var(--forest-300)'
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase'
                }}
              >
                ML ANTI-GRAVITY DETECTION ENGINE v2.4
              </span>
            </div>

            {/* Anti-Gravity Floating Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
                lineHeight: 1.05,
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.45em'
              }}
              aria-label="Fake jobs have no weight."
            >
              {HEADLINE_WORDS.map((w, index) => {
                const floatY = prefersReducedMotion ? [0, 0] : [0, -14 - (index % 3) * 6, 0];
                const floatRot = prefersReducedMotion ? [0, 0] : [0, (index % 2 === 0 ? 1.8 : -1.8), 0];
                const duration = 4.2 + (index * 0.7);

                return (
                  <motion.span
                    key={index}
                    style={{
                      display: 'inline-block',
                      color: w.text === 'Fake' ? 'var(--crimson-300)' : w.text === 'weight.' ? 'var(--forest-300)' : 'var(--text)',
                      fontWeight: w.weight
                    }}
                    animate={{
                      y: floatY,
                      rotate: floatRot
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: 'reverse',
                      duration: duration,
                      ease: 'easeInOut',
                      delay: index * 0.25
                    }}
                  >
                    {w.text}
                  </motion.span>
                );
              })}
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--muted)',
                marginBottom: '2rem',
                maxWidth: '52ch',
                lineHeight: 1.6
              }}
            >
              Real offers stay grounded. Scams float away. Paste any job post and get an
              instant calibrated fraud probability powered by our supervised pipeline.
            </p>

            {/* Action CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/scan">
                <Button
                  id="hero-scan-cta"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                >
                  Scan a job post
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  id="hero-dashboard-cta"
                  variant="secondary"
                  size="lg"
                >
                  View dashboard
                </Button>
              </Link>
            </div>

            {/* Micro telemetry badge */}
            <div
              style={{
                marginTop: '2.5rem',
                display: 'flex',
                gap: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--subtle)'
              }}
            >
              <div>
                <span style={{ color: 'var(--text)', fontWeight: '600' }}>18,000+</span>
                <span style={{ marginLeft: '4px' }}>TRAINED PATTERNS</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--charcoal-700)', paddingLeft: '1.5rem' }}>
                <span style={{ color: 'var(--forest-300)', fontWeight: '600' }}>&lt; 150ms</span>
                <span style={{ marginLeft: '4px' }}>INFERENCE LATENCY</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--charcoal-700)', paddingLeft: '1.5rem' }}>
                <span style={{ color: 'var(--text)', fontWeight: '600' }}>0-GRAV</span>
                <span style={{ marginLeft: '4px' }}>ZERO BIAS</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Anti-Gravity Wireframe Scene */}
          <div
            style={{
              height: '480px',
              position: 'relative',
              background: 'radial-gradient(circle at center, rgba(31, 122, 77, 0.08) 0%, transparent 70%)',
              border: '1px solid var(--charcoal-700)'
            }}
            className="sharp-cut"
          >
            <Suspense fallback={<StaticGraphicFallback state="neutral" />}>
              <HeroScene />
            </Suspense>

            {/* Ambient framing bracket */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--muted)',
                letterSpacing: '0.1em'
              }}
            >
              [SEC_NODE // INSPECTOR_3D]
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          HOW IT WORKS (3-STEP PIPELINE WITH FACETED ICONS)
          ==================================================================== */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--charcoal-700)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--forest-300)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}
            >
              // VERIFICATION PIPELINE
            </div>
            <h2 style={{ fontSize: '2rem' }}>How JobGuard Evaluates Offers</h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
              Three deterministic steps dissect the offer before you ever submit personal information.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <Panel
              tag="STEP 01"
              title="Paste Job Data"
              subtitle="Payload Ingestion"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <IconBadge
                  icon={Search}
                  shape="octagonal"
                  size="lg"
                  variant="genuine"
                />
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  Supply the job title, company overview, role requirements, and hiring metadata
                  such as company logo presence and telecommuting status.
                </p>
              </div>
            </Panel>

            <Panel
              tag="STEP 02"
              title="Feature Extraction"
              subtitle="Multi-Vector Scoring"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <IconBadge
                  icon={Cpu}
                  shape="octagonal"
                  size="lg"
                  variant="genuine"
                />
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  Natural language representations combine with categorical checks (education, experience,
                  screening questions) to identify synthetic phrasing and phishing lures.
                </p>
              </div>
            </Panel>

            <Panel
              tag="STEP 03"
              title="Read the Verdict"
              subtitle="Calibrated Confidence"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <IconBadge
                  icon={FileCheck2}
                  shape="octagonal"
                  size="lg"
                  variant="genuine"
                />
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  Receive a clear verdict (Likely genuine vs Likely fake), a sharp segmented probability
                  meter, and reactive 3D verification status logged in your audit drawer.
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </section>

      {/* ====================================================================
          RED FLAGS SECTION (6 COMMON SCAM SIGNALS WITH SHAPED ICONS)
          ==================================================================== */}
      <section style={{ padding: '5rem 0', background: 'var(--panel-tint)' }}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--crimson-300)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}
            >
              // ANOMALY PROFILES
            </div>
            <h2 style={{ fontSize: '2rem' }}>6 Critical Scam Signals to Watch</h2>
            <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
              Our model actively evaluates text density, semantic entropy, and categorical indicators for these patterns.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            <RedFlagItem
              number="01"
              icon={Building}
              title="Missing Company Logo & Profile"
              description="Legitimate corporations safeguard their brand assets. 88% of scraped fake listings lack a company logo or have a newly registered shadow entity."
            />
            <RedFlagItem
              number="02"
              icon={DollarSign}
              title="Upfront Equipment & Check Fees"
              description="Requests to cash an advance check, purchase home office equipment from a specific vendor, or pay software onboarding fees are always fraudulent."
            />
            <RedFlagItem
              number="03"
              icon={FileWarning}
              title="Vague or Copied Responsibilities"
              description="Short, generic job descriptions like 'manage files and perform simple online typing' designed to appeal to everyone without actual qualifications."
            />
            <RedFlagItem
              number="04"
              icon={Mail}
              title="Personal / Free Email Domains"
              description="Recruiters communicating via @gmail.com, @outlook.com, or randomized domains rather than official corporate email infrastructures."
            />
            <RedFlagItem
              number="05"
              icon={Sparkles}
              title="Unrealistic Compensation & Instant Offers"
              description="Offering $65+/hr for basic administrative or entry-level data entry with zero experience required or instant job offers without formal interviews."
            />
            <RedFlagItem
              number="06"
              icon={HelpCircle}
              title="Interviews on Telegram / WhatsApp"
              description="Immediate redirection to encrypted messaging applications without screening phone calls, verified video calls, or official applicant portals."
            />
          </div>

          {/* CTA Banner */}
          <div
            className="sharp-cut"
            style={{
              marginTop: '3.5rem',
              padding: '2.5rem',
              background: 'var(--charcoal-900)',
              border: '1px solid var(--charcoal-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
                Suspect a job offer is too good to be true?
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                Test it in JobGuard Scanner now. No account required, completely anonymous.
              </p>
            </div>
            <Link to="/scan">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Open Scanner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER
          ==================================================================== */}
      <footer
        style={{
          borderTop: '1px solid var(--charcoal-700)',
          padding: '3rem 0',
          background: 'var(--charcoal-950)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                className="shape-octagonal"
                style={{
                  width: '20px',
                  height: '20px',
                  background: 'var(--forest-500)',
                  border: '1px solid var(--forest-300)'
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: '700',
                  letterSpacing: '0.04em'
                }}
              >
                JOBGUARD
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--muted)'
                }}
              >
                // ML FRAUD DEFENSE
              </span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--muted)',
                display: 'flex',
                gap: '1.5rem'
              }}
            >
              <Link to="/scan" style={{ color: 'var(--text)' }}>
                Scanner
              </Link>
              <Link to="/dashboard" style={{ color: 'var(--text)' }}>
                Dashboard
              </Link>
              <span>FASTAPI REST CORE</span>
            </div>
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--subtle)',
              borderTop: '1px solid var(--charcoal-700)',
              paddingTop: '1.25rem'
            }}
          >
            Disclaimer: Predictions generated by JobGuard are statistical inferences based on learned textual and
            categorical attributes. Always exercise due diligence before transferring funds or identity records.
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          #hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function RedFlagItem({ number, icon: Icon, title, description }) {
  return (
    <div
      className="sharp-cut"
      style={{
        background: 'var(--charcoal-900)',
        border: '1px solid var(--charcoal-700)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <IconBadge
          icon={Icon}
          shape="sharp"
          size="md"
          variant="fraud"
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--crimson-300)'
          }}
        >
          FLAG // {number}
        </span>
      </div>

      <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text)' }}>
        {title}
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}
