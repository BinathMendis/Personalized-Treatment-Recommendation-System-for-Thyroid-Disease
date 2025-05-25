import React from 'react';
import { Line } from 'react-chartjs-2';

const WeightTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: data.map(item => item.weight),
        fill: false,
        borderColor: '#66bb6a',
        tension: 0.3
      }
    ]
  };

  return <Line data={chartData} />;
};

export default WeightTrendChart;
