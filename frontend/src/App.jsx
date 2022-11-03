import React from 'react';
import { useState } from 'react';
import { AppBar, Toolbar, Typography, Alert, Snackbar } from '@mui/material';
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
  const [alertState, setAlertState] = useState({ open: false, message: null });
  return (
    <AlertContext.Provider
      value={{
        showAlert: (message) => {
          setAlertState({ open: true, message });
        },
      }}
    >
      <Snackbar
        open={alertState.open}
        autoHideDuration={1000}
        onClose={() => setAlertState({ open: false })}
      >
        <Alert severity='error'>{alertState.message}</Alert>
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
