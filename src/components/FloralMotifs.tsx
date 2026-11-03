import React from 'react';

/**
 * Botanical Flower Motifs faithful to Image 1.png
 * Features:
 * - Dusty pink ruffled peonies / carnations
 * - Periwinkle blue asters & cornflowers with fine radiating petals
 * - Coral-red drooping bellflowers
 * - Sage green leaves, stems, and golden wildflower buds
 */

export const TopLeftFloral: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none z-10 ${className}`}>
    <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 200 200" fill="none">
      {/* Background soft stem vine */}
      <path
        d="M10 15 C 35 45, 60 75, 110 95 C 135 105, 160 110, 185 112"
        stroke="#4B7059"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M60 75 C 75 55, 95 40, 120 30"
        stroke="#5C856C"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M35 45 C 45 30, 60 20, 80 18"
        stroke="#5C856C"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Wild Daisy / Aster (Periwinkle Blue) - Far Top Left (x:38, y:40) */}
      <g transform="translate(38, 40)">
        {/* 12 radiating petals */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-18"
            rx="4.5"
            ry="11"
            transform={`rotate(${angle})`}
            fill="#A7BFD2"
            fillOpacity="0.85"
            stroke="#6B8DA3"
            strokeWidth="0.75"
          />
        ))}
        {/* Inner disc */}
        <circle cx="0" cy="0" r="8" fill="#F4DE9B" stroke="#D1A748" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="4.5" fill="#E28956" />
        {/* Fine petal details */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="0"
            y1="-8"
            x2="0"
            y2="-22"
            transform={`rotate(${angle})`}
            stroke="#5A7D94"
            strokeWidth="0.6"
            strokeOpacity="0.7"
          />
        ))}
      </g>

      {/* Coral Drooping Bellflower (x:65, y:85) */}
      <g transform="translate(65, 85) rotate(-20)">
        <path d="M0 -15 C 2 -5, 5 0, 8 10" stroke="#4B7059" strokeWidth="1.2" />
        {/* Bell cup */}
        <path
          d="M2 5 C -8 10, -12 25, -6 32 C -2 35, 10 35, 16 30 C 20 22, 16 10, 8 5 Z"
          fill="#EB9F9F"
          fillOpacity="0.85"
          stroke="#C86E6E"
          strokeWidth="0.8"
        />
        {/* Flared scalloped petals at bottom */}
        <path
          d="M-6 32 C -4 36, 0 37, 4 34 C 7 37, 12 36, 16 30"
          fill="#F7C8C8"
          stroke="#C86E6E"
          strokeWidth="0.8"
        />
        {/* Stamen */}
        <line x1="5" y1="28" x2="6" y2="40" stroke="#C5A880" strokeWidth="1" />
        <circle cx="6" cy="40" r="1.5" fill="#D4AF37" />
      </g>

      {/* Ruffled Pink Carnation / Peony (x:115, y:52) */}
      <g transform="translate(115, 52)">
        {/* Green calyx base */}
        <path d="M-6 8 C -4 16, 4 16, 6 8 C 8 4, -8 4, -6 8 Z" fill="#5C856C" stroke="#3C5C48" strokeWidth="0.75" />
        {/* Outer ruffled petals */}
        <path
          d="M-18 -2 C -24 -12, -14 -24, -4 -22 C 2 -30, 16 -28, 20 -18 C 28 -14, 26 -2, 18 4 C 12 8, -12 8, -18 -2 Z"
          fill="#F5BABA"
          fillOpacity="0.85"
          stroke="#D47E86"
          strokeWidth="0.8"
        />
        {/* Inner ruffled layer */}
        <path
          d="M-12 -6 C -16 -14, -8 -20, 0 -17 C 6 -22, 14 -18, 14 -10 C 18 -6, 14 0, 8 3 C 2 5, -8 4, -12 -6 Z"
          fill="#FAD1D1"
          stroke="#D47E86"
          strokeWidth="0.75"
        />
        {/* Center folds */}
        <path
          d="M-6 -8 C -4 -13, 2 -14, 6 -10 C 8 -7, 4 -3, -1 -3 C -5 -3, -6 -6, -6 -8 Z"
          fill="#E58B93"
          stroke="#B55760"
          strokeWidth="0.6"
        />
      </g>

      {/* Sage Green Leaves */}
      <g transform="translate(48, 65) rotate(40)">
        <path d="M0 0 C 8 -12, 22 -14, 28 0 C 18 8, 8 6, 0 0 Z" fill="#88A892" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
        <line x1="0" y1="0" x2="24" y2="-5" stroke="#3D5945" strokeWidth="0.6" />
      </g>
      <g transform="translate(85, 38) rotate(-30)">
        <path d="M0 0 C 7 -10, 18 -10, 24 0 C 15 7, 7 5, 0 0 Z" fill="#88A892" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
        <line x1="0" y1="0" x2="20" y2="-4" stroke="#3D5945" strokeWidth="0.6" />
      </g>
      <g transform="translate(142, 70) rotate(15)">
        <path d="M0 0 C 6 -8, 16 -8, 20 0 C 13 6, 6 4, 0 0 Z" fill="#99B8A3" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
      </g>

      {/* Tiny Golden Buds */}
      <circle cx="95" cy="80" r="3" fill="#D4AF37" fillOpacity="0.85" stroke="#A8821B" strokeWidth="0.5" />
      <circle cx="150" cy="100" r="2.5" fill="#D4AF37" fillOpacity="0.85" stroke="#A8821B" strokeWidth="0.5" />
      <circle cx="165" cy="95" r="2" fill="#E8B2B5" />
    </svg>
  </div>
);

export const TopRightFloral: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none z-10 ${className}`}>
    <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 200 200" fill="none">
      {/* Background stem vine arching from top right */}
      <path
        d="M190 15 C 165 45, 140 75, 90 95 C 65 105, 40 110, 15 112"
        stroke="#4B7059"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M140 75 C 125 55, 105 40, 80 30"
        stroke="#5C856C"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Ruffled Pink Carnation / Peony - Top Right (x:155, y:45) */}
      <g transform="translate(155, 45)">
        <path d="M-6 8 C -4 16, 4 16, 6 8 C 8 4, -8 4, -6 8 Z" fill="#5C856C" stroke="#3C5C48" strokeWidth="0.75" />
        <path
          d="M-20 -2 C -26 -14, -14 -26, -4 -24 C 2 -32, 18 -30, 22 -20 C 30 -16, 28 -4, 20 4 C 12 9, -14 9, -20 -2 Z"
          fill="#F5BABA"
          fillOpacity="0.88"
          stroke="#D47E86"
          strokeWidth="0.85"
        />
        <path
          d="M-14 -6 C -18 -15, -9 -22, 0 -19 C 7 -24, 16 -20, 16 -11 C 20 -7, 16 0, 9 3 C 2 5, -9 4, -14 -6 Z"
          fill="#FAD1D1"
          stroke="#D47E86"
          strokeWidth="0.75"
        />
        <path
          d="M-7 -9 C -5 -14, 2 -15, 7 -11 C 9 -8, 5 -4, -1 -4 C -5 -4, -7 -7, -7 -9 Z"
          fill="#E58B93"
          stroke="#B55760"
          strokeWidth="0.6"
        />
      </g>

      {/* Blue Wildflower Blossom (x:95, y:40) */}
      <g transform="translate(95, 40)">
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-15"
            rx="4"
            ry="9"
            transform={`rotate(${angle})`}
            fill="#A7BFD2"
            fillOpacity="0.85"
            stroke="#6B8DA3"
            strokeWidth="0.75"
          />
        ))}
        <circle cx="0" cy="0" r="6.5" fill="#F4DE9B" stroke="#D1A748" strokeWidth="0.7" />
        <circle cx="0" cy="0" r="3.5" fill="#E28956" />
      </g>

      {/* Second Soft Pink Peony Bud (x:135, y:95) */}
      <g transform="translate(135, 95)">
        <path
          d="M-10 0 C -15 -8, -6 -16, 0 -14 C 5 -18, 12 -15, 12 -8 C 16 -4, 12 3, 5 4 C 0 5, -8 4, -10 0 Z"
          fill="#F8C9CF"
          fillOpacity="0.9"
          stroke="#D47E86"
          strokeWidth="0.75"
        />
        <circle cx="0" cy="-6" r="4" fill="#E58B93" />
      </g>

      {/* Drooping Bellflower (x:70, y:80) */}
      <g transform="translate(70, 80) rotate(25)">
        <path
          d="M2 5 C -7 9, -10 22, -5 28 C -1 31, 9 31, 14 26 C 18 19, 14 9, 7 5 Z"
          fill="#EB9F9F"
          fillOpacity="0.85"
          stroke="#C86E6E"
          strokeWidth="0.75"
        />
        <line x1="4" y1="25" x2="5" y2="35" stroke="#C5A880" strokeWidth="0.9" />
        <circle cx="5" cy="35" r="1.3" fill="#D4AF37" />
      </g>

      {/* Leaves & Buds */}
      <g transform="translate(110, 68) rotate(-45)">
        <path d="M0 0 C 7 -11, 20 -12, 26 0 C 17 8, 7 6, 0 0 Z" fill="#88A892" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
        <line x1="0" y1="0" x2="22" y2="-5" stroke="#3D5945" strokeWidth="0.6" />
      </g>
      <g transform="translate(160, 80) rotate(30)">
        <path d="M0 0 C 6 -9, 17 -9, 22 0 C 14 6, 6 5, 0 0 Z" fill="#99B8A3" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
      </g>

      {/* Golden sprigs */}
      <circle cx="50" cy="100" r="3" fill="#D4AF37" fillOpacity="0.85" stroke="#A8821B" strokeWidth="0.5" />
      <circle cx="35" cy="108" r="2.2" fill="#D4AF37" fillOpacity="0.85" />
      <circle cx="80" cy="115" r="2.5" fill="#E8B2B5" />
    </svg>
  </div>
);

export const BottomLeftFloral: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none z-10 ${className}`}>
    <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 200 200" fill="none">
      {/* Tall Stem climbing upwards */}
      <path
        d="M20 185 C 35 150, 48 110, 75 75 C 90 55, 110 40, 130 25"
        stroke="#4B7059"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M48 110 C 65 100, 85 95, 110 90"
        stroke="#5C856C"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Large Blue Aster / Chrysanthemum at bottom (x:45, y:145) */}
      <g transform="translate(45, 145)">
        {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((angle, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-20"
            rx="3.5"
            ry="12"
            transform={`rotate(${angle})`}
            fill="#9FB7CA"
            fillOpacity="0.85"
            stroke="#65869E"
            strokeWidth="0.7"
          />
        ))}
        {/* Core */}
        <circle cx="0" cy="0" r="8.5" fill="#F4DE9B" stroke="#D1A748" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="4.5" fill="#D98048" />
      </g>

      {/* Pink Peony on stalk (x:85, y:85) */}
      <g transform="translate(85, 85)">
        <path
          d="M-15 -2 C -20 -10, -11 -20, -2 -18 C 2 -25, 14 -23, 17 -15 C 23 -12, 21 -2, 14 3 C 8 7, -10 7, -15 -2 Z"
          fill="#F5BABA"
          fillOpacity="0.88"
          stroke="#D47E86"
          strokeWidth="0.8"
        />
        <path
          d="M-10 -5 C -14 -12, -6 -18, 0 -15 C 5 -19, 12 -16, 12 -9 C 15 -6, 12 0, 7 2 C 2 4, -6 3, -10 -5 Z"
          fill="#FAD1D1"
          stroke="#D47E86"
          strokeWidth="0.7"
        />
        <circle cx="0" cy="-6" r="3.5" fill="#E58B93" />
      </g>

      {/* Bellflower (x:35, y:80) */}
      <g transform="translate(35, 80) rotate(-15)">
        <path
          d="M2 5 C -7 9, -10 22, -5 28 C -1 31, 9 31, 14 26 C 18 19, 14 9, 7 5 Z"
          fill="#EB9F9F"
          fillOpacity="0.85"
          stroke="#C86E6E"
          strokeWidth="0.75"
        />
        <line x1="4" y1="25" x2="5" y2="35" stroke="#C5A880" strokeWidth="0.9" />
        <circle cx="5" cy="35" r="1.3" fill="#D4AF37" />
      </g>

      {/* Leaves & Buds climbing */}
      <g transform="translate(60, 125) rotate(25)">
        <path d="M0 0 C 8 -12, 22 -14, 28 0 C 18 8, 8 6, 0 0 Z" fill="#88A892" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
        <line x1="0" y1="0" x2="24" y2="-5" stroke="#3D5945" strokeWidth="0.6" />
      </g>
      <g transform="translate(80, 50) rotate(-40)">
        <path d="M0 0 C 6 -9, 18 -10, 24 0 C 15 6, 6 5, 0 0 Z" fill="#99B8A3" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
      </g>

      {/* Wild golden dots */}
      <circle cx="115" cy="50" r="3" fill="#D4AF37" fillOpacity="0.85" />
      <circle cx="125" cy="40" r="2.2" fill="#D4AF37" fillOpacity="0.85" />
      <circle cx="65" cy="60" r="2.5" fill="#E8B2B5" />
    </svg>
  </div>
);

export const BottomRightFloral: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none select-none z-10 ${className}`}>
    <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 200 200" fill="none">
      {/* Tall Stem climbing upwards */}
      <path
        d="M180 185 C 165 150, 152 110, 125 75 C 110 55, 90 40, 70 25"
        stroke="#4B7059"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M152 110 C 135 100, 115 95, 90 90"
        stroke="#5C856C"
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Intricate Radiating Blue Chrysanthemum at bottom right (Matching Image 1 exact artwork!) */}
      <g transform="translate(155, 145)">
        {[
          0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345
        ].map((angle, i) => (
          <path
            key={i}
            d="M0 0 L-2.5 -22 L0 -26 L2.5 -22 Z"
            transform={`rotate(${angle})`}
            fill="#9FB7CA"
            fillOpacity="0.88"
            stroke="#65869E"
            strokeWidth="0.65"
          />
        ))}
        {/* Fine internal ray lines */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1="0"
            y1="-6"
            x2="0"
            y2="-24"
            transform={`rotate(${angle})`}
            stroke="#4D7089"
            strokeWidth="0.6"
          />
        ))}
        <circle cx="0" cy="0" r="7.5" fill="#F4DE9B" stroke="#D1A748" strokeWidth="0.75" />
        <circle cx="0" cy="0" r="4" fill="#D98048" />
      </g>

      {/* Pink Ruffled Carnation (x:110, y:80) */}
      <g transform="translate(110, 80)">
        <path
          d="M-16 -2 C -22 -11, -12 -22, -3 -20 C 2 -27, 16 -25, 19 -16 C 26 -13, 24 -2, 16 3 C 10 7, -11 7, -16 -2 Z"
          fill="#F5BABA"
          fillOpacity="0.88"
          stroke="#D47E86"
          strokeWidth="0.8"
        />
        <path
          d="M-11 -5 C -15 -13, -7 -19, 0 -16 C 6 -21, 14 -18, 14 -10 C 17 -7, 14 0, 8 2 C 2 4, -7 3, -11 -5 Z"
          fill="#FAD1D1"
          stroke="#D47E86"
          strokeWidth="0.7"
        />
        <circle cx="0" cy="-6" r="3.5" fill="#E58B93" />
      </g>

      {/* Soft Bellflower on side (x:160, y:90) */}
      <g transform="translate(160, 90) rotate(20)">
        <path
          d="M2 5 C -7 9, -10 22, -5 28 C -1 31, 9 31, 14 26 C 18 19, 14 9, 7 5 Z"
          fill="#EB9F9F"
          fillOpacity="0.85"
          stroke="#C86E6E"
          strokeWidth="0.75"
        />
        <line x1="4" y1="25" x2="5" y2="35" stroke="#C5A880" strokeWidth="0.9" />
        <circle cx="5" cy="35" r="1.3" fill="#D4AF37" />
      </g>

      {/* Leaves & Foliage */}
      <g transform="translate(140, 125) rotate(-25)">
        <path d="M0 0 C 8 -12, 22 -14, 28 0 C 18 8, 8 6, 0 0 Z" fill="#88A892" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
        <line x1="0" y1="0" x2="24" y2="-5" stroke="#3D5945" strokeWidth="0.6" />
      </g>
      <g transform="translate(120, 50) rotate(40)">
        <path d="M0 0 C 6 -9, 18 -10, 24 0 C 15 6, 6 5, 0 0 Z" fill="#99B8A3" fillOpacity="0.8" stroke="#486852" strokeWidth="0.7" />
      </g>

      {/* Wild Golden buds */}
      <circle cx="85" cy="50" r="3" fill="#D4AF37" fillOpacity="0.85" />
      <circle cx="75" cy="40" r="2.2" fill="#D4AF37" fillOpacity="0.85" />
      <circle cx="130" cy="65" r="2.5" fill="#E8B2B5" />
    </svg>
  </div>
);

/**
 * Corner Bouquet Accents specifically for framing the invitation card corners
 */
export const FloralCornerWreath: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden rounded-3xl">
    {/* Corner overlays with high visibility */}
    <TopLeftFloral className="absolute -top-1 -left-1 w-44 h-44 sm:w-48 sm:h-48" />
    <TopRightFloral className="absolute -top-1 -right-1 w-44 h-44 sm:w-48 sm:h-48" />
    <BottomLeftFloral className="absolute -bottom-1 -left-1 w-44 h-48 sm:w-48 sm:h-52" />
    <BottomRightFloral className="absolute -bottom-1 -right-1 w-44 h-48 sm:w-48 sm:h-52" />
  </div>
);
