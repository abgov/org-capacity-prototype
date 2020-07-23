import React, { ReactNode } from 'react';
import { CircularProgress, Fade, makeStyles } from '@material-ui/core';

export interface LoadResourceWrapperProps {
  className?: string
  renderContent: () => ReactNode
  resource: unknown
  isLoading: boolean
}

const useStyles = makeStyles(theme => ({
  loadOverlay: {
    position: 'absolute',
    background: '#11111199',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&[hidden]': {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
}))

export const LoadResourceWrapper = ({className, renderContent, resource, isLoading}: LoadResourceWrapperProps) => {
 
  const classes = useStyles({});
  
  return (
    <div className={className}>
      {
        resource ? 
        renderContent() :
        <div className={classes.toolbar} />
      }
      <Fade in={isLoading}>
        <div className={classes.loadOverlay}>
          <CircularProgress />
        </div>
      </Fade>
    </div>
  );
};
