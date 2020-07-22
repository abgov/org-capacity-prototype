import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

export interface ExpandButtonProps {
  expanded: boolean
  direction?: 'left' | 'right'
  onClick: (expand: boolean) => void
}

const useStyles = makeStyles({
  expand: {
    transitionProperty: 'transform, background',
    transitionDuration: '100ms',
    '&[data-expanded=false]': {
      transform: (direction) => 
        direction === 'right' ? 
        'rotate(90deg)' :
        'rotate(-90deg)'
    }
  }
})

export const ExpandButton = ({ expanded, onClick, direction }: ExpandButtonProps) => {
  
  const classes = useStyles({direction});
  
  return (
    <IconButton onClick={() => onClick(!expanded)}>
      <ExpandMore className={classes.expand} data-expanded={expanded} />
    </IconButton>
  );
};
