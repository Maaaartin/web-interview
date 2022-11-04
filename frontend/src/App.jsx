import React from 'react';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Alert, Snackbar, AlertTitle } from '@mui/material';
import { TodoLists } from './todos/components/TodoLists';
import AlertContext from './Alert';

const MainAppBar = () => {
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          Things to do
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const mainWrapperStyle = { display: 'flex', flexDirection: 'column' };
const centerContentWrapper = { display: 'flex', justifyContent: 'center' };
const contentWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80rem',
  flexGrow: 1,
};

const MainWrapper = ({ children }) => {
  const [alertState, setAlertState] = useState({ open: false });
  const handleClose = () => setAlertState({ open: false });

  return (
    <AlertContext.Provider
      value={{
        alertError: (title, message) => {
          setAlertState({ open: true, title, message, severity: 'error' });
        },
        alertInfo: (title, message) => {
          setAlertState({ open: true, title, message, severity: 'info' });
        },
        alertWarning: (title, message) => {
          setAlertState({ open: true, title, message, severity: 'warning' });
        },
        alertSuccess: (title, message) => {
          setAlertState({ open: true, title, message, severity: 'success' });
        },
      }}
    >
      <Snackbar
        open={alertState.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alertState.severity}>
          <AlertTitle>{alertState.title}</AlertTitle>
          {alertState.message}
        </Alert>
      </Snackbar>
      <div style={mainWrapperStyle}>
        <MainAppBar />
        <div style={centerContentWrapper}>
          <div style={contentWrapperStyle}>{children}</div>
        </div>
      </div>
    </AlertContext.Provider>
  );
};

const App = () => {
  return (
    <MainWrapper>
      <TodoLists style={{ margin: '1rem' }} />
    </MainWrapper>
  );
};

export default App;
