import React from 'react';
import { useVoting } from '../context/VotingContext';

export const VotingDebugPage: React.FC = () => {
  const { isVotingClosed, statusSummary, constituencies, isLoading } = useVoting();
  
  const shouldShowResults = statusSummary ? statusSummary.closedConstituencies > 0 : false;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Voting Context Debug</h1>
      
      <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
        <h2>Loading State</h2>
        <p>isLoading: {String(isLoading)}</p>
      </div>
      
      <div style={{ background: '#f0f8ff', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
        <h2>Global Status</h2>
        <p>isVotingClosed: {String(isVotingClosed)}</p>
        <p>shouldShowResults: {String(shouldShowResults)}</p>
      </div>
      
      <div style={{ background: '#f0fff0', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
        <h2>Status Summary</h2>
        {statusSummary ? (
          <pre>{JSON.stringify(statusSummary, null, 2)}</pre>
        ) : (
          <p style={{ color: 'red' }}>❌ No status summary available</p>
        )}
      </div>
      
      <div style={{ background: '#fff8f0', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
        <h2>Constituencies ({constituencies.length})</h2>
        {constituencies.length > 0 ? (
          <pre>{JSON.stringify(constituencies.slice(0, 3), null, 2)}</pre>
        ) : (
          <p style={{ color: 'orange' }}>⚠️  No constituency data</p>
        )}
        {constituencies.length > 3 && <p>... and {constituencies.length - 3} more</p>}
      </div>
      
      <div style={{ background: shouldShowResults ? '#e8f5e8' : '#ffe8e8', padding: '15px', borderRadius: '8px' }}>
        <h2>Result Logic</h2>
        <p><strong>Expression:</strong> statusSummary?.closedConstituencies &gt; 0</p>
        <p><strong>Breakdown:</strong></p>
        <ul>
          <li>statusSummary exists: {String(!!statusSummary)}</li>
          <li>closedConstituencies: {statusSummary?.closedConstituencies ?? 'undefined'}</li>
          <li>closedConstituencies &gt; 0: {String(statusSummary ? statusSummary.closedConstituencies > 0 : false)}</li>
          <li><strong>Final shouldShowResults: {String(shouldShowResults)}</strong></li>
        </ul>
        <div style={{ background: 'white', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
          {shouldShowResults ? (
            <p style={{ color: 'green' }}>✅ SHOULD SHOW RESULTS</p>
          ) : (
            <p style={{ color: 'red' }}>❌ SHOULD SHOW "ELECTION OPEN" MESSAGE</p>
          )}
        </div>
      </div>
    </div>
  );
};