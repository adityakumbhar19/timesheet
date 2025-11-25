import {useContext} from 'react';
import {DateContext} from './dateProvider'

const UseDatecontext = () => {
    const context = useContext(DateContext);
    if (!context) {
      throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
  };
  export default UseDatecontext