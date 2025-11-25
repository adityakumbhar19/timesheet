import React, { createContext, useState } from 'react';

const DateContext = createContext();

const DateProvider = ({ children }) => {
  const [data, setData] = useState({fromdate:'',todate:''});  
  const updateData = (newData) => {
    setData({fromdate:newData.from,todate:newData.to});
  };
  return (
    <DateContext.Provider value={{ data, updateData }}>
      {children}
    </DateContext.Provider>
  );
};

export  {DateContext, DateProvider};