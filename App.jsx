import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FieldTelemetry from './components/FieldTelemetry';
import AgroBotAdvisory from './components/AgroBotAdvisory';
import DiseaseDiagnostics from './components/DiseaseDiagnostics';
import ClimateForecast from './components/ClimateForecast';
import MarketHub from './components/MarketHub';
import SpatialFarmMap from './components/SpatialFarmMap';
import DiagnosticModal from './components/DiagnosticModal';

import { INITIAL_PLOTS } from './data/mockTelemetry';

export default function App() {
  const [plots, setPlots] = useState(INITIAL_PLOTS);
  const [selectedPlotId, setSelectedPlotId] = useState('plot-1');
  const [activeTab, setActiveTab] = useState('telemetry');
  const [currentLang, setCurrentLang] = useState('en-US');
  const [theme, setTheme] = useState('dark');
  const [activeModalSample, setActiveModalSample] = useState(null);
  const [prefilledQuery, setPrefilledQuery] = useState('');

  // Set theme attribute on document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activePlot = plots.find(p => p.id === selectedPlotId) || plots[0];

  // Handler for sensor simulation triggers
  const handleSimulateCondition = (type) => {
    setPlots(prevPlots => prevPlots.map(p => {
      if (p.id !== selectedPlotId) return p;

      if (type === 'drought') {
        return {
          ...p,
          moisture: 28,
          stressLevel: 'Critical Drought Deficit (28%)',
          healthScore: 61
        };
      } else if (type === 'nitrogen') {
        return {
          ...p,
          nitrogen: 95,
          stressLevel: 'Severe Nitrogen Depletion (95 mg/kg)',
          healthScore: 68
        };
      } else if (type === 'humidity') {
        return {
          ...p,
          humidity: 86,
          airTemp: 32,
          stressLevel: 'High Canopy Fungal Humidity (86%)',
          healthScore: 70
        };
      } else if (type === 'optimal') {
        return {
          ...p,
          moisture: 60,
          nitrogen: 160,
          humidity: 58,
          airTemp: 26,
          stressLevel: 'Optimal Field Condition',
          healthScore: 96
        };
      }
      return p;
    }));
  };

  const handleOpenAgronomistWithContext = (queryContext) => {
    if (queryContext) setPrefilledQuery(queryContext);
    setActiveTab('advisory');
  };

  return (
    <div className="app-container">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPlotId={selectedPlotId}
        setSelectedPlotId={setSelectedPlotId}
        plots={plots}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Tab Content View */}
      <main style={{ minHeight: '650px' }}>
        {activeTab === 'telemetry' && (
          <FieldTelemetry 
            activePlot={activePlot}
            onSimulateCondition={handleSimulateCondition}
            onOpenAgronomist={() => setActiveTab('advisory')}
          />
        )}

        {activeTab === 'advisory' && (
          <AgroBotAdvisory 
            activePlot={activePlot}
            currentLang={currentLang}
            initialQuery={prefilledQuery}
          />
        )}

        {activeTab === 'diagnostics' && (
          <DiseaseDiagnostics 
            onOpenReport={(sample) => setActiveModalSample(sample)}
            onOpenAgronomist={handleOpenAgronomistWithContext}
          />
        )}

        {activeTab === 'climate' && (
          <ClimateForecast 
            activePlot={activePlot}
          />
        )}

        {activeTab === 'market' && (
          <MarketHub 
            activePlot={activePlot}
          />
        )}

        {activeTab === 'spatial' && (
          <SpatialFarmMap 
            activePlot={activePlot}
            setSelectedPlotId={setSelectedPlotId}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '2rem', padding: '1.5rem 0', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <div>
          🌱 <strong>AgroBridge AI</strong> • Agriculture & Climate Resilience Engine for Smallholder Farmers
        </div>
        <div>
          LoRaWAN Telemetry Protocol • Web Speech Synthesis • Computer Vision Pathogen AI
        </div>
      </footer>

      {/* Printable Diagnostic Report Modal */}
      {activeModalSample && (
        <DiagnosticModal 
          sample={activeModalSample}
          activePlot={activePlot}
          onClose={() => setActiveModalSample(null)}
        />
      )}

    </div>
  );
}
