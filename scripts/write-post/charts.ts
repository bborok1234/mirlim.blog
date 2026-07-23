/**
 * 정적 SVG 인포그래픽 생성기 — Post Compiler 전용.
 *
 * 목적: 가장 정보가치 높은 데이터를 일관된 정적 SVG로. 의존성 0(순수 문자열).
 * 각 차트 타입의 "디자인 문법"(스펙)만 채우면 DESIGN.md 팔레트로 렌더된다.
 *
 * 사용(파이프라인/CLI):
 *   bun run scripts/write-post/charts.ts <type> '<json-spec>'
 *   → stdout으로 인라인 SVG. 마크다운(.md)에 그대로 붙여넣으면 렌더된다.
 *
 * 타입: line | area | bar | hbar | grouped-bar | stacked-bar | donut | scatter | treemap | stat
 */

const C = {
	text: '#E8E8ED',
	muted: '#7E7E8A',
	border: '#1E1E22',
	surface: '#141416',
	accent: '#3B82F6',
	success: '#10B981',
	warning: '#F59E0B',
	error: '#EF4444',
	bg: '#0A0A0B',
	font: "'Instrument Sans', system-ui, sans-serif",
};
// 색 미지정 시 이 순서로 배정
const PALETTE = [C.accent, C.muted, C.success, C.warning, C.error];
const R = (n: number) => Math.round(n * 10) / 10;

const esc = (s: unknown) =>
	String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function wrap(w: number, h: number, body: string, ariaLabel: string): string {
	return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(ariaLabel)}" style="width:100%;max-width:${w}px;height:auto;display:block;margin:2.5em auto;font-family:${C.font}">\n${body}\n</svg>`;
}

function ticks(yMax: number, step = 4): number[] {
	const out: number[] = [];
	for (let i = 0; i <= step; i++) out.push(Math.round((yMax / step) * i));
	return out;
}

// ── line / area ───────────────────────────────────────
export interface LineSpec {
	type: 'line' | 'area';
	xTicks: string[];
	xAxisLabel?: string;
	yMax: number;
	yUnit?: string;
	series: { name: string; color?: string; dash?: boolean; area?: boolean; points: number[]; endLabel?: string }[];
	ariaLabel: string;
}
export function lineChart(s: LineSpec): string {
	const W = 640, H = 380, x0 = 60, x1 = 520, y0 = 330, yTop = 40;
	const n = s.xTicks.length;
	const px = (i: number) => Math.round(n === 1 ? (x0 + x1) / 2 : x0 + (i * (x1 - x0)) / (n - 1));
	const py = (v: number) => Math.round(y0 - (v / s.yMax) * (y0 - yTop));
	const areaMode = s.type === 'area';
	const parts: string[] = [];

	let lx = 60;
	parts.push('<g font-size="12.5">');
	s.series.forEach((ser, si) => {
		const col = ser.color ?? PALETTE[si % PALETTE.length];
		parts.push(`<line x1="${lx}" y1="14" x2="${lx + 24}" y2="14" stroke="${col}" stroke-width="2.5"${ser.dash ? ' stroke-dasharray="5 4"' : ''}/>`);
		parts.push(`<text x="${lx + 30}" y="18" fill="${C.text}">${esc(ser.name)}</text>`);
		lx += 30 + ser.name.length * 13 + 24;
	});
	parts.push('</g>');

	const ys = ticks(s.yMax);
	parts.push(`<g stroke="${C.border}" stroke-width="1">`);
	for (const v of ys) parts.push(`<line x1="${x0}" y1="${py(v)}" x2="${x1}" y2="${py(v)}"/>`);
	parts.push('</g>');
	parts.push(`<g fill="${C.muted}" font-size="12" text-anchor="end">`);
	for (const v of ys) parts.push(`<text x="${x0 - 8}" y="${py(v) + 4}">${v}${v === s.yMax ? esc(s.yUnit ?? '') : ''}</text>`);
	parts.push('</g>');

	parts.push(`<g fill="${C.muted}" font-size="12" text-anchor="middle">`);
	s.xTicks.forEach((t, i) => parts.push(`<text x="${px(i)}" y="352">${esc(t)}</text>`));
	if (s.xAxisLabel) parts.push(`<text x="${(x0 + x1) / 2}" y="374" font-size="11.5">${esc(s.xAxisLabel)}</text>`);
	parts.push('</g>');

	s.series.forEach((ser, si) => {
		const col = ser.color ?? PALETTE[si % PALETTE.length];
		const pts = ser.points.map((v, i) => `${px(i)},${py(v)}`).join(' ');
		if (areaMode || ser.area) {
			parts.push(`<polygon fill="${col}" fill-opacity="0.15" points="${px(0)},${y0} ${pts} ${px(ser.points.length - 1)},${y0}"/>`);
		}
		parts.push(`<polyline fill="none" stroke="${col}" stroke-width="2.5"${ser.dash ? ' stroke-dasharray="5 4"' : ''} points="${pts}"/>`);
		parts.push(`<g fill="${col}">`);
		ser.points.forEach((v, i) => parts.push(`<circle cx="${px(i)}" cy="${py(v)}" r="3.5"/>`));
		parts.push('</g>');
		if (ser.endLabel) {
			const lastV = ser.points[ser.points.length - 1];
			parts.push(`<text x="${x1 - 8}" y="${py(lastV) - 8}" fill="${col}" font-size="12" font-weight="600" text-anchor="end">${esc(ser.endLabel)}</text>`);
		}
	});
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── bar (vertical) ────────────────────────────────────
export interface BarSpec {
	type: 'bar';
	bars: { label: string; value: number; color?: string; note?: string; valueLabel?: string }[];
	yMax?: number;
	yUnit?: string;
	xAxisLabel?: string;
	ariaLabel: string;
}
export function barChart(s: BarSpec): string {
	const W = 640, H = 380, x0 = 60, x1 = 600, y0 = 320, yTop = 50;
	const yMax = s.yMax ?? Math.max(...s.bars.map((b) => b.value));
	const py = (v: number) => Math.round(y0 - (v / yMax) * (y0 - yTop));
	const n = s.bars.length, slot = (x1 - x0) / n, bw = Math.round(Math.min(slot * 0.5, 110));
	const parts: string[] = [];
	const ys = ticks(yMax);
	parts.push(`<g stroke="${C.border}" stroke-width="1">`);
	for (const v of ys) parts.push(`<line x1="${x0}" y1="${py(v)}" x2="${x1}" y2="${py(v)}"/>`);
	parts.push('</g>');
	parts.push(`<g fill="${C.muted}" font-size="12" text-anchor="end">`);
	for (const v of ys) parts.push(`<text x="${x0 - 8}" y="${py(v) + 4}">${v}${v === yMax ? esc(s.yUnit ?? '') : ''}</text>`);
	parts.push('</g>');
	s.bars.forEach((b, i) => {
		const cx = Math.round(x0 + slot * (i + 0.5));
		const col = b.color ?? PALETTE[i % PALETTE.length];
		parts.push(`<rect x="${cx - bw / 2}" y="${py(b.value)}" width="${bw}" height="${y0 - py(b.value)}" rx="4" fill="${col}"/>`);
		parts.push(`<text x="${cx}" y="${py(b.value) - 10}" fill="${col}" font-size="17" font-weight="600" text-anchor="middle">${esc(b.valueLabel ?? `${b.value}${s.yUnit ?? ''}`)}</text>`);
		parts.push(`<text x="${cx}" y="${y0 + 22}" fill="${C.text}" font-size="13" text-anchor="middle">${esc(b.label)}</text>`);
		if (b.note) parts.push(`<text x="${cx}" y="${y0 + 40}" fill="${C.muted}" font-size="11.5" text-anchor="middle">${esc(b.note)}</text>`);
	});
	if (s.xAxisLabel) parts.push(`<text x="${(x0 + x1) / 2}" y="${H - 6}" fill="${C.muted}" font-size="11.5" text-anchor="middle">${esc(s.xAxisLabel)}</text>`);
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── hbar (horizontal, 긴 라벨·순위) ───────────────────
export interface HBarSpec {
	type: 'hbar';
	bars: { label: string; value: number; color?: string; valueLabel?: string }[];
	xMax?: number;
	unit?: string;
	ariaLabel: string;
}
export function hbarChart(s: HBarSpec): string {
	const W = 640, labelW = 150, x0 = labelW, x1 = 560;
	const rowH = 42, top = 20, H = top + s.bars.length * rowH + 20;
	const xMax = s.xMax ?? Math.max(...s.bars.map((b) => b.value));
	const bw = (v: number) => Math.round((v / xMax) * (x1 - x0));
	const parts: string[] = [];
	s.bars.forEach((b, i) => {
		const cy = top + i * rowH;
		const col = b.color ?? PALETTE[i % PALETTE.length];
		parts.push(`<text x="${labelW - 12}" y="${cy + 22}" fill="${C.text}" font-size="13" text-anchor="end">${esc(b.label)}</text>`);
		parts.push(`<rect x="${x0}" y="${cy + 8}" width="${x1 - x0}" height="20" rx="4" fill="${C.surface}"/>`);
		parts.push(`<rect x="${x0}" y="${cy + 8}" width="${bw(b.value)}" height="20" rx="4" fill="${col}"/>`);
		parts.push(`<text x="${x0 + bw(b.value) + 8}" y="${cy + 23}" fill="${col}" font-size="13" font-weight="600">${esc(b.valueLabel ?? `${b.value}${s.unit ?? ''}`)}</text>`);
	});
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── grouped-bar (다계열 비교) ─────────────────────────
export interface GroupedBarSpec {
	type: 'grouped-bar';
	groups: { label: string; values: number[] }[];
	seriesNames: string[];
	colors?: string[];
	yMax?: number;
	yUnit?: string;
	ariaLabel: string;
}
export function groupedBar(s: GroupedBarSpec): string {
	const W = 640, H = 380, x0 = 60, x1 = 600, y0 = 320, yTop = 50;
	const yMax = s.yMax ?? Math.max(...s.groups.flatMap((g) => g.values));
	const py = (v: number) => Math.round(y0 - (v / yMax) * (y0 - yTop));
	const ng = s.groups.length, slot = (x1 - x0) / ng;
	const m = s.seriesNames.length, bw = Math.min((slot * 0.7) / m, 48);
	const cols = s.colors ?? PALETTE;
	const parts: string[] = [];
	const ys = ticks(yMax);
	parts.push(`<g stroke="${C.border}" stroke-width="1">`);
	for (const v of ys) parts.push(`<line x1="${x0}" y1="${py(v)}" x2="${x1}" y2="${py(v)}"/>`);
	parts.push('</g>');
	parts.push(`<g fill="${C.muted}" font-size="12" text-anchor="end">`);
	for (const v of ys) parts.push(`<text x="${x0 - 8}" y="${py(v) + 4}">${v}${v === yMax ? esc(s.yUnit ?? '') : ''}</text>`);
	parts.push('</g>');
	// 범례
	let lx = 60;
	parts.push('<g font-size="12.5">');
	s.seriesNames.forEach((nm, j) => {
		parts.push(`<rect x="${lx}" y="8" width="14" height="14" rx="3" fill="${cols[j % cols.length]}"/>`);
		parts.push(`<text x="${lx + 20}" y="19" fill="${C.text}">${esc(nm)}</text>`);
		lx += 20 + nm.length * 13 + 20;
	});
	parts.push('</g>');
	s.groups.forEach((g, gi) => {
		const gx = x0 + slot * gi + (slot - bw * m) / 2;
		g.values.forEach((v, j) => {
			const x = Math.round(gx + j * bw);
			parts.push(`<rect x="${x}" y="${py(v)}" width="${Math.round(bw - 3)}" height="${y0 - py(v)}" rx="3" fill="${cols[j % cols.length]}"/>`);
		});
		parts.push(`<text x="${Math.round(x0 + slot * (gi + 0.5))}" y="${y0 + 22}" fill="${C.text}" font-size="13" text-anchor="middle">${esc(g.label)}</text>`);
	});
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── stacked-bar (구성 비율 + 절대량) ──────────────────
export interface StackedBarSpec {
	type: 'stacked-bar';
	bars: { label: string; segments: { name: string; value: number; color?: string }[] }[];
	yMax?: number;
	yUnit?: string;
	ariaLabel: string;
}
export function stackedBar(s: StackedBarSpec): string {
	const W = 640, H = 380, x0 = 60, x1 = 600, y0 = 320, yTop = 50;
	const totals = s.bars.map((b) => b.segments.reduce((a, c) => a + c.value, 0));
	const yMax = s.yMax ?? Math.max(...totals);
	const py = (v: number) => Math.round(y0 - (v / yMax) * (y0 - yTop));
	const n = s.bars.length, slot = (x1 - x0) / n, bw = Math.round(Math.min(slot * 0.5, 120));
	const segs0 = s.bars[0]?.segments ?? [];
	const parts: string[] = [];
	const ys = ticks(yMax);
	parts.push(`<g stroke="${C.border}" stroke-width="1">`);
	for (const v of ys) parts.push(`<line x1="${x0}" y1="${py(v)}" x2="${x1}" y2="${py(v)}"/>`);
	parts.push('</g>');
	parts.push(`<g fill="${C.muted}" font-size="12" text-anchor="end">`);
	for (const v of ys) parts.push(`<text x="${x0 - 8}" y="${py(v) + 4}">${v}${v === yMax ? esc(s.yUnit ?? '') : ''}</text>`);
	parts.push('</g>');
	let lx = 60;
	parts.push('<g font-size="12.5">');
	segs0.forEach((sg, j) => {
		const col = sg.color ?? PALETTE[j % PALETTE.length];
		parts.push(`<rect x="${lx}" y="8" width="14" height="14" rx="3" fill="${col}"/>`);
		parts.push(`<text x="${lx + 20}" y="19" fill="${C.text}">${esc(sg.name)}</text>`);
		lx += 20 + sg.name.length * 13 + 20;
	});
	parts.push('</g>');
	s.bars.forEach((b, i) => {
		const cx = Math.round(x0 + slot * (i + 0.5));
		let acc = 0;
		b.segments.forEach((sg, j) => {
			const yTopSeg = py(acc + sg.value), yBot = py(acc);
			const col = sg.color ?? PALETTE[j % PALETTE.length];
			parts.push(`<rect x="${cx - bw / 2}" y="${yTopSeg}" width="${bw}" height="${yBot - yTopSeg}" fill="${col}"/>`);
			acc += sg.value;
		});
		parts.push(`<text x="${cx}" y="${y0 + 22}" fill="${C.text}" font-size="13" text-anchor="middle">${esc(b.label)}</text>`);
	});
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── donut (구성 비율) ─────────────────────────────────
export interface DonutSpec {
	type: 'donut';
	items: { label: string; value: number; color?: string }[];
	centerLabel?: string;
	unit?: string;
	ariaLabel: string;
}
export function donut(s: DonutSpec): string {
	const W = 640, H = 320, cx = 160, cy = 160, r = 110, sw = 44;
	const total = s.items.reduce((a, b) => a + b.value, 0);
	const circ = 2 * Math.PI * r;
	let offset = 0;
	const parts: string[] = [];
	parts.push(`<g transform="rotate(-90 ${cx} ${cy})">`);
	s.items.forEach((it, i) => {
		const col = it.color ?? PALETTE[i % PALETTE.length];
		const len = (it.value / total) * circ;
		parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-dasharray="${R(len)} ${R(circ - len)}" stroke-dashoffset="${R(-offset)}"/>`);
		offset += len;
	});
	parts.push('</g>');
	if (s.centerLabel) parts.push(`<text x="${cx}" y="${cy + 6}" fill="${C.text}" font-size="22" font-weight="600" text-anchor="middle">${esc(s.centerLabel)}</text>`);
	// 범례(우측)
	let ly = cy - s.items.length * 14;
	parts.push('<g font-size="13">');
	s.items.forEach((it, i) => {
		const col = it.color ?? PALETTE[i % PALETTE.length];
		const pct = Math.round((it.value / total) * 100);
		parts.push(`<rect x="360" y="${ly}" width="14" height="14" rx="3" fill="${col}"/>`);
		parts.push(`<text x="382" y="${ly + 12}" fill="${C.text}">${esc(it.label)} <tspan fill="${C.muted}">${it.value}${esc(s.unit ?? '')} · ${pct}%</tspan></text>`);
		ly += 30;
	});
	parts.push('</g>');
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── scatter (상관·분포) ───────────────────────────────
export interface ScatterSpec {
	type: 'scatter';
	points: { x: number; y: number; label?: string; color?: string }[];
	xMax: number; yMax: number;
	xAxisLabel?: string; yAxisLabel?: string;
	ariaLabel: string;
}
export function scatter(s: ScatterSpec): string {
	const W = 640, H = 380, x0 = 60, x1 = 600, y0 = 320, yTop = 40;
	const px = (v: number) => Math.round(x0 + (v / s.xMax) * (x1 - x0));
	const py = (v: number) => Math.round(y0 - (v / s.yMax) * (y0 - yTop));
	const parts: string[] = [];
	const ys = ticks(s.yMax);
	parts.push(`<g stroke="${C.border}" stroke-width="1">`);
	for (const v of ys) parts.push(`<line x1="${x0}" y1="${py(v)}" x2="${x1}" y2="${py(v)}"/>`);
	parts.push('</g>');
	parts.push(`<g fill="${C.muted}" font-size="12" text-anchor="end">`);
	for (const v of ys) parts.push(`<text x="${x0 - 8}" y="${py(v) + 4}">${v}</text>`);
	parts.push('</g>');
	s.points.forEach((p) => {
		parts.push(`<circle cx="${px(p.x)}" cy="${py(p.y)}" r="5" fill="${p.color ?? C.accent}" fill-opacity="0.8"/>`);
		if (p.label) parts.push(`<text x="${px(p.x) + 9}" y="${py(p.y) + 4}" fill="${C.muted}" font-size="11.5">${esc(p.label)}</text>`);
	});
	if (s.xAxisLabel) parts.push(`<text x="${(x0 + x1) / 2}" y="${H - 6}" fill="${C.muted}" font-size="11.5" text-anchor="middle">${esc(s.xAxisLabel)}</text>`);
	if (s.yAxisLabel) parts.push(`<text x="18" y="${(y0 + yTop) / 2}" fill="${C.muted}" font-size="11.5" text-anchor="middle" transform="rotate(-90 18 ${(y0 + yTop) / 2})">${esc(s.yAxisLabel)}</text>`);
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── treemap (slice-and-dice) ──────────────────────────
export interface TreemapSpec {
	type: 'treemap';
	items: { label: string; value: number; color?: string; note?: string }[];
	yUnit?: string;
	ariaLabel: string;
}
export function treemap(s: TreemapSpec): string {
	const W = 640, H = 300, pad = 3;
	const total = s.items.reduce((a, b) => a + b.value, 0);
	let x = 0;
	const parts: string[] = [];
	s.items.forEach((it, i) => {
		const w = (it.value / total) * W;
		const col = it.color ?? PALETTE[i % PALETTE.length];
		parts.push(`<rect x="${R(x + pad / 2)}" y="${pad / 2}" width="${R(Math.max(0, w - pad))}" height="${H - pad}" rx="4" fill="${col}" fill-opacity="0.9"/>`);
		if (w > 70) {
			parts.push(`<text x="${R(x + 14)}" y="34" fill="${C.bg}" font-size="14" font-weight="600">${esc(it.label)}</text>`);
			parts.push(`<text x="${R(x + 14)}" y="56" fill="${C.bg}" font-size="13">${esc(it.value)}${esc(s.yUnit ?? '')}${it.note ? ' · ' + esc(it.note) : ''}</text>`);
		}
		x += w;
	});
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── stat (KPI 강조 카드) ──────────────────────────────
export interface StatSpec {
	type: 'stat';
	stats: { value: string; label: string; note?: string; color?: string }[];
	ariaLabel: string;
}
export function statRow(s: StatSpec): string {
	const W = 640, H = 150, n = s.stats.length, gap = 16;
	const cw = (W - gap * (n - 1)) / n;
	const parts: string[] = [];
	s.stats.forEach((st, i) => {
		const x = i * (cw + gap);
		const col = st.color ?? C.accent;
		parts.push(`<rect x="${R(x)}" y="0" width="${R(cw)}" height="${H}" rx="10" fill="${C.surface}" stroke="${C.border}"/>`);
		parts.push(`<text x="${R(x + cw / 2)}" y="66" fill="${col}" font-size="42" font-weight="700" text-anchor="middle">${esc(st.value)}</text>`);
		parts.push(`<text x="${R(x + cw / 2)}" y="98" fill="${C.text}" font-size="14" text-anchor="middle">${esc(st.label)}</text>`);
		if (st.note) parts.push(`<text x="${R(x + cw / 2)}" y="120" fill="${C.muted}" font-size="11.5" text-anchor="middle">${esc(st.note)}</text>`);
	});
	return wrap(W, H, parts.join('\n'), s.ariaLabel);
}

// ── dispatch ──────────────────────────────────────────
export type ChartSpec =
	| LineSpec | BarSpec | HBarSpec | GroupedBarSpec | StackedBarSpec
	| DonutSpec | ScatterSpec | TreemapSpec | StatSpec;
export function renderChart(spec: ChartSpec): string {
	switch (spec.type) {
		case 'line': case 'area': return lineChart(spec);
		case 'bar': return barChart(spec);
		case 'hbar': return hbarChart(spec);
		case 'grouped-bar': return groupedBar(spec);
		case 'stacked-bar': return stackedBar(spec);
		case 'donut': return donut(spec);
		case 'scatter': return scatter(spec);
		case 'treemap': return treemap(spec);
		case 'stat': return statRow(spec);
		default: throw new Error(`unknown chart type: ${(spec as any).type}`);
	}
}

// ── CLI + self-check ──────────────────────────────────
if (import.meta.main) {
	const [type, json] = process.argv.slice(2);
	if (type === 'test') {
		const cases: ChartSpec[] = [
			{ type: 'line', xTicks: ['5', '40'], yMax: 40, yUnit: '%', series: [{ name: 'a', points: [17, 17], dash: true }, { name: 'b', points: [19, 33] }], ariaLabel: 't' },
			{ type: 'area', xTicks: ['1', '2', '3'], yMax: 100, series: [{ name: 'a', points: [10, 50, 90] }], ariaLabel: 't' },
			{ type: 'bar', bars: [{ label: 'x', value: 85 }, { label: 'y', value: 10 }], yMax: 100, yUnit: '%', ariaLabel: 't' },
			{ type: 'hbar', bars: [{ label: 'aaa', value: 30 }, { label: 'bbb', value: 70 }], ariaLabel: 't' },
			{ type: 'grouped-bar', groups: [{ label: 'g1', values: [3, 5] }, { label: 'g2', values: [6, 2] }], seriesNames: ['s1', 's2'], ariaLabel: 't' },
			{ type: 'stacked-bar', bars: [{ label: 'x', segments: [{ name: 'a', value: 3 }, { name: 'b', value: 7 }] }], ariaLabel: 't' },
			{ type: 'donut', items: [{ label: 'a', value: 60 }, { label: 'b', value: 40 }], centerLabel: '60%', ariaLabel: 't' },
			{ type: 'scatter', points: [{ x: 1, y: 2 }, { x: 3, y: 4, label: 'p' }], xMax: 5, yMax: 5, ariaLabel: 't' },
			{ type: 'treemap', items: [{ label: 'a', value: 50 }, { label: 'b', value: 50 }], ariaLabel: 't' },
			{ type: 'stat', stats: [{ value: '17%', label: 'a' }, { value: '2x', label: 'b', note: 'n' }], ariaLabel: 't' },
		];
		for (const spec of cases) {
			const svg = renderChart(spec);
			if (!svg.startsWith('<svg') || !svg.includes('</svg>')) throw new Error(`${spec.type}: invalid svg`);
			if (svg.includes('NaN') || svg.includes('undefined')) throw new Error(`${spec.type}: NaN/undefined in output`);
		}
		console.log(`charts self-check OK (${cases.length} types)`);
	} else if (type && json) {
		console.log(renderChart({ type, ...JSON.parse(json) } as ChartSpec));
	} else {
		console.error('usage: charts.ts <line|area|bar|hbar|grouped-bar|stacked-bar|donut|scatter|treemap|stat> \'<json>\'  |  charts.ts test');
		process.exit(1);
	}
}
