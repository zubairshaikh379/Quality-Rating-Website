// src/components/ChartComponent.tsx
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Prediction } from '../types/prediction'; // Assuming you have a type for Prediction

interface ChartComponentProps {
  predictions: Prediction[] | undefined; // Allow undefined for the prop
}

const ChartComponent: React.FC<ChartComponentProps> = ({ predictions }) => {
  // Check if predictions is an array before mapping
  const chartData = Array.isArray(predictions)
    ? predictions.map(p => ({
        date: new Date(p.timestamp.seconds * 1000).toLocaleDateString(),
        quality: p.quality,
      }))
    : []; // Render an empty array if predictions is not valid

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="quality" stroke="#8AAEEB" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;