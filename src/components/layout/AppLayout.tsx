import React from 'react';
import { AppShell } from './AppShell';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return <AppShell>{children}</AppShell>;
};
