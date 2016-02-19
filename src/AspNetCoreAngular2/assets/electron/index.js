// main/index.js

'use strict';  
const electron = require('electron'),  
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;  

var mainWindow = null;

app.on('window-all-closed', function() {  
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {  
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});