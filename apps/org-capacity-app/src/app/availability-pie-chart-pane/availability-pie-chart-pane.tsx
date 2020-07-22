import React, { useRef, useState, useLayoutEffect } from 'react';
import Chart from 'chart.js';
import { makeStyles } from '@material-ui/core';

export interface AvailabilityPieChartPaneProps {
  statuses: {
    name: string
    count: number
  }[]
}

const useStyles = makeStyles({
  root: {
    background: '#f5f5f5', 
    padding: 16, 
    borderRadius: 8,
    position: 'relative'
  },
  label: {
    textAlign: 'right', 
    color: 'rgba(0, 0, 0, 0.54)',
    position: 'absolute',
    right: 16,
    bottom: 16
  }
})

const colors = {
  'Available': 'rgba(0, 150, 255, 1)',
  'Vacant': 'rgba(250, 0, 0, 1)',
  'Working from home': 'rgba(130, 200, 250, 1)',
  'On leave': 'rgba(250, 200, 0, 1)'
}

export const AvailabilityPieChartPane = ({statuses}: AvailabilityPieChartPaneProps) => {
  
  const classes = useStyles({});
  const canvasRef = useRef();
  const [chart, setChart] = useState(null as Chart);
  
  useLayoutEffect(
    () => {
      if (chart) {
        chart.destroy();
      }
      
      const updatedChart = 
        new Chart(canvasRef.current, {
          type: 'pie',
          data: {
            datasets: [{
              backgroundColor: statuses.map(s => colors[s.name]),  
              data: statuses.map(s => s.count)
            }],
            labels: statuses.map(s => s.name)
          },
          options: {
            aspectRatio: 1.2,
            plugins: {
              datalabels: {
                color: '#fff',
                formatter: (value) => value || ''
              }
            }
          }
        });

      setChart(updatedChart);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statuses]
  );

  return (
    <div className={classes.root}>
      <canvas ref={canvasRef}></canvas>
      <div className={classes.label}>Availability</div>
    </div>
  );
};

export default AvailabilityPieChartPane;
