import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openSimulation: (type: string, title: string) => 
    ipcRenderer.invoke('open-simulation', type, title),
  getWindowType: () => 
    ipcRenderer.invoke('get-window-type'),
  closeWindow: () => 
    ipcRenderer.invoke('close-window'),
  isElectron: true,
});
