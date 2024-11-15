// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;
let isDay = true;

(async () => {
  // Dynamically import 'electron-store' as it's an ES Module
  const { default: Store } = await import('electron-store');
  const store = new Store();
  isDay = store.get('theme', true);

  function createWindow() {
    win = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // Determine the starting page based on token existence
    const startPage = getStartingPage();

    win.loadFile(startPage);

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('theme-updated', isDay);

      if (store.has('user') && startPage.includes('welcome.html')) {
        const user = store.get('user');
        win.webContents.send('user-data', user.username);
      }
    });
  }

  // Function to determine the starting page
  function getStartingPage() {
    if (store.has('token')) {
      // Since we don't have token validation yet, assume token is valid
      return 'public/welcome.html';
    } else {
      // No token found
      return 'public/index.html';
    }
  }

  // Handle theme toggle
  ipcMain.on('toggle-theme', (event) => {
    isDay = !isDay;
    store.set('theme', isDay);
    win.webContents.send('theme-updated', isDay);
  });

  // Handle theme request from renderer process
  ipcMain.on('request-theme', (event) => {
    event.sender.send('theme-updated', isDay);
  });

  // Handle navigation
  ipcMain.on('navigate', (event, arg) => {
    const validPages = ['login', 'index', 'forgot-password', 'register', 'welcome'];
    if (validPages.includes(arg)) {
      win.loadFile(`public/${arg}.html`);

      win.webContents.once('did-finish-load', () => {
        win.webContents.send('theme-updated', isDay);

        if (arg === 'welcome' && store.has('user')) {
          const user = store.get('user');
          win.webContents.send('user-data', user.username);
        }
      });
    }
  });

  // Handle successful registration
  ipcMain.on('register-success', (event, data) => {
    store.set('token', data.token);
    store.set('user', data.user);
    win.loadFile('public/welcome.html');

    win.webContents.once('did-finish-load', () => {
      win.webContents.send('user-data', data.user.username);
      win.webContents.send('theme-updated', isDay);
    });
  });

  // Handle successful login
  ipcMain.on('login-success', (event, data) => {
    store.set('token', data.token);
    store.set('user', data.user);
    win.loadFile('public/welcome.html');

    win.webContents.once('did-finish-load', () => {
      win.webContents.send('user-data', data.user.username);
      win.webContents.send('theme-updated', isDay);
    });
  });

  // Handle logout
  ipcMain.on('logout', (event) => {
    store.delete('token');
    store.delete('user');
    win.loadFile('public/index.html');

    win.webContents.once('did-finish-load', () => {
      win.webContents.send('logged-out');
      win.webContents.send('theme-updated', isDay);
    });
  });

  // Handle request for user data from renderer process
  ipcMain.on('request-user-data', (event) => {
    if (store.has('user')) {
      const user = store.get('user');
      event.sender.send('user-data', user.username);
    }
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
})();
