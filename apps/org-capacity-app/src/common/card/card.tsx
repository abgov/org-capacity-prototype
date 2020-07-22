import React from 'react';
import { makeStyles, Card as MuiCard, CircularProgress, Fade } from '@material-ui/core';
import { CardProps as MuiCardProps } from '@material-ui/core/Card';

interface CardProps extends MuiCardProps {
  isBusy?: boolean
}

const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    border: '1px solid #dcdcdc',
    borderRadius: 0,
    boxShadow: 'none'
  },
  busy: {
    position: 'absolute',
    background: '#11111199',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export const Card = (props: CardProps) => {

  const classes = useStyles({});
  const {isBusy, ...innerProps} = props;
  const cardProps = {
    ...innerProps,
    className: classes.card + (props.className ? ` ${props.className}` : ''),
    children: (
      <React.Fragment>
        {props.children}
        <Fade in={isBusy}>
          <div className={classes.busy}>
            <CircularProgress />
          </div>
        </Fade>
      </React.Fragment>
    )
  }

  return (
    <MuiCard {...cardProps} />
  );
};
