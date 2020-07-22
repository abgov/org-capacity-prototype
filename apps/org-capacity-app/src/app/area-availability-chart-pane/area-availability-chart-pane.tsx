import React, { useRef, useState, useLayoutEffect } from 'react';
import Chart from 'chart.js';
import 'chartjs-plugin-datalabels';
import { OrganizationCapacity } from '@org-capacity/org-capacity-common';
import { AvailabilityStatusType } from '../../types';

export interface AreaAvailabilityChartPaneProps {
  areas: (OrganizationCapacity & { name: string })[]
  statusTypes: AvailabilityStatusType[]
}

// This is hardcoded for now, but could be part of the configuration.
const colors = {
  'Available': 'rgba(0, 150, 255, 1)',
  'Working from home': 'rgba(130, 200, 250, 1)',
  'On leave': 'rgba(250, 200, 0, 1)'
}

export const AreaAvailabilityChartPane = ({areas, statusTypes}: AreaAvailabilityChartPaneProps) => {
 
  const canvasRef = useRef();
  const [chart, setChart] = useState(null as Chart);
  
  useLayoutEffect(
    () => {
      if (chart) {
        chart.destroy();
      }
      
      const updatedChart = 
        new Chart(canvasRef.current, {
          type: 'bar',
          data: {
            datasets: [
              ...statusTypes.map(s => ({
                backgroundColor: colors[s.name],
                label: s.name,
                data: areas.map(a => {
                  const areaStatusCount = a.statusCounts.find(sc => sc.typeId === s.id);
                  return areaStatusCount ? areaStatusCount.count : 0
                })
              })),
              {
                label: 'Vacant',
                backgroundColor: 'rgba(250, 0, 0, 1)',
                data: areas.map(a => a.vacantRoles)
              }
            ],
            labels: areas.map(p => p.name.split(' '))
          },
          options: {
            aspectRatio: 1.2,
            scales: {
              yAxes: [{
                stacked: true
              }],
              xAxes: [{
                stacked: true
              }]
            },
            plugins: {
              datalabels: {
                color: '#fff',
                formatter: (v) => v || ''
              }
            }
          }
        });

      setChart(updatedChart);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [areas, statusTypes]
  );
  
  return (
    <div style={{background: '#f5f5f5', padding: '16px', borderRadius: '8px'}}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default AreaAvailabilityChartPane;
