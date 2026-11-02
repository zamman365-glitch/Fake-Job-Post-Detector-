import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Meter } from './Meter';
import { Button } from './Button';
import { IconBadge } from './IconBadge';

/**
 * ResultCard
 * Displays the prediction verdict, probability, segmented meter,
 * risk signals breakdown, and mandatory disclaimer.
 */
export function ResultCard({
  result,
  inputData,
  onReset,
  onViewDashboard
}) {
  if (!result) return null;

  const isFraud = result.isFraud;
  const probPercent = (result.probability * 100).toFixed(1);

  const verdictTitle = isFraud ? 'LIKELY FAKE' : 'LIKELY GENUINE';
  const verdictSubtitle = isFraud
    ? 'High statistical probability of fraud detected.'
    : 'Patterns align with verified legitimate job postings.';

  return (
    <div
      aria-live="polite"
      className={`sharp-cut ${isFraud ? 'glow-fraud' : 'glow-genuine'}`}
      style={{
        background: 'var(--charcoal-900)',
        border: `1px solid ${isFraud ? 'var(--crimson-500)' : 'var(--forest-500)'}`,
        padding: '1.75rem',
        position: 'relative'
      }}
    >
      {/* Header Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--charcoal-700)',
          paddingBottom: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <IconBadge
            icon={isFraud ? ShieldAlert : ShieldCheck}
            shape="octagonal"
            size="lg"
            variant={isFraud ? 'fraud' : 'genuine'}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: isFraud ? 'var(--crimson-300)' : 'var(--forest-300)',
                textTransform: 'uppercase'
              }}
            >
              SCAN CLASSIFICATION
            </div>
            <h3
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                color: isFraud ? 'var(--crimson-300)' : 'var(--forest-300)',
                margin: 0
              }}
            >
              {verdictTitle}
            </h3>
          </div>
        </div>

        {/* Large Probability Display */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--muted)',
              letterSpacing: '0.08em'
            }}
          >
            FRAUD PROBABILITY
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.25rem',
              fontWeight: '700',
              lineHeight: 1,
              color: isFraud ? 'var(--crimson-300)' : 'var(--forest-300)'
            }}
          >
            {probPercent}%
          </div>
        </div>
      </div>

      <p
        style={{
          color: 'var(--text)',
          fontSize: '0.9rem',
          marginBottom: '1.25rem'
        }}
      >
        {verdictSubtitle}
      </p>

      {/* Segmented Meter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Meter value={result.probability} segments={16} height={16} />
      </div>

      {/* Risk Signals Checklist */}
      <div
        style={{
          background: 'var(--charcoal-950)',
          border: '1px solid var(--charcoal-700)',
          padding: '1.1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}
        >
          POST FEATURE TELEMETRY
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <FeatureIndicator
            label="Company Logo"
            present={Number(inputData?.has_company_logo) === 1}
            positiveWhenTrue={true}
          />
          <FeatureIndicator
            label="Screening Questions"
            present={Number(inputData?.has_questions) === 1}
            positiveWhenTrue={true}
          />
          <FeatureIndicator
            label="Telecommuting / Remote"
            present={Number(inputData?.telecommuting) === 1}
            positiveWhenTrue={false}
            flagLabel="High remote scam ratio"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--muted)' }}>Role Level:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
              {inputData?.required_experience || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div
        style={{
          background: 'var(--panel-tint)',
          borderLeft: `3px solid ${isFraud ? 'var(--crimson-500)' : 'var(--forest-500)'}`,
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--muted)',
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'flex-start'
        }}
      >
        <IconBadge
          icon={AlertTriangle}
          shape="sharp"
          size="sm"
          color="var(--muted)"
          style={{ marginTop: '1px' }}
        />
        <span>
          <strong>Disclaimer:</strong> This is a statistical estimate, not proof.
          Verify the employer before sharing personal or financial details.
        </span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button
          variant="secondary"
          size="md"
          icon={RotateCcw}
          onClick={onReset}
        >
          Scan Another Post
        </Button>
        {onViewDashboard && (
          <Button
            variant={isFraud ? 'danger' : 'primary'}
            size="md"
            icon={ArrowRight}
            onClick={onViewDashboard}
          >
            View in Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}

function FeatureIndicator({ label, present, positiveWhenTrue, flagLabel }) {
  const isHealthy = positiveWhenTrue ? present : true;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
      <IconBadge
        icon={present ? (positiveWhenTrue ? CheckCircle2 : CheckCircle2) : (positiveWhenTrue ? XCircle : CheckCircle2)}
        shape="sharp"
        size="sm"
        variant={present ? (positiveWhenTrue ? 'genuine' : 'fraud') : (positiveWhenTrue ? 'fraud' : 'default')}
      />
      <span style={{ color: 'var(--text)' }}>{label}:</span>
      <span style={{ fontFamily: 'var(--font-mono)', color: isHealthy ? 'var(--muted)' : 'var(--crimson-300)' }}>
        {present ? 'Yes' : 'No'} {(!positiveWhenTrue && present && flagLabel) ? `(${flagLabel})` : ''}
      </span>
    </div>
  );
}
