export type DeviceModel = 'iPhone' | 'Samsung Galaxy' | 'Motorola' | string;

const CASE_TONES: Record<string, { base: string; edge: string; ink: string }> = {
  navy: { base: '#0b1743', edge: '#1d2f67', ink: '#f5f7fb' },
  royal: { base: '#1537a0', edge: '#2b52c7', ink: '#ffffff' },
  red: { base: '#e32636', edge: '#bd1728', ink: '#ffffff' },
  ice: { base: '#dce6f7', edge: '#b9c9e4', ink: '#0b1743' },
  white: { base: '#ffffff', edge: '#dbe3f1', ink: '#0b1743' },
};

export function PhoneCase2D({ model = 'iPhone', tone = 'navy', children }: { model?: DeviceModel; tone?: string; children?: React.ReactNode }) {
  const palette = CASE_TONES[tone] ?? CASE_TONES.navy;
  const isSamsung = model === 'Samsung Galaxy';
  const isMotorola = model === 'Motorola';
  const cameraX = isSamsung ? 26 : isMotorola ? 28 : 30;
  const cameraY = isSamsung ? 18 : 20;
  return <div className={`device-phone-case device-phone-${isSamsung ? 'samsung' : isMotorola ? 'motorola' : 'iphone'}`}>
    <svg viewBox="0 0 200 380" className="device-phone-body" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`case-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.edge} /><stop offset="0.55" stopColor={palette.base} /><stop offset="1" stopColor={palette.edge} />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="192" height="372" rx="36" fill={`url(#case-${tone})`} stroke={palette.edge} strokeWidth="2" />
      <rect x="11" y="11" width="178" height="358" rx="30" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1.4" />
      <rect x="88" y="374" width="24" height="2" rx="1" fill="rgba(255,255,255,.28)" />
      <path d="M4 82h-3M4 118h-3M200 82h3M200 118h3" stroke={palette.edge} strokeWidth="4" strokeLinecap="round" />
      <text x="100" y="365" textAnchor="middle" fill={palette.ink} opacity="0.4" fontSize="7" fontFamily="Manrope, sans-serif" fontWeight="800" letterSpacing="2">MEGA</text>
    </svg>
    {children}
    <svg viewBox="0 0 200 380" className="device-phone-cameras" aria-hidden="true" focusable="false">
      {isSamsung ? <g>
        <rect x={cameraX - 12} y={cameraY - 2} width="22" height="62" rx="11" fill="#1c2433" stroke="#354466" strokeWidth="1.5" />
        {[12, 30, 48].map((offset) => <g key={offset}><circle cx={cameraX - 1} cy={cameraY + offset} r="7" fill="#0b0f18" /><circle cx={cameraX - 1} cy={cameraY + offset} r="3.2" fill="#3b4b6b" /></g>)}
        <circle cx={cameraX - 1} cy={cameraY + 60} r="2.2" fill="#f4d06f" />
      </g> : isMotorola ? <g>
        <rect x={cameraX - 14} y={cameraY - 2} width="30" height="44" rx="10" fill="#1b2330" stroke="#354466" strokeWidth="1.5" />
        <circle cx={cameraX - 5} cy={cameraY + 10} r="6" fill="#090d15" /><circle cx={cameraX - 5} cy={cameraY + 10} r="2.6" fill="#41527a" />
        <circle cx={cameraX + 6} cy={cameraY + 12} r="5.6" fill="#090d15" /><circle cx={cameraX + 6} cy={cameraY + 12} r="2.4" fill="#41527a" />
        <circle cx={cameraX - 5} cy={cameraY + 30} r="6" fill="#090d15" /><circle cx={cameraX - 5} cy={cameraY + 30} r="2.6" fill="#41527a" />
        <circle cx={cameraX + 9} cy={cameraY + 31} r="2.6" fill="#f4d06f" />
      </g> : <g>
        <rect x={cameraX - 14} y={cameraY - 2} width="36" height="38" rx="11" fill="#1b2330" stroke="#354466" strokeWidth="1.5" />
        <circle cx={cameraX - 4} cy={cameraY + 9} r="6.4" fill="#090d15" /><circle cx={cameraX - 4} cy={cameraY + 9} r="2.8" fill="#41527a" />
        <circle cx={cameraX + 7} cy={cameraY + 9} r="6.4" fill="#090d15" /><circle cx={cameraX + 7} cy={cameraY + 9} r="2.8" fill="#41527a" />
        <circle cx={cameraX - 4} cy={cameraY + 28} r="6.4" fill="#090d15" /><circle cx={cameraX - 4} cy={cameraY + 28} r="2.8" fill="#41527a" />
        <circle cx={cameraX + 9} cy={cameraY + 28} r="2.8" fill="#f4d06f" />
      </g>}
    </svg>
  </div>;
}

export function Mousepad2D({ tone = 'navy', children }: { tone?: string; children?: React.ReactNode }) {
  const palette = CASE_TONES[tone] ?? CASE_TONES.navy;
  return <div className="device-mousepad">
    <svg viewBox="0 0 400 240" className="device-mousepad-body" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`pad-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.edge} /><stop offset="0.5" stopColor={palette.base} /><stop offset="1" stopColor="#06183e" />
        </linearGradient>
        <pattern id="pad-weave" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7 7 0" stroke="rgba(255,255,255,.045)" strokeWidth="1" /></pattern>
      </defs>
      <rect x="3" y="3" width="394" height="234" rx="28" fill={`url(#pad-${tone})`} stroke={palette.edge} strokeWidth="3" />
      <rect x="9" y="9" width="382" height="222" rx="24" fill="url(#pad-weave)" />
      <rect x="18" y="18" width="364" height="204" rx="18" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" strokeDasharray="6 5" />
    </svg>
    {children}
  </div>;
}
