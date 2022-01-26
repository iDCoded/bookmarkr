const { app, BrowserWindow } = require('electron'); 

let window = null;

app.on("ready", () => {
  console.log("ready");
//   Instantiate a BrowserWindow.
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
    }
  });

//   Load the HTML file into the window.
    window.webContents.loadFile(__dirname + '/index.html');
});
