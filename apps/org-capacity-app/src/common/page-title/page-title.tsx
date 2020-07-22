import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

export interface PageTitleProps {
  className?: string
  title: string
  description?: string
  dense?: boolean
  fullWidth?: boolean
}

const useStyles = makeStyles({
  root: {
    fontFamily: 'acumin-pro-semi-condensed, sans-serif',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0 0 8px',
    borderBottom: '8px solid #c8eefa',
    background: '#0081ab',
    color: '#fff',
    verticalAlign: 'top',
    '&[data-full-width=true]': {
      width: '100vw',
      left: '50%',
      marginLeft: '-50vw'
    }
  },
  content: {
    width: '100%',
    margin: '0 auto',
    padding: '56px 72px',
    verticalAlign: 'top',
    '& h1': {
      margin: 0,
      padding: 0,
      width: '80%',
      fontSize: '3rem',
      lineHeight: '3.375rem'
    },
    '& p': {
      width: '80%',
      padding: 0,
      fontSize: '1.5rem',
      lineHeight: '32px'
    },
    '&[data-dense=true]': {
      padding: '26px 72px',
      '& p': {
        width: '90%',
        margin: '12px 0 0',
        fontSize: '1.2rem'
      }
    }
  }
})

export const PageTitle = ({className, title, description, dense, fullWidth}: PageTitleProps) => {
  const classes = useStyles({});
  return (
    <div className={clsx(classes.root, className)} data-full-width={fullWidth}>
      <div className={classes.content} data-dense={dense}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default PageTitle;
