import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Olaf Scholz', value: 85 },
  { name: 'ALice Weidel', value: 70 },
  { name: 'Robert Habeck', value: 60 },
  { name: 'Sarah Wagenknecht', value: 20 },
  { name: 'Friedrich Merz', value: 20 }
];

export default function MyBarChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}