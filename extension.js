const {St, Clutter} = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
let panelButton, panelButtonText, timeout;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const request = Me.imports.api.request;

//api url
let url ="http://volumio.local/api/v1/getState"

function getData (){
    return request.get('http://volumio.local/api/v1/getState')
}
async function setButtonText(){
    let result = await getData();
    let json = JSON.parse(result.body);
    let song = json.artist + ' - '+ json.title
    panelButtonText.set_text( song );
    return true;

}

function init(){
    panelButton = new St.Bin({
        style_class : "panel-button"
    });
    panelButtonText = new St.Label({
        style_class : "button",
        text : "Starting ...",
        y_align: Clutter.ActorAlign.CENTER,
    });
    panelButton.set_child(panelButtonText);
}

function enable(){
    Main.panel._rightBox.insert_child_at_index(panelButton, 1);
    timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
}

function disable(){
    Mainloop.source_remove(timeout)
    Main.panel._rightBox.remove_child(panelButton);
}