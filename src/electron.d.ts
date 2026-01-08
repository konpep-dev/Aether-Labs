export interface ElectronAPI {
  openSimulation: (type: string, title: string) => Promise<boolean>;
  getWindowType: () => Promise<string>;
  closeWindow: () => Promise<void>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
