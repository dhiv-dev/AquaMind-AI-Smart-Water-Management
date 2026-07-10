import React, { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard'); 
  const [motorStatus, setMotorStatus] = useState(true);
  const [leakSimulated, setLeakSimulated] = useState(false);
  const [valvePosition, setValvePosition] = useState(85);
  const [alertFilter, setAlertFilter] = useState('ALL');
  const [settingsMode, setSettingsMode] = useState('Eco-Optimized');

  const [sensorData, setSensorData] = useState({
    waterLevel: 68,
    flowRate: 3.2,
    pressure: 42,
    temp: 24.2,
    predictedUsage: 410,
    phValue: 7.2,
    turbidity: 1.4,
    tdsLevel: 180
  });

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/data`);
        if (response.ok) {
          const data = await response.json();
          setSensorData(data);
        }
      } catch (err) {
        setSensorData(prev => ({
          ...prev,
          waterLevel: leakSimulated ? Math.max(15, (prev?.waterLevel || 68) - 1.2) : Math.min(95, (prev?.waterLevel || 68) + (motorStatus ? 0.6 : -0.1)),
          flowRate: leakSimulated ? 5.8 : (motorStatus ? 3.2 : 0.0),
          pressure: leakSimulated ? 14 : (motorStatus ? 54 : 38 + Math.sin(Date.now() / 3000) * 1.2),
          temp: 24.5 + Math.sin(Date.now() / 8000) * 0.1,
          phValue: 7.3 + Math.sin(Date.now() / 12000) * 0.04,
          turbidity: leakSimulated ? 4.9 : 1.2,
          tdsLevel: 178
        }));
      }
    };
    fetchLiveStream();
    const interval = setInterval(fetchLiveStream, 1500); 
    return () => clearInterval(interval);
  }, [motorStatus, leakSimulated]);

  const handleMotorToggle = async () => {
    setMotorStatus(!motorStatus);
    try {
      await fetch(`${BACKEND_URL}/api/motor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !motorStatus })
      });
    } catch (e) {}
  };

  const handleLeakSimulation = async () => {
    setLeakSimulated(!leakSimulated);
    if (!leakSimulated) setMotorStatus(false);
    try {
      await fetch(`${BACKEND_URL}/api/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateLeak: !leakSimulated })
      });
    } catch (e) {}
  };

  return (
    <div style={styles.appViewport}>
      
      {/* GLOBAL PIPELINE COMPROMISE BANNER */}
      {leakSimulated && (
        <div style={styles.criticalStateBanner}>
          <span>🚨 <strong>CRITICAL LIVE ALERT:</strong> Structural system pressure drop identified in Section 4B! Pump isolation routing triggered.</span>
          <button onClick={() => setLeakSimulated(false)} style={styles.clearOverrideBtn}>Acknowledge Fault</button>
        </div>
      )}

      <div style={styles.appShellLayout}>
        
        {/* 🧭 NAVIGATION MASTER SIDEBAR */}
        <aside style={styles.sidebarNavigationContainer}>
          <div style={styles.sidebarBrandingHeader}>
            <div style={styles.brandIconNode}>🌊</div>
            <div>
              <h1 style={styles.brandTitleText}>AquaMind</h1>
              <p style={styles.brandSubheaderLabel}>AI SMART WATER MANAGEMENT</p>
            </div>
          </div>

          <nav style={styles.sidebarNavMenuGrid}>
            {[
              { id: 'Dashboard', icon: '📋' },
              { id: 'Live Monitoring', icon: '📡' },
              { id: 'AI Predictions', icon: '🧠' },
              { id: 'Usage Analytics', icon: '📈' },
              { id: 'Leak Detection', icon: '🛡️' },
              { id: 'Motor Control', icon: '🔌' },
              { id: 'Alerts & Notifications', icon: '🔔' },
              { id: 'History', icon: '⏳' },
              { id: 'Settings', icon: '⚙️' },
              { id: 'System Status', icon: '🛠️' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{ ...styles.navLinkItem, ...(activeTab === item.id ? styles.navLinkActiveState : {}) }}
              >
                <span style={styles.navLinkIconWrapper}>{item.icon}</span>
                <span style={styles.navLinkLabelText}>{item.id}</span>
              </button>
            ))}
          </nav>

          <div style={styles.sidebarEcoBrandingBox}>
            <div style={{ fontSize: '1.3rem' }}>🌱</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>Save Water</span>
              <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: '600' }}>Save Life</span>
            </div>
          </div>
        </aside>

        {/* 🖥️ APPLICATION CENTRAL HUB WORKSPACE */}
        <main style={styles.centralHubWorkspaceViewport}>
          
          {/* SYSTEM ADMINISTRATIVE ROW HEADER */}
          <header style={styles.centralWorkspaceHeaderRow}>
            <div>
              <h2 style={styles.workspaceHeaderTitle}>{activeTab}</h2>
              <p style={styles.workspaceHeaderSubtitle}>Smart Water. Smart Future.</p>
            </div>
            
            <div style={styles.rightHeaderControlsStack}>
              <div style={styles.headerIconBadgeNotification}>🔔<span style={styles.activeNotificationMiniDot}></span></div>
              <div style={styles.headerIconBadgeNotification}>🌙</div>
              <div style={styles.userProfileMetaBlockDivider}>
                <div style={{ textAlign: 'right' }}>
                  <span style={styles.userProfileNameTag}>AquaMind Admin</span>
                  <span style={styles.userNetworkConnectivityLabel}>System Cluster Master</span>
                </div>
                <div style={styles.userAvatarCylinderCircle}>AA</div>
              </div>
            </div>
          </header>

          {/* DYNAMIC SCREEN LAYOUT MANAGER SWITCHBOARD */}
          <div style={styles.workspaceViewportBodyScrollWindow}>
            
            {activeTab === 'Dashboard' && (
              <div style={styles.dashboardThreeColumnMacroGrid}>
                
                {/* --- ROW 1: TOP SUMMARY MACRO CARDS MATRIX --- */}
                <div style={styles.summaryMatrixFullWidthSpannedRow}>
                  
                  {/* Card 1: Main 3D Cylinder Tank Model */}
                  <div style={styles.glassDashboardMetricCard}>
                    <div>
                      <span style={styles.metricCardMiniLabelTitle}>CURRENT WATER LEVEL</span>
                      <h3 style={styles.metricCardMainMetricDisplay}>{Math.round(sensorData?.waterLevel || 0)}%</h3>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>● Normal Storage State</span>
                    </div>
                    <div style={styles.cylinder3DTankComponentWrapperCanvas}>
                      <div style={styles.tankStructuralTopRimCapLayer}></div>
                      <div style={styles.tankStructuralHullMainCylinderBody}>
                        <div style={{ ...styles.tankInternalFluidMassBodyElement, height: `${sensorData?.waterLevel || 0}%`, background: leakSimulated ? 'linear-gradient(to top, #7f1d1d, #ef4444)' : 'linear-gradient(to top, #1d4ed8, #38bdf8)' }}>
                          <div style={styles.tankFluidSurfaceInteractiveWaveCapOverlay}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: AI Predictive Analysis */}
                  <div style={styles.glassDashboardMetricCard}>
                    <div>
                      <span style={styles.metricCardMiniLabelTitle}>PREDICTED STATUS (AI)</span>
                      <p style={styles.metricCardSubtextParagraph}>Tank may reach <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>20%</span></p>
                      <h3 style={{ ...styles.metricCardMainMetricDisplay, color: '#a855f7', fontSize: '1.6rem', marginTop: '4px' }}>in 1 hr 40 min</h3>
                    </div>
                    <div style={styles.rightGraphicAssetNodeIconBadge}>🧠</div>
                  </div>

                  {/* Card 3: Live Volumetric Usage Statistics */}
                  <div style={styles.glassDashboardMetricCard}>
                    <div>
                      <span style={styles.metricCardMiniLabelTitle}>TODAY'S USAGE VOLUME</span>
                      <h3 style={{ ...styles.metricCardMainMetricDisplay, color: '#fbbf24' }}>1250 <small style={{ fontSize: '1rem', color: '#64748b' }}>L</small></h3>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>↑ 12% <span style={{ color: '#475569', fontWeight: 'normal' }}>from yesterday</span></span>
                    </div>
                    <div style={styles.rightGraphicAssetNodeIconBadge}>📊</div>
                  </div>

                  {/* Card 4: Water Conservation Tracking */}
                  <div style={styles.glassDashboardMetricCard}>
                    <div>
                      <span style={styles.metricCardMiniLabelTitle}>WATER SAVED METRIC</span>
                      <h3 style={{ ...styles.metricCardMainMetricDisplay, color: '#10b981' }}>320 <small style={{ fontSize: '1rem', color: '#64748b' }}>L</small></h3>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>Great Job! 🌱</span>
                    </div>
                    <div style={styles.rightGraphicAssetNodeIconBadge}>♻️</div>
                  </div>

                </div>

                {/* --- ROW 2: DATA GRAPH VISUALIZERS GRID --- */}
                
                {/* Box 5: 7-Day Analytics Trend Line Area Chart */}
                <div style={{ ...styles.glassDashboardMetricCard, gridColumn: isMobile() ? '1fr' : 'span 2', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  <h4 style={styles.nestedCardTitleTextComponent}>Water Level Analysis Trend (7 Days)</h4>
                  <div style={styles.trendGraphInteractiveVectorCanvasArea}>
                    {[75, 62, 58, 52, 48, 42, sensorData?.waterLevel || 65].map((h, i) => (
                      <div key={i} style={styles.trendGraphColumnTrackAligner}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>{Math.round(h)}%</span>
                        <div style={{ ...styles.trendGraphPillarMassBodyStrip, height: `${h * 1.1}px`, background: 'linear-gradient(to top, #1e3a8a, #38bdf8)' }}>
                          <div style={styles.trendGraphPillarGlowTopCapHead}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>{['May 15', 'May 16', 'May 17', 'May 18', 'May 19', 'May 20', 'Today'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Box 6: Multi-Tank Overview Checklist Tracker */}
                <div style={styles.glassDashboardMetricCard}>
                  <h4 style={styles.nestedCardTitleTextComponent}>System Tank Fleet Overview</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'left' }}>
                    {[
                      { name: 'Primary Main Tank Storage', lvl: `${Math.round(sensorData?.waterLevel)}%`, color: '#38bdf8' },
                      { name: 'Overhead Auxiliary Reservoir', lvl: '45%', color: '#a855f7' },
                      { name: 'Subsurface Irrigation Basin', lvl: '82%', color: '#10b981' }
                    ].map((tnk, idx) => (
                      <div key={idx} style={styles.individualTankProgressRowItem}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span style={{ color: '#f1f5f9', fontWeight: '500' }}>{tnk.name}</span>
                          <strong style={{ color: tnk.color }}>{tnk.lvl}</strong>
                        </div>
                        <div style={{ height: '5px', backgroundColor: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: tnk.lvl, backgroundColor: tnk.color, borderRadius: '3px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- ROW 3: DEEP COGNITIVE AI INSIGHTS & ACTUATOR SWITCHES --- */}
                
                {/* Box 7: Deep Learning AI Insight Topology Section */}
                <div style={styles.glassDashboardMetricCard}>
                  <h4 style={styles.nestedCardTitleTextComponent}>Advanced Neural AI Insights</h4>
                  <div style={styles.aiInsightDataFlexWrapper}>
                    <div style={styles.aiBrainTopologyMicroGridMeshGraphic}>
                      {[...Array(4)].map((_, i) => <div key={i} style={{ ...styles.aiMeshPulsePointNodeIndicator, animationDelay: `${i * 0.3}s` }}></div>)}
                    </div>
                    <p style={styles.aiInsightParagraphNarrativeText}>
                      Aggregate consumer velocity scales exponentially between **7:00 AM - 10:00 AM**. The predictive core recommends initializing proactive refill cycles prior to peak hours to reduce distribution stress indexes.
                    </p>
                  </div>
                </div>

                {/* Box 8: Total Spatial Consumption Donut Section */}
                <div style={styles.glassDashboardMetricCard}>
                  <h4 style={styles.nestedCardTitleTextComponent}>Resource Segmentation Chart</h4>
                  <div style={styles.donutAnalyticsCanvasGraphicContainer}>
                    <div style={styles.donutChartOuterCircleConicGradientTrack}>
                      <div style={styles.donutChartInternalDataLabelHoleCore}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>2450 <small style={{ fontSize: '0.75rem', color: '#64748b' }}>L</small></span>
                        <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 'bold', letterSpacing: '0.5px' }}>AGGREGATE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box 9: Industrial Pump Actuator Override Relays Panel */}
                <div style={styles.glassDashboardMetricCard}>
                  <h4 style={styles.nestedCardTitleTextComponent}>Industrial Pump Actuator Control</h4>
                  <div style={styles.hardwareMotorPanelCentralAlignerBlock}>
                    {/* 3D Pump Mechanical Shell Rendering Graphic Simulation */}
                    <div style={styles.hardwareMotorPumpChamberIsometricCaseShell}>
                      <div style={{ ...styles.hardwareMotorSpindleRotorFinPropellerBlade, animation: motorStatus ? 'spinMechanicalFin 0.4s linear infinite' : 'none', backgroundColor: motorStatus ? '#10b981' : '#475569' }}></div>
                      <div style={styles.hardwareMotorDischargeNozzleApertureOutletPipe}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>RELAY FEEDBACK LOOP STATE</span>
                      <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: motorStatus ? '#10b981' : '#64748b' }}>{motorStatus ? 'DRIVE ACTIVE' : 'ISOLATED'}</h3>
                    </div>
                    <button onClick={handleMotorToggle} disabled={leakSimulated} style={{ ...styles.hardwareManualOverrideSwitchButtonTrigger, backgroundColor: motorStatus ? '#ef4444' : '#10b981', opacity: leakSimulated ? 0.3 : 1 }}>
                      {motorStatus ? 'FORCE SYSTEM SHUTDOWN' : 'FORCE RELAY ACTIVATION'}
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* LIVE DATA CHANNELS MULTI-TAB CONTROLLERS FOR ALL COMPLIANCE NODES */}
            {activeTab === 'Live Monitoring' && (
              <div style={styles.genericViewTabWrapperGrid}>
                <div style={styles.glassDashboardMetricCard}>
                  <h3 style={styles.nestedCardTitleTextComponent}>📡 Real-time Sensor Channel Handshakes</h3>
                  <div style={styles.qualityContainerGrid}>
                    <div style={styles.qualityBlock}>Mainline Pressure <strong style={{color:'#60a5fa', fontSize:'1.4rem', fontFamily:'monospace'}}>{sensorData?.pressure || 0} PSI</strong></div>
                    <div style={styles.qualityBlock}>Discharge Velocity <strong style={{color:'#10b981', fontSize:'1.4rem', fontFamily:'monospace'}}>{sensorData?.flowRate || '0.0'} L/s</strong></div>
                    <div style={styles.qualityBlock}>Core Water Temp <strong style={{color:'#f59e0b', fontSize:'1.4rem', fontFamily:'monospace'}}>{sensorData?.temp ? sensorData.temp.toFixed(1) : '24.0'}°C</strong></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'AI Predictions' && (
              <div style={styles.genericViewTabWrapperGrid}>
                <div style={styles.glassDashboardMetricCard}>
                  <h3 style={styles.nestedCardTitleTextComponent}>🧠 Machine Learning Horizon Forecasting</h3>
                  <div style={styles.qualityContainerGrid}>
                    <div style={styles.qualityBlock}>Consumption Target Allocation <strong style={{color:'#a855f7', fontSize:'1.4rem', fontFamily:'monospace'}}>{sensorData?.predictedUsage || 410} L</strong></div>
                    <div style={styles.qualityBlock}>Confidence Rating Score <strong style={{color:'#10b981', fontSize:'1.4rem'}}>98.4% Accuracy</strong></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Usage Analytics' && (
              <div style={styles.genericViewTabWrapperGrid}>
                <div style={styles.glassDashboardMetricCard}>
                  <h3 style={styles.nestedCardTitleTextComponent}>📈 Spatial Volume Consumption Segmentation</h3>
                  <div style={styles.qualityContainerGrid}>
                    <div style={styles.qualityBlock}>Domestic Residential Flow <strong style={{color:'#3b82f6', fontSize:'1.2rem'}}>1,347 L (55%)</strong></div>
                    <div style={styles.qualityBlock}>Mechanical Cooling Bus Loop <strong style={{color:'#fbbf24', fontSize:'1.2rem'}}>612 L (25%)</strong></div>
                    <div style={styles.qualityBlock}>Irrigation Secondary Station <strong style={{color:'#a855f7', fontSize:'1.2rem'}}>491 L (20%)</strong></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Leak Detection' && (
              <div style={styles.genericViewTabWrapperGrid}>
                <div style={{...styles.glassDashboardMetricCard, borderColor: leakSimulated ? '#ef4444' : '#1e293b'}}>
                  <h3 style={styles.nestedCardTitleTextComponent}>🛡️ Topographic Pipeline Radar Structural Integrity Scan</h3>
                  <div style={{ padding: '30px', backgroundColor: '#040810', borderRadius: '12px', textAlign: 'center' }}>
                    <span style={{ color: leakSimulated ? '#ef4444' : '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {leakSimulated ? '⚠️ ALERT: CRITICAL ANOMALY PROFILE RECOGNIZED IN SECTION 4B' : '✅ GRID INTEGRITY BOUNDARIES SECURE'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Motor Control' && (
              <div style={styles.genericViewTabWrapperGrid}>
                <div style={styles.glassDashboardMetricCard}>
                  <h3 style={styles.nestedCardTitleTextComponent}>🔌 Manual Bus Valve Calibration Interface</h3>
                  <div style={{ textAlign: 'left', padding: '10px' }}>
                    <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Electronic Valve Aperture: <strong>{valvePosition}% Capacity</strong></label>
                    <input type="range" min="0" max="100" value={valvePosition} onChange={(e) => setValvePosition(e.target.value)} style={{ width: '100%', marginTop: '14px', accentColor: '#2563eb' }} />
                  </div>
                </div>
              </div>
            )}

            {['Alerts & Notifications', 'History', 'Settings', 'System Status'].includes(activeTab) && (
              <div style={styles.genericViewTabWrapperGrid}>
                <div style={styles.glassDashboardMetricCard}>
                  <h3 style={styles.nestedCardTitleTextComponent}>{activeTab} Operations Console</h3>
                  <div style={{ padding: '30px', backgroundColor: '#040810', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    System variable endpoints fully mapped to operational gateway loop interfaces securely.
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* PERSISTENT RUNTIME PITCH SIMULATOR CONSOLE OVERRIDE FOOTER ROW */}
          <footer style={styles.centralHubWorkspaceFooterUtilityRow}>
            <div style={styles.footerStatusMetricsGroupContainer}>
              <span style={styles.footerMetricIndicatorLabel}><span style={styles.blueTelemetrySignalCoreDot}></span> Live Telemetry Channel Sync</span>
              <span style={styles.footerMetricIndicatorLabel}><span style={styles.pinkTelemetrySignalCoreDot}></span> Regression Analysis Worker Active</span>
            </div>
            
            {/* 🏷️ INCORPORATED DEVELOPER CREDIT LINE */}
            <div style={styles.personalizedDeveloperTeamCreditsSignatureLine}>Developed by Dhivesh & Kiruthick</div>
            
            <button onClick={handleLeakSimulation} style={{ ...styles.hardwareAnomalySimulationTriggerButton, borderColor: leakSimulated ? '#ef4444' : '#1e293b', color: leakSimulated ? '#ef4444' : '#64748b' }}>
              🚀 {leakSimulated ? 'Clear Hardware Simulation Fault' : 'Simulate Live Pipe Leak Anomaly'}
            </button>
          </footer>

        </main>

      </div>

      <style>{`
        @keyframes liquidWaveFlowSimulation { 0% { transform: translateX(0); } 50% { transform: translateX(-25%) scaleY(0.9); } 100% { transform: translateX(-50%); } }
        @keyframes spinMechanicalFin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseMatrixRadarGlowPoint { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
      `}</style>
    </div>
  );
}

// 📱 Responsive Screen Checker Utility Helper
const isMobile = () => window.innerWidth <= 1024;

// 🎨 COMPREHENSIVE INDUSTRIAL MATRIX DESIGN SYSTEM STYLES DICTIONARY
const styles = {
  appViewport: { backgroundColor: '#03060f', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  criticalStateBanner: { backgroundColor: '#7f1d1d', borderBottom: '2px solid #ef4444', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#fca5a5', fontWeight: '600', zIndex: 9999 },
  clearOverrideBtn: { backgroundColor: '#b91c1c', border: '1px solid #ef4444', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '0.75rem' },
  appShellLayout: { display: 'flex', flex: 1, height: '100vh', overflow: 'hidden', boxSizing: 'border-box' },
  sidebarNavigationContainer: { width: '280px', backgroundColor: '#070a12', borderRight: '1px solid #111726', display: 'flex', flexDirection: 'column', padding: '30px 20px', boxSizing: 'border-box', flexShrink: 0 },
  sidebarBrandingHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px', paddingLeft: '4px' },
  brandIconNode: { fontSize: '2.2rem', color: '#2563eb', filter: 'drop-shadow(0 4px 12px rgba(37,99,235,0.25))' },
  brandTitleText: { fontSize: '1.5rem', fontWeight: '900', margin: 0, color: '#fff', letterSpacing: '0.3px' },
  brandSubheaderLabel: { fontSize: '0.65rem', color: '#334155', margin: 0, fontWeight: '800', letterSpacing: '0.6px' },
  sidebarNavMenuGrid: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' },
  navLinkItem: { display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', backgroundColor: 'transparent', border: 'none', borderRadius: '10px', color: '#475569', textAlign: 'left', cursor: 'pointer', fontSize: '0.95rem', width: '100%', transition: 'all 0.15s ease', boxSizing: 'border-box' },
  navLinkActiveState: { backgroundColor: '#1e3a8a', color: '#38bdf8', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  navLinkIconWrapper: { fontSize: '1.15rem' },
  navLinkLabelText: { flex: 1, fontWeight: '500' },
  sidebarEcoBrandingBox: { backgroundColor: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.12)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto' },
  centralHubWorkspaceViewport: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#040711', padding: '40px', overflowY: 'auto', boxSizing: 'border-box', position: 'relative' },
  centralWorkspaceHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #0f172a', paddingBottom: '24px', flexShrink: 0 },
  workspaceHeaderTitle: { fontSize: '2.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f8fafc' },
  workspaceHeaderSubtitle: { fontSize: '0.85rem', color: '#475569', margin: '4px 0 0 0', fontWeight: '500' },
  rightHeaderControlsStack: { display: 'flex', alignItems: 'center', gap: '24px' },
  headerIconBadgeNotification: { fontSize: '1.2rem', color: '#64748b', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' },
  activeNotificationMiniDot: { position: 'absolute', top: '0', right: '0', width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' },
  userProfileMetaBlockDivider: { display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '1px solid #111726', paddingLeft: '24px' },
  userProfileNameTag: { fontSize: '0.9rem', fontWeight: '700', color: '#f1f5f9', display: 'block' },
  userNetworkConnectivityLabel: { fontSize: '0.75rem', color: '#475569', fontWeight: '500' },
  userAvatarCylinderCircle: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' },
  workspaceViewportBodyScrollWindow: { flex: 1, display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '80px' },
  dashboardThreeColumnMacroGrid: { display: 'grid', gridTemplateColumns: isMobile() ? '1fr' : 'repeat(3, 1fr)', gap: '24px', width: '100%' },
  summaryMatrixFullWidthSpannedRow: { gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: isMobile() ? '1fr' : 'repeat(4, 1fr)', gap: '20px', width: '100%' },
  glassDashboardMetricCard: { backgroundColor: '#090d16', border: '1px solid #111726', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', boxSizing: 'border-box', relative: 'position' },
  metricCardMiniLabelTitle: { fontSize: '0.7rem', color: '#475569', fontWeight: '800', letterSpacing: '0.6px', display: 'block', textTransform: 'uppercase' },
  metricCardMainMetricDisplay: { fontSize: '2.2rem', fontWeight: '900', margin: '12px 0 6px 0', fontFamily: 'monospace', color: '#fff', lineHeight: 1 },
  metricCardSubtextParagraph: { margin: '10px 0 0 0', fontSize: '0.85rem', color: '#64748b' },
  rightGraphicAssetNodeIconBadge: { fontSize: '2rem', opacity: 0.15 },
  cylinder3DTankComponentWrapperCanvas: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' },
  tankStructuralTopRimCapLayer: { width: '54px', height: '10px', backgroundColor: '#334155', borderRadius: '50%', marginBottom: '-5px', zIndex: 4, position: 'relative', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)' },
  tankStructuralHullMainCylinderBody: { width: '54px', height: '75px', backgroundColor: '#0f172a', borderRadius: '0 0 8px 8px', position: 'relative', overflow: 'hidden', border: '2px solid #1e293b', boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)' },
  tankInternalFluidMassBodyElement: { position: 'absolute', bottom: 0, left: 0, right: 0, transition: 'height 0.5s ease' },
  tankFluidSurfaceInteractiveWaveCapOverlay: { position: 'absolute', top: '-6px', left: 0, width: '200%', height: '12px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '40%', animation: 'liquidWaveFlowSimulation 3s linear infinite' },
  nestedCardTitleTextComponent: { margin: '0 0 24px 0', fontSize: '1rem', fontWeight: '700', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #111726', paddingBottom: '12px', width: '100%' },
 ...
<SomeComponent
  width={...}
  ...
  width={...}
/>
...
  filterButtonTabContainerRow: { display: 'flex', gap: '8px' },
  filterTabPillBadgeButton: { padding: '8px 16px', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' },
  logsStackWrapperList: { display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' },
  individualLogItemBox: { padding: '16px', borderLeft: '4px solid', borderRadius: '8px', fontSize: '0.9rem', color: '#94a3b8' },
  tabularDataLayoutEngine: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' },
  tableRowDividerLine: { borderBottom: '1px solid #111726' },
  customModernNativeHtmlSelectDropdown: { padding: '12px', width: '100%', backgroundColor: '#040711', border: '1px solid #111726', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' },
  hardwareGridDisplayMesh: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', width: '100%' },
  hardwareGridNodeCardLeaf: { padding: '24px', backgroundColor: '#040711', borderRadius: '14px', border: '1px solid #111726', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  centralHubWorkspaceFooterUtilityRow: { position: 'fixed', bottom: 0, right: 0, left: '280px', height: '60px', borderTop: '1px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', boxSizing: 'border-box', zIndex: 100, backgroundColor: '#040711' },
  footerStatusMetricsGroupContainer: { display: 'flex', gap: '24px' },
  footerMetricIndicatorLabel: { fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' },
  blueTelemetrySignalCoreDot: { width: '8px', height: '8px', backgroundColor: '#2563eb', borderRadius: '50%' },
  pinkTelemetrySignalCoreDot: { width: '8px', height: '8px', backgroundColor: '#db2777', borderRadius: '50%' },
  personalizedDeveloperTeamCreditsSignatureLine: { fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', fontWeight: '600', letterSpacing: '0.3px' },
  hardwareAnomalySimulationTriggerButton: { backgroundColor: 'transparent', border: '1px solid #111726', padding: '8px 18px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }
};

export default App;