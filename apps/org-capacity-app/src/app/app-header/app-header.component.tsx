import React, { useState, useRef, FunctionComponent, ReactNode } from 'react';
import { 
  makeStyles, 
  AppBar, 
  Avatar, 
  IconButton, 
  Toolbar,
  ButtonBase, 
  Menu, 
  MenuItem
} from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons'
import { UserProfile } from '../../types';

export interface AppHeaderProps {
  children?: ReactNode
  profile: UserProfile
  onLogin: () => void
  onLogout: () => void
  onOpenProfile: () => void
  onClickMenu?: () => void
}

const useStyles = makeStyles(theme => ({
  root: {
    background: '#FFFFFF',
    zIndex: 1,
    borderBottom: '1px solid #f1f1f1',
    boxShadow: 'none'
  },
  titleBar: {
    borderBottom: '1px solid #f1f1f1',
    height: '66px'
  },
  logo: {
    marginRight: 'auto'
  },
  search: {
    margin: '0 20px 0 20px !important'
  },
  menu: {
    marginLeft: '-16px'
  }
}));

const AppHeader: FunctionComponent<AppHeaderProps> = (
  {children, profile, onLogin, onLogout, onOpenProfile, onClickMenu}
) => {

  const classes = useStyles({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  
  return (
    <AppBar className={classes.root}>
      <div>
        <Toolbar className={classes.titleBar}>
          {
            onClickMenu &&
            <IconButton className={classes.menu} onClick={onClickMenu}>
              <MenuIcon />
            </IconButton>
          }
          <div className={classes.logo}>
            <img src="assets/logo.svg" alt="Alberta"></img>
          </div>
          <div>
            {
              profile ?
              <React.Fragment>
                <ButtonBase ref={profileRef} onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <Avatar src={profile.avatar}>{!profile.avatar && profile.name[0]}</Avatar>
                </ButtonBase>
                <Menu keepMounted open={showProfileMenu} anchorEl={profileRef.current}
                  onClose={() => setShowProfileMenu(false)}>
                  <MenuItem onClick={() => {
                    onOpenProfile();
                    setShowProfileMenu(false);
                  }}>
                    Profile
                  </MenuItem>
                  <MenuItem  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}>
                    Log out
                  </MenuItem>
                </Menu>
              </React.Fragment> :
              <IconButton style={{padding: 0}} onClick={onLogin}>
                <AccountCircle style={{width: 40, height: 40}}/>
              </IconButton>
            }
          </div>
        </Toolbar>
        { children }
      </div>
    </AppBar>
  );
};

export default AppHeader;
