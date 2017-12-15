const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

//Listens for app to be ready
app.on('ready', ()=>{
    //Creates main Todo List window
    mainWindow = new BrowserWindow({});

    //Loads html page into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', ()=>{
        app.quit();
    })
    //Builds menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)

});//end app.on

//creates the add item window
function createAddWindow(){
    //creates new window
    addWindow = new BrowserWindow({
        width:300,
        height: 300,
        title: 'Add Item to TODO List'
    });//end mainWindow
    //loads html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))//end load mainWindo.html
    //Handle gargbage collection
    addWindow.on('close',()=>{
        addWindow = null;
    })
}

//creates the read file window
function createReadWindow(){
    //creates new window
    readWindow = new BrowserWindow({
        width:600,
        height: 600,
        title: 'Previous Todo Lists'
    });//end mainWindow
    //loads html into window
    readWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'readWindow.html'),
        protocol: 'file:',
        slashes: true
    }))//end load mainWindo.html
    //Handle gargbage collection
    readWindow.on('close',()=>{
        readWindow = null;
    })
}

//catches item add
ipcMain.on('item:add',function(event, item){
    mainWindow.webContents.send('item:add', item);

    //addWindow.close();
})

//Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                click(){
                    createReadWindow();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Dev Tools',
                accelerator: 'Ctrl + i',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Ctrl + Q',
                click(){
                    app.quit();
                }
            },
        ]
    },
    {
        label: 'Items',
        submenu: [
            {
                label: 'Add Items',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear All Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            }
        ]
    }
];