import React, { createContext, useState } from "react";

export const VisibilityContext = createContext();

export const VisibilityProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <VisibilityContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </VisibilityContext.Provider>
  );
};
