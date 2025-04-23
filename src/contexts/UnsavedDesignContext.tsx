"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UnsavedDesignContextType {
  isDesignSaved: boolean;
  setIsDesignSaved: (isSaved: boolean) => void;
  markDesignAsGenerated: () => void;
  markDesignAsSaved: () => void;
  hasUnsavedDesign: () => boolean;
}

const UnsavedDesignContext = createContext<UnsavedDesignContextType | undefined>(undefined);

export function UnsavedDesignProvider({ children }: { children: ReactNode }) {
  const [isDesignSaved, setIsDesignSaved] = useState<boolean>(true);
  
  // Set up beforeunload event listener for browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDesignSaved) {
        // Standard browser behavior - shows the browser's default warning
        e.preventDefault();
        // This message might not be shown in modern browsers as they use standard messages
        e.returnValue = 'You have an unsaved design that will be lost. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDesignSaved]);
  
  // When a new design is generated
  const markDesignAsGenerated = () => {
    setIsDesignSaved(false);
    // Also store in session storage for access across pages
    sessionStorage.setItem('unsavedDesign', 'true');
  };
  
  // After design is saved to a project
  const markDesignAsSaved = () => {
    setIsDesignSaved(true);
    // Clear from session storage
    sessionStorage.removeItem('unsavedDesign');
  };
  
  // Check if there's an unsaved design
  const hasUnsavedDesign = () => {
    // Check both context state and session storage
    return !isDesignSaved || !!sessionStorage.getItem('unsavedDesign');
  };
  
  return (
    <UnsavedDesignContext.Provider 
      value={{ 
        isDesignSaved, 
        setIsDesignSaved, 
        markDesignAsGenerated, 
        markDesignAsSaved,
        hasUnsavedDesign
      }}
    >
      {children}
    </UnsavedDesignContext.Provider>
  );
}

export function useUnsavedDesign() {
  const context = useContext(UnsavedDesignContext);
  if (context === undefined) {
    throw new Error('useUnsavedDesign must be used within a UnsavedDesignProvider');
  }
  return context;
} 