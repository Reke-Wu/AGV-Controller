const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(createWindow);
