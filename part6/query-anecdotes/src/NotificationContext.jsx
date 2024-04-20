/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react';

const alertReducer = (state, action) => {
  switch (action.type) {
    case 'ALERT':
      return { status: 'success', content: action.payload.content };
    case 'ERROR':
      return { status: 'error', content: action.payload.content }
    case 'CLEAR':
      return {};
    default:
      return state;
  }
};

const AlertContext = createContext();

export const AlertContextProvider = ({children}) => {
  const [alert, dispatchAlert] = useReducer(alertReducer, {});

  return (
    <AlertContext.Provider value={{alert, dispatchAlert}}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const { alert } = useContext(AlertContext);
  return alert;
};

export const useAlertDispatch = () => {
  const { dispatchAlert } = useContext(AlertContext);
  return dispatchAlert;
};

export default AlertContext;