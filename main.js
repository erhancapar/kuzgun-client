const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
let isDay = true;

let store;
(async () => {
  const { default: Store } = await import('electron-store');
  store = new Store();
  isDay = store.get('theme', true);
})();

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('public/index.html');

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('theme-updated', isDay);
  });
}

ipcMain.on('toggle-theme', (event) => {
  isDay = !isDay;
  store.set('theme', isDay);
  win.webContents.send('theme-updated', isDay);
});

ipcMain.on('navigate', (event, arg) => {
  if (arg === 'login') {
    win.loadFile('public/login.html');
  } else if (arg === 'index') {
    win.loadFile('public/index.html');
  } else if (arg === 'forgot-password') {
    win.loadFile('public/forgot-password.html');
  } else if (arg === 'register') {
    win.loadFile('public/register.html');
  }

  win.webContents.once('did-finish-load', () => {
    win.webContents.send('theme-updated', isDay);
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

