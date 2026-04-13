import { useMemo, useState } from 'react';

/*
  DentalChart — matches user's PNG design exactly:

  ┌─────────────────────────────────────────────┐
  │  [+ missing teeth] [+ dental implant] [+ crowns/FDP]  │
  │  UPPER TEETH  (roots up, grey crown at bottom)         │
  │  18│17│16│15│14│13│12│11 ║ 21│22│23│24│25│26│27│28   │  ← blue boxes
  │──────────────────────────────────────────────────────  │  ← dividing line
  │  48│47│46│45│44│43│42│41 ║ 31│32│33│34│35│36│37│38   │  ← blue boxes
  │  LOWER TEETH  (grey crown at top, roots down)          │
  └─────────────────────────────────────────────┘

  Action mode (set by buttons):
    'missing'  → clicking a tooth marks it missing
    'implant'  → clicking a tooth opens implant log
    'crown'    → clicking a tooth opens crown/FPD log
*/

/* ── LAYOUT ── */
const SLOT  = 52;
const GAP   = 18;
const LM    = 18;
const IMG_H = 188;
const NUM_H = 26;   // height of each number row

const PAD_TOP = 6;
const UY      = PAD_TOP;                  // upper image top
const NUM_U_Y = UY + IMG_H;              // upper number row top
const DIV_Y   = NUM_U_Y + NUM_H;         // dividing line / lower number row top
const NUM_L_Y = DIV_Y;                   // lower number row top
const LY      = NUM_L_Y + NUM_H;         // lower image top
const LEGEND_Y = LY + IMG_H + 10;

const W = SLOT * 16 + GAP + LM * 2;
const H = LEGEND_Y + 22;

/* Slot X */
function slotX(n) {
  const q = Math.floor(n / 10), u = n % 10;
  if (q === 1) return LM + (8 - u) * SLOT;
  if (q === 2) return LM + 8 * SLOT + GAP + (u - 1) * SLOT;
  if (q === 3) return LM + 8 * SLOT + GAP + (u - 1) * SLOT;
  if (q === 4) return LM + (8 - u) * SLOT;
  return 0;
}
const sCX  = n => slotX(n) + SLOT / 2;
const isUp = n => Math.floor(n / 10) <= 2;

const UPPER = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28];
const LOWER = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];

/* Crown/root split for implant */
const CROWN_H = Math.round(IMG_H * 0.40);
const ROOT_H  = IMG_H - CROWN_H;

/* Condition config */
const COND = {
  healthy:        { show: true,  tint: null,                    badge: null },
  missing:        { show: false, tint: null,                    badge: null },
  rootStump:      { show: true,  tint: 'rgba(160,100,50,0.42)', badge: 'RS' },
  grosslyDecayed: { show: true,  tint: 'rgba(80,55,35,0.44)',   badge: 'GD' },
  fractured:      { show: true,  tint: 'rgba(200,50,40,0.40)',  badge: 'F'  },
};

/* ── MAIN COMPONENT ── */
export default function DentalChart({
  implants        = [],
  fpdRecords      = [],
  toothConditions = {},
  onMarkMissing,
  onImplantLog,
  onCrownLog,
  selectedTeeth   = [],
  onToothToggle,
  mode            = 'view',     // 'view' | 'fpd'
}) {
  const [actionMode, setActionMode] = useState(null); // 'missing'|'implant'|'crown'|null
  const [hov, setHov] = useState(null);

  const impMap = useMemo(() => {
    const m = {};
    implants.forEach(i => { m[i.tooth_number] = i; });
    return m;
  }, [implants]);

  const fpdMap = useMemo(() => {
    const m = {};
    fpdRecords.forEach(f => { f.tooth_numbers?.forEach(n => { m[n] = f; }); });
    return m;
  }, [fpdRecords]);

  const handleToothClick = n => {
    if (mode === 'fpd') { onToothToggle?.(n); return; }
    if (actionMode === 'missing') { onMarkMissing?.(n); }
    else if (actionMode === 'implant') { onImplantLog?.(n); }
    else if (actionMode === 'crown') { onCrownLog?.(n); }
  };

  const toggleAction = key => setActionMode(prev => prev === key ? null : key);

  /* FPD bridge connector */
  const bridgeOverlays = fpdRecords
    .filter(f => f.tooth_numbers?.length > 1)
    .map((f, idx) => {
      const sorted = [...f.tooth_numbers].sort((a, b) => slotX(a) - slotX(b));
      const up = isUp(sorted[0]);
      const x1 = slotX(sorted[0]) + 2;
      const x2 = slotX(sorted[sorted.length - 1]) + SLOT - 2;
      const jY = up ? UY + ROOT_H : LY + CROWN_H;
      return (
        <rect key={idx} x={x1} y={jY - 3} width={x2 - x1} height={9}
          rx={4} fill="rgba(120,170,210,0.82)" stroke="#5B9BBD" strokeWidth={1}
          style={{ pointerEvents: 'none' }} />
      );
    });

  /* Render one tooth */
  const renderTooth = n => {
    const up   = isUp(n);
    const sx   = slotX(n);
    const scx  = sCX(n);
    const imgY = up ? UY : LY;

    const imp       = impMap[n];
    const fpd       = fpdMap[n];
    const tc        = toothConditions[n] || {};
    const condition = tc.condition || 'healthy';
    const cfg       = COND[condition] || COND.healthy;

    const isSel    = selectedTeeth.includes(n);
    const isHov    = hov === n;
    const hasImp   = !!imp;
    const hasCrown = !!(fpd || imp?.prosthetic_loading_date);
    const isMissing = condition === 'missing';

    /* Zone positions */
    const rootY  = up ? imgY           : imgY + CROWN_H;
    const crownY = up ? imgY + ROOT_H  : imgY;
    const rootW  = SLOT * 0.58;
    const rootX  = scx - rootW / 2;

    const implantSrc = up ? '/teeth/implant_upper.png' : '/teeth/implant_lower.png';
    const toothSrc   = `/teeth/tooth_${n}.png`;
    const crownSrc   = `/teeth/crown_${n}.png`;

    /* Number box colour */
    const numBg = hasImp  ? '#0369A1'
      : hasCrown ? '#4338CA'
      : isMissing ? '#6B7280'
      : '#1E40AF';

    /* Highlight ring when this tooth is active action target */
    const showRing = isHov && actionMode !== null && !isMissing;

    return (
      <g key={n}
        onClick={() => handleToothClick(n)}
        onMouseEnter={() => setHov(n)}
        onMouseLeave={() => setHov(null)}
        style={{ cursor: actionMode ? 'crosshair' : 'pointer' }}
        data-testid={`fdi-tooth-${n}`}
      >
        {/* Hover ring */}
        {showRing && (
          <rect x={sx + 1} y={imgY + 1} width={SLOT - 2} height={IMG_H - 2}
            rx={5} fill="none"
            stroke={
              actionMode === 'missing' ? '#EF4444'
              : actionMode === 'implant' ? '#0369A1'
              : '#16A34A'
            }
            strokeWidth={2}
          />
        )}
        {/* FPD selected ring */}
        {isSel && (
          <rect x={sx + 1} y={imgY + 1} width={SLOT - 2} height={IMG_H - 2}
            rx={5} fill="rgba(99,102,241,0.10)" stroke="#4338CA" strokeWidth={2} />
        )}

        {/* ── TOOTH IMAGE ── */}
        {isMissing ? (
          /* Empty ghost */
          <rect x={sx + 10} y={imgY + 12} width={SLOT - 20} height={IMG_H - 24}
            rx={5} fill="rgba(200,210,218,0.15)"
            stroke="rgba(150,165,178,0.28)" strokeWidth={1} strokeDasharray="3,3" />

        ) : hasImp ? (
          <>
            {/* Implant screw — root zone, platform snaps to crown junction */}
            <image href={implantSrc}
              x={rootX} y={rootY} width={rootW} height={ROOT_H}
              preserveAspectRatio={up ? 'xMidYMax meet' : 'xMidYMin meet'} />
            {/* Crown — crown zone */}
            {hasCrown && (
              <image href={crownSrc}
                x={sx + 2} y={crownY} width={SLOT - 4} height={CROWN_H}
                preserveAspectRatio={up ? 'xMidYMin meet' : 'xMidYMax meet'} />
            )}
            {!hasCrown && (
              <line x1={rootX} y1={up ? rootY + ROOT_H : rootY}
                x2={rootX + rootW} y2={up ? rootY + ROOT_H : rootY}
                stroke="#5B9BBD" strokeWidth={1.5} strokeDasharray="3,2"
                style={{ pointerEvents: 'none' }} />
            )}
          </>

        ) : hasCrown ? (
          <image href={crownSrc}
            x={sx + 2} y={crownY} width={SLOT - 4} height={CROWN_H}
            preserveAspectRatio={up ? 'xMidYMin meet' : 'xMidYMax meet'} />

        ) : (
          /* Natural tooth — crown anchored to number row */
          <>
            <image href={toothSrc}
              x={sx + 1} y={imgY} width={SLOT - 2} height={IMG_H}
              preserveAspectRatio={up ? 'xMidYMax meet' : 'xMidYMin meet'}
              opacity={cfg.show ? 1 : 0}
            />
            {cfg.tint && (
              <rect x={sx + 1} y={imgY} width={SLOT - 2} height={IMG_H}
                rx={4} fill={cfg.tint} opacity={0.55}
                style={{ pointerEvents: 'none' }} />
            )}
            {cfg.badge && (
              <text x={scx} y={imgY + IMG_H * 0.5 + 5}
                textAnchor="middle" fontSize={13} fontWeight="800"
                fill="#7C2D12" fontFamily="'IBM Plex Sans',sans-serif"
                style={{ userSelect: 'none', pointerEvents: 'none' }}>{cfg.badge}</text>
            )}
          </>
        )}

        {/* Number box */}
        {(() => {
          const ny = up ? NUM_U_Y : NUM_L_Y;
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={sx + 1} y={ny + 3} width={SLOT - 2} height={NUM_H - 6}
                rx={3} fill={numBg} />
              <text x={scx} y={ny + NUM_H - 9}
                textAnchor="middle" fontSize={9.5}
                fontFamily="'IBM Plex Mono',monospace"
                fill="#FFFFFF" fontWeight="600"
                style={{ userSelect: 'none' }}>{n}</text>
            </g>
          );
        })()}
      </g>
    );
  };

  /* Button style helper */
  const btnStyle = (key, color, activeColor) => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: `1.5px solid ${actionMode === key ? activeColor : color}`,
    background: actionMode === key ? activeColor : '#F9F9F8',
    color: actionMode === key ? '#fff' : color,
    fontWeight: 600,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: 'IBM Plex Sans, sans-serif',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E5E5E2', overflow: 'hidden' }}>
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, padding: '10px 14px 8px', borderBottom: '1px solid #F0EDE8', flexWrap: 'wrap' }}>
        <button
          data-testid="action-missing"
          style={btnStyle('missing', '#2563EB', '#2563EB')}
          onClick={() => toggleAction('missing')}
        >+ missing teeth</button>
        <button
          data-testid="action-implant"
          style={btnStyle('implant', '#64748B', '#475569')}
          onClick={() => toggleAction('implant')}
        >+ dental implant</button>
        <button
          data-testid="action-crown"
          style={btnStyle('crown', '#16A34A', '#16A34A')}
          onClick={() => toggleAction('crown')}
        >+ crowns/FDP</button>
        {actionMode && (
          <span style={{ fontSize: 11, color: '#9CA3AF', alignSelf: 'center', marginLeft: 4 }}>
            {actionMode === 'missing' && 'Click a tooth to mark as missing'}
            {actionMode === 'implant' && 'Click a tooth to log an implant'}
            {actionMode === 'crown'   && 'Click a tooth to log a crown / FPD'}
          </span>
        )}
      </div>

      {/* SVG chart */}
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', minWidth: 560 }}
          aria-label="FDI Dental Chart">

          <rect width={W} height={H} fill="#FFFFFF" />

          {/* Midline vertical */}
          <line x1={LM + 8 * SLOT + GAP / 2} y1={UY}
            x2={LM + 8 * SLOT + GAP / 2} y2={LY + IMG_H}
            stroke="#D0C8BC" strokeWidth={1} strokeDasharray="4,4" />

          {/* Horizontal dividing line between upper & lower number rows */}
          <line x1={LM} y1={DIV_Y} x2={W - LM} y2={DIV_Y}
            stroke="#C0B8A8" strokeWidth={1.5} />

          {/* FPD connectors */}
          {bridgeOverlays}

          {/* All 32 teeth */}
          {UPPER.map(renderTooth)}
          {LOWER.map(renderTooth)}

          {/* Legend */}
          {[
            { color: '#F5F3EE', border: '#C0B8A8', label: 'Healthy' },
            { color: '#4A5C62', border: '#2E3A3E', label: 'Implant' },
            { color: '#B8D4E8', border: '#5B9BBD', label: 'Crown/FPD' },
            { color: 'rgba(195,208,218,0.3)', border: 'rgba(150,165,178,0.45)', label: 'Missing', dashed: true },
          ].map(({ color, border, label, dashed }, i) => (
            <g key={label} transform={`translate(${LM + i * 138} ${LEGEND_Y})`}>
              <rect width={13} height={13} rx={3}
                fill={color} stroke={border} strokeWidth={1.2}
                strokeDasharray={dashed ? '2,2' : undefined} />
              <text x={19} y={11} fontSize={9} fill="#5C6370"
                fontFamily="'IBM Plex Sans',sans-serif">{label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
