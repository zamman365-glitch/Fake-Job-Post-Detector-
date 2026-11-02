import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Clock,
  Trash2,
  Search,
  ExternalLink,
  X,
  Filter,
  ArrowUpDown,
  Scan,
  AlertTriangle
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { Button } from '../components/Button';
import { Panel } from '../components/Panel';
import { Meter } from '../components/Meter';
import { IconBadge } from '../components/IconBadge';
import { useScanHistory } from '../hooks/useScanHistory';
import { useTheme } from '../hooks/useTheme';

export default function DashboardPage() {
  const { history, stats, clearHistory, deleteScan } = useScanHistory();
  const { theme } = useTheme();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL'); // 'ALL' | 'FRAUD' | 'GENUINE'
  const [sortField, setSortField] = useState('timestamp'); // 'timestamp' | 'probability' | 'title'
  const [sortAsc, setSortAsc] = useState(false);

  // Detail Drawer state
  const [selectedScan, setSelectedScan] = useState(null);

  // Clear confirmation modal state
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  // Filtered and sorted audit logs
  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;
        if (verdictFilter === 'FRAUD') return item.isFraud;
        if (verdictFilter === 'GENUINE') return !item.isFraud;
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [history, searchTerm, verdictFilter, sortField, sortAsc]);

  // Chart 1: Probability Over Time Data
  const trendData = useMemo(() => {
    return [...history]
      .reverse()
      .map((item, index) => ({
        index: `#${index + 1}`,
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        probability: Math.round((item.probability || 0) * 100),
        isFraud: item.isFraud
      }));
  }, [history]);

  // Chart 2: Genuine vs Fake Distribution Data
  const distributionData = useMemo(() => {
    return [
      { name: 'Genuine', count: stats.genuineCount, color: 'var(--forest-500)' },
      { name: 'Fraudulent', count: stats.fraudCount, color: 'var(--crimson-500)' }
    ];
  }, [stats]);

  // Chart 3: Fraud Rate by Employment Type
  const employmentTypeData = useMemo(() => {
    const buckets = {};
    history.forEach((item) => {
      const type = item.employment_type || 'Unknown';
      if (!buckets[type]) buckets[type] = { type, total: 0, fraud: 0 };
      buckets[type].total += 1;
      if (item.isFraud) buckets[type].fraud += 1;
    });

    return Object.values(buckets).map((b) => ({
      type: b.type,
      rate: Math.round((b.fraud / b.total) * 100),
      total: b.total
    }));
  }, [history]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const chartGridStroke = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'var(--charcoal-800)';
  const chartTickColor = theme === 'light' ? '#4e5c54' : 'var(--muted)';
  const tooltipBg = theme === 'light' ? '#ffffff' : 'var(--charcoal-950)';
  const tooltipBorder = theme === 'light' ? '#d0d7d2' : 'var(--charcoal-700)';

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--forest-300)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.4rem'
              }}
            >
              // TELEMETRY & AUDIT VAULT
            </div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
              Intelligence Dashboard
            </h1>
            <p style={{ color: 'var(--muted)' }}>
              Historical fraud probability patterns, telemetry distributions, and inspected payload archives.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/scan">
              <Button variant="primary" size="md" icon={Scan}>
                Initiate New Scan
              </Button>
            </Link>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="md"
                icon={Trash2}
                onClick={() => setConfirmClearOpen(true)}
                style={{ color: 'var(--crimson-300)', border: '1px solid var(--charcoal-700)' }}
              >
                Clear History
              </Button>
            )}
          </div>
        </div>

        {/* ====================================================================
            KPI METRIC ROW
            ==================================================================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem'
          }}
        >
          <KpiCard
            label="Total Posts Evaluated"
            value={stats.totalScans}
            subvalue="Scored through inference model"
            icon={LayoutDashboard}
            variant="default"
          />
          <KpiCard
            label="Flagged as Fraud"
            value={`${stats.fraudRate}%`}
            subvalue={`${stats.fraudCount} out of ${stats.totalScans} posts suspicious`}
            icon={ShieldAlert}
            variant={stats.fraudCount > 0 ? 'fraud' : 'default'}
          />
          <KpiCard
            label="Average Risk Probability"
            value={`${stats.avgProbability}%`}
            subvalue="Aggregate mean inference score"
            icon={TrendingUp}
            variant="default"
          />
          <KpiCard
            label="Most Recent Scan"
            value={
              stats.lastScan
                ? new Date(stats.lastScan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'None'
            }
            subvalue={
              stats.lastScan
                ? new Date(stats.lastScan).toLocaleDateString([], { month: 'short', day: 'numeric' })
                : 'Awaiting activity'
            }
            icon={Clock}
            variant="genuine"
          />
        </div>

        {/* ====================================================================
            EMPTY STATE IF NO SCANS
            ==================================================================== */}
        {history.length === 0 ? (
          <div
            className="sharp-cut"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'var(--charcoal-900)',
              border: '1px solid var(--charcoal-700)',
              margin: '2rem 0'
            }}
          >
            <IconBadge
              icon={ShieldAlert}
              shape="octagonal"
              size="xl"
              variant="default"
              style={{ margin: '0 auto 1.5rem auto' }}
            />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              No Job Posts Scanned Yet
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: '45ch', margin: '0 auto 2rem auto' }}>
              Your local client history is empty. Submit your first job posting in the scanner to begin generating risk telemetry.
            </p>
            <Link to="/scan">
              <Button variant="primary" size="lg" icon={Scan}>
                Scan Your First Job Post
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* ====================================================================
                CHARTS ROW (Theme-adaptive Recharts)
                ==================================================================== */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
              }}
            >
              {/* Chart 1: Probability Over Time */}
              <Panel
                tag="CHART 01"
                title="Risk Probability Trajectory"
                subtitle="Timeline (0 to 100%)"
              >
                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="index" stroke="var(--subtle)" tick={{ fill: chartTickColor, fontSize: 11 }} />
                      <YAxis domain={[0, 100]} stroke="var(--subtle)" tick={{ fill: chartTickColor, fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: 'var(--text)'
                        }}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="probability"
                        stroke="var(--forest-300)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: 'var(--forest-300)' }}
                        activeDot={{ r: 5, fill: 'var(--forest-500)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              {/* Chart 2: Genuine vs Fake Volume */}
              <Panel
                tag="CHART 02"
                title="Classification Volume"
                subtitle="Genuine vs Fake"
              >
                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--subtle)" tick={{ fill: chartTickColor, fontSize: 11 }} />
                      <YAxis stroke="var(--subtle)" tick={{ fill: chartTickColor, fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: 'var(--text)'
                        }}
                      />
                      <Bar dataKey="count">
                        {distributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? 'var(--forest-500)' : 'var(--crimson-500)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              {/* Chart 3: Fraud Rate by Employment Type */}
              <Panel
                tag="CHART 03"
                title="Fraud Rate by Employment"
                subtitle="% Flagged Suspicious"
              >
                <div style={{ height: '220px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employmentTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={chartGridStroke} strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="type"
                        stroke="var(--subtle)"
                        tick={{ fill: chartTickColor, fontSize: 10 }}
                      />
                      <YAxis domain={[0, 100]} stroke="var(--subtle)" tick={{ fill: chartTickColor, fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: 'var(--text)'
                        }}
                        formatter={(value) => [`${value}% Fraud`, 'Risk Rate']}
                      />
                      <Bar dataKey="rate" fill="var(--crimson-500)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>

            {/* ====================================================================
                AUDIT LOG TABLE
                ==================================================================== */}
            <Panel
              tag="LOGS"
              title="Verified Inspection Records"
              subtitle={`${filteredHistory.length} matches`}
              headerAction={
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Verdict Filter Buttons */}
                  <div style={{ display: 'flex', background: 'var(--charcoal-950)', border: '1px solid var(--charcoal-700)' }}>
                    {['ALL', 'FRAUD', 'GENUINE'].map((filterMode) => (
                      <button
                        key={filterMode}
                        onClick={() => setVerdictFilter(filterMode)}
                        style={{
                          padding: '0.35rem 0.65rem',
                          background: verdictFilter === filterMode ? 'var(--charcoal-700)' : 'transparent',
                          color: verdictFilter === filterMode ? 'var(--text)' : 'var(--muted)',
                          border: 'none',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          cursor: 'pointer'
                        }}
                      >
                        {filterMode}
                      </button>
                    ))}
                  </div>
                </div>
              }
            >
              {/* Search & Utility Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    flex: '1',
                    minWidth: '240px'
                  }}
                >
                  <Search
                    size={16}
                    color="var(--muted)"
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search past scans by role title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--charcoal-700)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Table Element */}
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem'
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--charcoal-700)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--muted)',
                        textTransform: 'uppercase'
                      }}
                    >
                      <th
                        style={{ padding: '0.75rem 0.5rem', cursor: 'pointer' }}
                        onClick={() => handleSort('timestamp')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          Timestamp <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th
                        style={{ padding: '0.75rem 0.5rem', cursor: 'pointer' }}
                        onClick={() => handleSort('title')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          Job Posting Title <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                      <th
                        style={{ padding: '0.75rem 0.5rem', cursor: 'pointer' }}
                        onClick={() => handleSort('probability')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          Probability <ArrowUpDown size={12} />
                        </div>
                      </th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Verdict</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedScan(item)}
                        style={{
                          borderBottom: '1px solid var(--charcoal-700)',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--charcoal-800)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td
                          style={{
                            padding: '0.85rem 0.5rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--muted)'
                          }}
                        >
                          {new Date(item.timestamp).toLocaleString([], {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: '500', color: 'var(--text)' }}>
                          {item.title}
                        </td>
                        <td
                          style={{
                            padding: '0.85rem 0.5rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--muted)'
                          }}
                        >
                          {item.employment_type || 'Unknown'}
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', width: '150px' }}>
                          <Meter value={item.probability} segments={8} height={8} showLabels={false} />
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              background: item.isFraud ? 'rgba(193, 18, 31, 0.12)' : 'rgba(31, 122, 77, 0.12)',
                              border: `1px solid ${item.isFraud ? 'var(--crimson-500)' : 'var(--forest-500)'}`,
                              color: item.isFraud ? 'var(--crimson-300)' : 'var(--forest-300)'
                            }}
                          >
                            {item.isFraud ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                            {item.verdict || (item.isFraud ? 'Likely fake' : 'Likely genuine')}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteScan(item.id);
                            }}
                            aria-label={`Delete scan record for ${item.title}`}
                            className="sharp-cut-sm"
                            style={{
                              background: 'transparent',
                              border: '1px solid transparent',
                              color: 'var(--subtle)',
                              cursor: 'pointer',
                              padding: '5px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--crimson-300)';
                              e.currentTarget.style.borderColor = 'var(--crimson-500)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--subtle)';
                              e.currentTarget.style.borderColor = 'transparent';
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </>
        )}
      </div>

      {/* ====================================================================
          DETAIL SLIDE-OUT DRAWER
          ==================================================================== */}
      {selectedScan && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setSelectedScan(null)}
        >
          <div
            className="sharp-cut-reverse"
            style={{
              width: '100%',
              maxWidth: '520px',
              height: '100%',
              background: 'var(--charcoal-900)',
              borderLeft: `1px solid ${selectedScan.isFraud ? 'var(--crimson-500)' : 'var(--forest-500)'}`,
              padding: '2rem',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--charcoal-700)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: selectedScan.isFraud ? 'var(--crimson-300)' : 'var(--forest-300)',
                    letterSpacing: '0.1em'
                  }}
                >
                  AUDIT ID // {selectedScan.id}
                </span>
                <h3 style={{ fontSize: '1.35rem', marginTop: '0.2rem', color: 'var(--text)' }}>
                  Inspection Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                aria-label="Close drawer"
                className="sharp-cut-sm"
                style={{
                  background: 'var(--charcoal-800)',
                  border: '1px solid var(--charcoal-700)',
                  color: 'var(--text)',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Verdict and Probability */}
            <div
              style={{
                padding: '1.25rem',
                background: 'var(--charcoal-950)',
                border: `1px solid ${selectedScan.isFraud ? 'var(--crimson-500)' : 'var(--forest-500)'}`,
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                  CLASSIFICATION
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    color: selectedScan.isFraud ? 'var(--crimson-300)' : 'var(--forest-300)'
                  }}
                >
                  {selectedScan.isFraud ? 'LIKELY FAKE' : 'LIKELY GENUINE'}
                </span>
              </div>
              <Meter value={selectedScan.probability} segments={12} height={12} />
            </div>

            {/* Post Data Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                  POSITION TITLE
                </div>
                <div style={{ fontWeight: '600', color: 'var(--text)', marginTop: '2px' }}>
                  {selectedScan.title}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                    EMPLOYMENT TYPE
                  </div>
                  <div style={{ color: 'var(--text)' }}>{selectedScan.employment_type || 'Unknown'}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                    EXPERIENCE LEVEL
                  </div>
                  <div style={{ color: 'var(--text)' }}>{selectedScan.required_experience || 'Unknown'}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                    TELECOMMUTING
                  </div>
                  <div style={{ color: 'var(--text)' }}>{selectedScan.telecommuting === 1 ? 'Yes (Remote)' : 'No (Onsite)'}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                    HAS COMPANY LOGO
                  </div>
                  <div style={{ color: 'var(--text)' }}>{selectedScan.has_company_logo === 1 ? 'Yes (Verified)' : 'No (Absent)'}</div>
                </div>
              </div>

              {selectedScan.company_profile && (
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                    COMPANY PROFILE
                  </div>
                  <div style={{ color: 'var(--muted)', marginTop: '2px', lineHeight: 1.5 }}>
                    {selectedScan.company_profile}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedScan(null)}
                style={{ width: '100%' }}
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CLEAR CONFIRMATION MODAL
          ==================================================================== */}
      {confirmClearOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="sharp-cut"
            style={{
              background: 'var(--charcoal-900)',
              border: '1px solid var(--crimson-500)',
              padding: '2rem',
              maxWidth: '440px',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <IconBadge
                icon={AlertTriangle}
                shape="sharp"
                size="md"
                variant="fraud"
              />
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text)' }}>
                Clear Audit History?
              </h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              This will permanently delete all {history.length} stored scan records and metrics from your browser’s localStorage.
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setConfirmClearOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => {
                  clearHistory();
                  setConfirmClearOpen(false);
                }}
              >
                Confirm Clear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
