import Fs from "fs";
import { remote } from "electron";
console.log("Preloading");

declare const button1:HTMLButtonElement;
declare const titleBarButton_minimize:HTMLButtonElement;
declare const titleBarButton_restore:HTMLButtonElement;
declare const titleBarButton_close:HTMLButtonElement;
declare const document:Document;

onload = () =>
{
    console.log("Preloaded");
    button1.addEventListener("click", () => {
        alert("You clicked me, and Fs is " + Fs);
    });

    titleBarButton_close.addEventListener('click', e => {
        const window = remote.getCurrentWindow()
        window.close()
    });

    titleBarButton_restore.addEventListener('click', e => {
        const window = remote.getCurrentWindow()
        if(window.isMaximized()){
            window.unmaximize()
        } else {
            window.maximize()
        }

        document.body.focus();
    });

    titleBarButton_minimize.addEventListener('click', e => {
        const window = remote.getCurrentWindow()
        window.minimize()

        document.body.focus();
    });
}