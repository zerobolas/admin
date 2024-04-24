import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };
  const stopLoading = () => {
    setIsLoading(false);
    setProgress(100); // Optional: set to 100% on stop to complete any visual progress
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, progress, startLoading, stopLoading, setProgress }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
