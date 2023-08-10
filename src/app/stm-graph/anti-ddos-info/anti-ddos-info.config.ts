import { range, scaleOrdinal } from "d3";
import { MarginConvention } from "src/app/models/margin-convention";

export const ANTI_DDOS_MC = new MarginConvention(1000, 285, {
  bottom: 40,
  top: 20,
  left: 55,
  right: 20,
});

export const COLORS = [
  { fill: '#BAE0BA', stroke: '#99B69A' },
  { fill: '#BAD9FC', stroke: '#9AC2E8' },
  { fill: '#FCD0D1', stroke: '#B8998B' },
  { fill: '#F0F5C4', stroke: '#C9DF56' },
  { fill: '#78F0FF', stroke: '#0CC8E1' },
] as const;

export const SCALE_FILL = scaleOrdinal<number, typeof COLORS[number]['fill']>()
  .domain(range(COLORS.length))
  .range(COLORS.map(c => c.fill));

export const SCALE_STROKE = scaleOrdinal<number, typeof COLORS[number]['stroke']>()
  .domain(range(COLORS.length))
  .range(COLORS.map(c => c.stroke));
