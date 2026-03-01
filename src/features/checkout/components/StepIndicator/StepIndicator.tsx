import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
    {steps.map((label, i) => (
      <React.Fragment key={label}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: i <= currentStep ? 'var(--primary, #6c3ce1)' : '#94a3b8',
            fontWeight: i === currentStep ? 600 : 400,
          }}
        >
          <span
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: i < currentStep ? 'var(--primary, #6c3ce1)' : i === currentStep ? 'var(--primary, #6c3ce1)' : '#e2e8f0',
              color: i <= currentStep ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
          >
            {i < currentStep ? '✓' : i + 1}
          </span>
          <span style={{ fontSize: '0.875rem' }}>{label}</span>
        </div>
        {i < steps.length - 1 && (
          <div
            style={{
              flex: 1,
              height: '2px',
              background: i < currentStep ? 'var(--primary, #6c3ce1)' : '#e2e8f0',
              borderRadius: '1px',
            }}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);
