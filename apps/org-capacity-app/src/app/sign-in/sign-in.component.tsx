import React from 'react';
import { makeStyles, Button, Container, Grid } from '@material-ui/core';
import { PageTitle } from '../../common';
import { UserProfile } from '../../types';

export interface SignInProps {
  profile: UserProfile
  description?: string
  onSignIn: () => void
}

const useStyles = makeStyles({
  root: {
    background: '#fff',
    minHeight: '100%'
  }
})

export const SignIn = ({profile, description, onSignIn}: SignInProps) => {

  const classes = useStyles({});
  
  return (
    <div className={classes.root}>
      <PageTitle dense 
        title="Sign in" 
        description={description} 
      />
      <Container maxWidth="md">
        <section>
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item xs={12}>
              {
                profile &&
                <span>
                  You are signed in as {profile.name}
                </span>
              }
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={onSignIn}
              >
                Sign In
              </Button>
            </Grid>
          </Grid>
        </section>
      </Container>
    </div>
  );
};
