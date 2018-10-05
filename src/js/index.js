const url = require('url');
const path = require('path');

const { app, BrowserWindow } = require('electron')

let window
const createWindow = () => {

    window = new BrowserWindow({width: 1280, height: 720, x: 0, y: 0})

    const startURL = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../views/index.html'),
        protocol: 'file:',
        slashes: true
    });

    console.log(startURL);

    window.setMenu(null);
    window.loadURL(startURL);

    window.webContents.openDevTools();

    window.on('closed', () => {
        window = null;
    });
};

app.on('ready', createWindow);
app.on('activate', () => {

    if (window === null) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
