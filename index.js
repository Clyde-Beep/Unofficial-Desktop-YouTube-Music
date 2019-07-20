const {
  app,
  BrowserWindow,
  Tray,
  Menu
} = require("electron");

const path = require("path");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let isQuiting;
let tray;
let trayMenu;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
			webviewTag: true
    },
    title: "YouTube Music",
    icon: __dirname + "/images/favicon.png"
  });


  tray = new Tray(__dirname + "/images/favicon.png");
  tray.setToolTip("YouTube Music");

	tray.on("double-click", function() {
		showWindow();
	});

  showWindow();

  if (win.setThumbarButtons([{
      tooltip: "Previous Song",
      icon: __dirname + "/images/previous.png",
      flags: ["enabled"],
      click() {
        console.log("Previous clicked.");
      }
    }, {
      tooltip: "Play",
      icon: __dirname + "/images/play.png",
      flags: ["enabled"],
      click() {
        console.log("Play clicked.");
      }
    }, {
      tooltip: "Next Song",
      icon: __dirname + "/images/next.png",
      flags: ["enabled"],
      click() {
        console.log("Next clicked.");
      }
    }])) {
    console.log("Thumbbar buttons are supported.");
  } else {
    console.log("Thumbbar buttons are not supported.");
  }

  win.setMenu(null);
  win.maximize();

  // and load the index.html of the app.
  win.loadFile("./index.html");

  // Open the DevTools.
  // win.webContents.openDevTools();

  win.on("close", function(event) {
    if (!isQuiting) {
      event.preventDefault();
      hideWindow();
      event.returnValue = false;
    }
  });
}

function hiddenContextMenu() {
  trayMenu = Menu.buildFromTemplate([{
      label: "Open",
      click: function() {
        showWindow();
      }
    },
    {
      label: "Quit",
      click: function() {
        isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(trayMenu);
}

function shownContextMenu() {
  trayMenu = Menu.buildFromTemplate([{
    label: "Quit",
    click: function() {
      isQuiting = true;
      app.quit();
    }
  }]);
  tray.setContextMenu(trayMenu);
}

function showWindow() {
	win.show();
	shownContextMenu();
}

function hideWindow() {
	win.hide();
	hiddenContextMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("before-quit", function() {
  isQuiting = true;
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
