// File: contexts/SelectedScopeContext.tsx
import React, { createContext, useContext, useState } from "react";

export type SelectedScope = {
  selectedEvent: any | null;
  selectedOrganiser: any | null;
  selectedCompany: any | null;
  selectedUser: any | null;
  setSelectedEvent: (e: any | null) => void;
  setSelectedOrganiser: (o: any | null) => void;
  setSelectedCompany: (c: any | null) => void;
  setSelectedUser: (u: any | null) => void;
};

const SelectedScopeContext = createContext<SelectedScope | undefined>(undefined);

export const SelectedScopeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedOrganiser, setSelectedOrganiser] = useState<any | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <SelectedScopeContext.Provider
      value={{
        selectedEvent,
        selectedOrganiser,
        selectedCompany,
        selectedUser,
        setSelectedEvent,
        setSelectedOrganiser,
        setSelectedCompany,
        setSelectedUser,
      }}
    >
      {children}
    </SelectedScopeContext.Provider>
  );
};

export function useSelectedScope() {
  const ctx = useContext(SelectedScopeContext);
  if (!ctx) throw new Error("useSelectedScope must be used within SelectedScopeProvider");
  return ctx;
}
