import React from 'react';

interface FallingPetalsProps {
  enabled: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({ enabled }) => {
  if (!enabled) return null;

  const petals = [
    { left: '8%', width: '11px', height: '15px', duration: '10s', delay: '0s', bg: 'bg-[#E8B2B5]/50 dark:bg-[#E8B2B5]/30' },
    { left: '24%', width: '8px', height: '12px', duration: '13s', delay: '2.5s', bg: 'bg-[#9BB4C7]/50 dark:bg-[#9BB4C7]/30' },
    { left: '42%', width: '10px', height: '14px', duration: '11.5s', delay: '5s', bg: 'bg-[#C5A880]/45 dark:bg-[#C5A880]/30' },
    { left: '60%', width: '12px', height: '16px', duration: '12s', delay: '1.2s', bg: 'bg-[#E8B2B5]/60 dark:bg-[#E8B2B5]/35' },
    { left: '76%', width: '9px', height: '13px', duration: '14s', delay: '3.8s', bg: 'bg-[#3C735B]/30 dark:bg-[#3C735B]/20' },
    { left: '88%', width: '11px', height: '15px', duration: '15s', delay: '6.5s', bg: 'bg-[#C5A880]/40 dark:bg-[#C5A880]/25' },
  ];

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((p, idx) => (
        <div
          key={idx}
          className={`petal-item ${p.bg}`}
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
