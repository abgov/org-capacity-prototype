import React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

export interface MetricPaneProps {
  value: number | string
  name: string
  isLoading?: boolean
  prefix?: string
  suffix?: string
  color?: string
}

const useStyles = makeStyles(theme => ({
  metric: {
    height: 90,
    textAlign: 'right',
    background: theme.palette.grey[100],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    '&[data-loading=true]': {
      display: 'flex'
    }
  },
  progress: {
    margin: 'auto'
  },
  value: {
    fontSize: 60,
    lineHeight: 60,
    fill: ({color}: {color?: string}) => color || theme.palette.text.primary,
    width: '100%',
    '& tspan': {
      fontSize: 18,
      fill: theme.palette.text.secondary
    }
  },
  name: {
    color: theme.palette.text.secondary
  }
}));

export const MetricPane = ({
  value, 
  name, 
  isLoading,
  prefix,
  suffix,
  color
}: MetricPaneProps) => {
  const classes = useStyles({color});
  return (
    <div className={classes.metric} data-loading={isLoading}>
      {
        isLoading ? 
        <CircularProgress className={classes.progress} /> :
        <React.Fragment>
          <svg className={classes.value} viewBox="0 0 150 60">
            <text x="150" y="58" textAnchor="end">
              {
                prefix && 
                <tspan>{prefix}</tspan>
              }
              {value}
              {
                suffix && 
                <tspan>{suffix}</tspan>
              }
            </text>
          </svg>
          <div className={classes.name}>{name}</div>
        </React.Fragment>
      }
    </div>
  );
};

export default MetricPane;
