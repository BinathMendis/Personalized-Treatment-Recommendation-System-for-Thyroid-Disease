import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TSHTrendChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'TSH (μIU/mL)',
        data: data.map(item => item.tsh_value),
        fill: false,
        borderColor: '#42a5f5',
        tension: 0.3
      }
    ]
  };

  return <Line data={chartData} />;
};

export default TSHTrendChart;
