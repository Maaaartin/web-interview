import React, { useState } from 'react';
import { Alert, Snackbar, AlertTitle } from '@mui/material';

export const AlertContext = React.createContext();

export const AlertContextProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({ open: false });
  const handleClose = () => setAlertState({ open: false });

  const setStateWrapper =
    (severity, timeout = 5000) =>
    (title, message) =>
      setAlertState({ open: true, title, message, severity, timeout });
  return (
    <AlertContext.Provider
      value={{
        alertError: setStateWrapper('error'),
        alertInfo: setStateWrapper('info'),
        alertWarning: setStateWrapper('warning'),
        alertSuccess: setStateWrapper('success', 2000),
      }}
    >
      <Snackbar
        open={alertState.open}
        autoHideDuration={alertState.timeout}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alertState.severity}>
          <AlertTitle>{alertState.title}</AlertTitle>
          {alertState.message}
        </Alert>
      </Snackbar>
      {children}
    </AlertContext.Provider>
  );
};
