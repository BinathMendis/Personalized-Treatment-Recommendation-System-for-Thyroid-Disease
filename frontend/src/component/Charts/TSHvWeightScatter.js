import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Title,
  Legend
} from 'chart.js';

ChartJS.register(PointElement, LinearScale, Tooltip, Title, Legend);

const TSHvWeightScatter = ({ data }) => {
  const scatterData = {
    datasets: [
      {
        label: 'TSH vs Weight',
        data: data.map(item => ({
          x: item.tsh_value,
          y: item.weight,
          date: item.date  // Include date in each point
        })),
        backgroundColor: '#ef5350'
      }
    ]
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'TSH (μIU/mL)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const point = context.raw;
            return `TSH: ${point.x}, Weight: ${point.y} kg, Date: ${point.date}`;
          }
        }
      }
    }
  };

  return <Scatter data={scatterData} options={options} />;
};

export default TSHvWeightScatter;
