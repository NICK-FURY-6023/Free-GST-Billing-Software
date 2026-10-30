const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let serverProcess = null;
const PORT = process.env.PORT || 47371;

function startServer() {
  const serverPath = path.join(__dirname, '../server.js');
  serverProcess = spawn('node', [serverPath], {
    env: { ...process.env, PORT: PORT },
    stdio: 'inherit'
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, '../public/favicon.svg')
  });

  setTimeout(() => {
    win.loadURL(`http://localhost:${PORT}`);
  }, 2000);
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
