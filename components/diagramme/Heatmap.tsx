import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { x: 1, y: 1, z: 100 },
  { x: 1, y: 2, z: 200 },
  { x: 2, y: 1, z: 50 },
  { x: 2, y: 2, z: 400 },
];

export default function Heatmap() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <XAxis type="number" dataKey="x" />
        <YAxis type="number" dataKey="y" />
        <ZAxis type="number" dataKey="z" range={[100, 500]} />
        <Tooltip />
        <Scatter data={data} fill="red" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
