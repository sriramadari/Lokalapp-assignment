import React,{createContext,useState,useContext, useEffect} from 'react';

const JobContext = createContext<any>(null);

export function useJobContext() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}

export const JobContextProvider = ({ children }:any) => {
  const [JobDetails, setJobDetails] = useState<any>("sriram");

  useEffect(() => {
    console.log("JobDetails", JobDetails);
  }, []);

  return (
    <JobContext.Provider value={{JobDetails, setJobDetails}}>
      {children}
    </JobContext.Provider>
  );
};