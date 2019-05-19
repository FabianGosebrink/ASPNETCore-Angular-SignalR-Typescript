const { app, Menu, Tray } = require('electron');
const path = require('path');

module.exports = {};

let buildTrayIcon = mainWindow => {
  let trayIconPath = path.join(__dirname, 'icon.ico');

  tray = new Tray(trayIconPath);
  tray.setToolTip('eMeal');

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open application',
      click: function() {
        mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click: function() {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
};

module.exports.buildTrayIcon = buildTrayIcon;
