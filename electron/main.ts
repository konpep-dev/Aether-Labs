import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

// Remove menu bar
Menu.setApplicationMenu(null);

// Store references to all windows
const windows: Map<string, BrowserWindow> = new Map();

function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#050b14',
    titleBarStyle: 'hiddenInset',
    frame: process.platform === 'darwin' ? true : false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  windows.set('main', mainWindow);
  
  mainWindow.on('closed', () => {
    windows.delete('main');
  });

  return mainWindow;
}

function createSimulationWindow(type: string, title: string): BrowserWindow {
  const existingWindow = windows.get(type);
  if (existingWindow && !existingWindow.isDestroyed()) {
    existingWindow.focus();
    return existingWindow;
  }

  const simWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 500,
    backgroundColor: '#050b14',
    title: `Aether Labs - ${title}`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = isDev 
    ? `http://localhost:5173/#/simulation/${type}`
    : `file://${path.join(__dirname, '../dist/index.html')}#/simulation/${type}`;
  
  simWindow.loadURL(url);

  windows.set(type, simWindow);

  simWindow.on('closed', () => {
    windows.delete(type);
  });

  return simWindow;
}

// IPC Handlers
ipcMain.handle('open-simulation', (_event, type: string, title: string) => {
  createSimulationWindow(type, title);
  return true;
});

ipcMain.handle('get-window-type', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (!win) return 'main';
  
  for (const [type, window] of windows) {
    if (window === win) return type;
  }
  return 'main';
});

ipcMain.handle('close-window', (event) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) win.close();
});

// App lifecycle
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
