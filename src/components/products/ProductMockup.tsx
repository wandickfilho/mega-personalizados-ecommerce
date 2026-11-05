import type { ProductMockup as MockupVariant, ProductTone } from '@/data/personalizedProducts';

interface Palette {
  base: string;
  ink: string;
  soft: string;
  accent: string;
  line: string;
}

const PALETTES: Record<ProductTone, Palette> = {
  navy: {
    base: '#0B1743',
    ink: '#F5F7FB',
    soft: '#1537A0',
    accent: '#E32636',
    line: 'rgba(245,247,251,0.22)',
  },
  royal: {
    base: '#1537A0',
    ink: '#FFFFFF',
    soft: '#F5F7FB',
    accent: '#E32636',
    line: 'rgba(255,255,255,0.24)',
  },
  red: {
    base: '#E32636',
    ink: '#FFFFFF',
    soft: '#F5F7FB',
    accent: '#0B1743',
    line: 'rgba(255,255,255,0.28)',
  },
  ice: {
    base: '#DCE6F7',
    ink: '#0B1743',
    soft: '#FFFFFF',
    accent: '#E32636',
    line: 'rgba(11,23,67,0.14)',
  },
  white: {
    base: '#FFFFFF',
    ink: '#0B1743',
    soft: '#EEF2F9',
    accent: '#1537A0',
    line: 'rgba(11,23,67,0.12)',
  },
};

interface ProductMockupProps {
  variant: MockupVariant;
  tone?: ProductTone;
  label?: string;
  className?: string;
}

function shortLabel(label: string, max = 14) {
  const clean = label.trim();
  if (!clean) return 'SUA ARTE';
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export default function ProductMockup({
  variant,
  tone = 'navy',
  label = 'Sua arte',
  className,
}: ProductMockupProps) {
  const c = PALETTES[tone];
  const text = shortLabel(label).toUpperCase();

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden
      focusable="false"
      role="presentation"
    >
      <ellipse cx="100" cy="171" rx="48" ry="7" fill="#0B1743" opacity="0.12" />
      {variant === 'mug' && (
        <g>
          <path
            d="M56 68h76v82a24 24 0 0 1-24 24H80a24 24 0 0 1-24-24Z"
            fill={c.base}
          />
          <path
            d="M132 90h8a22 22 0 0 1 0 44h-8"
            fill="none"
            stroke={c.base}
            strokeWidth="13"
          />
          <rect x="65" y="90" width="58" height="44" rx="6" fill={c.soft} />
          <text
            x="94"
            y="117"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="10"
            fontWeight="800"
            letterSpacing="-0.3"
          >
            {text}
          </text>
          <path d="M65 148h58" stroke={c.accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M75 61h38" stroke={c.line} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {variant === 'phone-case' && (
        <g>
          <rect x="60" y="30" width="80" height="140" rx="22" fill={c.base} />
          <rect x="68" y="38" width="64" height="124" rx="16" fill={c.soft} opacity="0.2" />
          <rect x="76" y="49" width="32" height="26" rx="8" fill={c.accent} />
          <circle cx="85" cy="58" r="4" fill={c.base} />
          <circle cx="99" cy="58" r="4" fill={c.base} />
          <rect x="76" y="96" width="48" height="34" rx="8" fill={c.soft} />
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="8"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
          <path d="M100 143h18" stroke={c.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {variant === 'tablet-case' && (
        <g transform="rotate(-5 100 100)">
          <rect x="46" y="40" width="108" height="124" rx="18" fill={c.base} />
          <rect x="54" y="48" width="92" height="108" rx="12" fill={c.soft} opacity="0.18" />
          <path d="M100 48v108" stroke={c.line} strokeWidth="2" />
          <rect x="68" y="78" width="64" height="42" rx="8" fill={c.soft} />
          <text
            x="100"
            y="104"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="9"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
          <circle cx="100" cy="135" r="5" fill={c.accent} />
        </g>
      )}

      {variant === 'keychain' && (
        <g>
          <circle cx="100" cy="49" r="12" fill="none" stroke={c.accent} strokeWidth="6" />
          <path d="M100 61v14" stroke={c.accent} strokeWidth="5" strokeLinecap="round" />
          <rect x="68" y="75" width="64" height="78" rx="20" fill={c.base} />
          <circle cx="100" cy="109" r="24" fill={c.soft} />
          <text
            x="100"
            y="112"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="9"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
          <path d="M84 137h32" stroke={c.accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {variant === 'cap' && (
        <g>
          <path d="M48 116a52 52 0 0 1 104 0v8H48Z" fill={c.base} />
          <path
            d="M48 124h104c17 0 29 8 29 17H78c-18 0-30-7-30-17Z"
            fill={c.accent}
          />
          <path d="M100 64v48" stroke={c.line} strokeWidth="2" />
          <rect x="84" y="92" width="32" height="24" rx="6" fill={c.soft} />
          <text
            x="100"
            y="108"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="7"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
          <circle cx="100" cy="69" r="4" fill={c.accent} />
        </g>
      )}

      {variant === 'pouch' && (
        <g>
          <path
            d="M70 78V70a30 30 0 0 1 60 0v8"
            fill="none"
            stroke={c.accent}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="46" y="76" width="108" height="76" rx="24" fill={c.base} />
          <path d="M58 100h84" stroke={c.line} strokeWidth="3" strokeLinecap="round" />
          <rect x="62" y="108" width="76" height="28" rx="8" fill={c.soft} />
          <text
            x="100"
            y="126"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="8"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
          <circle cx="131" cy="96" r="4" fill={c.accent} />
        </g>
      )}

      {variant === 'gift' && (
        <g>
          <rect x="56" y="82" width="88" height="72" rx="10" fill={c.base} />
          <rect x="50" y="70" width="100" height="22" rx="6" fill={c.accent} />
          <rect x="94" y="70" width="12" height="84" fill={c.accent} />
          <path d="M100 70c-10-18-26-12-24 0 2 10 14 10 24 0Z" fill={c.accent} />
          <path d="M100 70c10-18 26-12 24 0-2 10-14 10-24 0Z" fill={c.accent} />
          <rect x="70" y="102" width="60" height="26" rx="6" fill={c.soft} />
          <text
            x="100"
            y="119"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="8"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
        </g>
      )}

      {variant === 'kit' && (
        <g>
          <rect x="38" y="96" width="64" height="52" rx="10" fill={c.base} />
          <rect x="98" y="78" width="62" height="70" rx="10" fill={c.accent} opacity="0.92" />
          <rect x="78" y="55" width="58" height="44" rx="8" fill={c.soft} />
          <text
            x="107"
            y="79"
            textAnchor="middle"
            fill={c.ink}
            fontFamily="Manrope, sans-serif"
            fontSize="7"
            fontWeight="800"
            letterSpacing="-0.2"
          >
            {text}
          </text>
          <path d="M48 112h42" stroke={c.line} strokeWidth="3" strokeLinecap="round" />
          <path d="M108 98h42" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
