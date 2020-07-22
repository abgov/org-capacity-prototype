import React, { FunctionComponent } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';

export interface PaneProps {
  name?: string
  isLoading: boolean
}

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',
    textAlign: 'right',
    background: theme.palette.grey[100],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    '&[data-loading=true]': {
      display: 'flex'
    }
  },
  progress: {
    margin: 'auto'
  },
  name: {
    color: theme.palette.text.secondary
  }
}));

export const Pane: FunctionComponent<PaneProps> = ({children, name, isLoading}) => {
  const classes = useStyles({});
  return (
    <div className={classes.container} data-loading={isLoading}>
      {
        isLoading ? 
        <CircularProgress className={classes.progress} /> :
        <React.Fragment>
          <div>{children}</div>
          {name && <div className={classes.name}>{name}</div>}
        </React.Fragment>
      }
    </div>
  );
};

export default Pane;
