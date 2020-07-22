import React, { FunctionComponent, useState } from 'react';
import { makeStyles, Slide, Button, ClickAwayListener } from '@material-ui/core';

export interface CardActionBarProps {
  confirmActions?: string[]
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 48,
    display: 'flex',
    alignItems: 'center'
  },
  actionConfirm: {
    '& > button': {
      marginLeft: theme.spacing(2)
    }
  }
}));

export const CardActionBar: FunctionComponent<CardActionBarProps> = ({children, confirmActions}) => {

  confirmActions = confirmActions || [];

  children = React.Children.map(children, (child: any) => 
    child && child.props.id && confirmActions.includes(child.props.id) ? 
      React.cloneElement(child, 
        { onClick: () => setConfirm({label: child.props.id, onConfirm: child.props.onClick}) }
      ) : child
  );

  const defaultConfirm = { label: null, onConfirm: null }
  const [confirm, setConfirm] = useState(defaultConfirm);
  const classes = useStyles({});

  return (
    <ClickAwayListener onClickAway={() => setConfirm(defaultConfirm)}>
      <div className={classes.root}>
      {
        confirm.onConfirm &&
        <Slide in={true} direction="left">
          <div className={classes.actionConfirm}>
            <Button variant="outlined" onClick={() => setConfirm(defaultConfirm)}>
              Cancel
            </Button>
            <Button variant="outlined" color="primary" onClick={() => {
              confirm.onConfirm();
              setConfirm(defaultConfirm);
            }}>
              {confirm.label || ''}
            </Button>
          </div>
        </Slide>
      }
      { 
        !confirm.onConfirm && children 
      }
      </div>
    </ClickAwayListener>
  );
};
