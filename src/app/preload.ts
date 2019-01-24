import { remote } from "electron";
console.log("Preloading");

declare const btnPlay:HTMLButtonElement;
declare const btnOptions:HTMLButtonElement;
declare const btnOptionsDone:HTMLButtonElement;
declare const titleBarButton_minimize:HTMLButtonElement;
declare const titleBarButton_restore:HTMLButtonElement;
declare const titleBarButton_close:HTMLButtonElement;
declare const document:Document;

function showContainer(selector:string)
{
    document.querySelectorAll(".content-container").forEach(c => {
        c.classList.add("hidden");
    });

    document.querySelector(selector)!.classList.remove("hidden");
}

onload = () =>
{
    titleBarButton_close.addEventListener('click', e => {
        const window = remote.getCurrentWindow()
        window.close()
    });

    titleBarButton_restore.addEventListener('click', e => {
        (document.activeElement as HTMLButtonElement).blur();
        const window = remote.getCurrentWindow()
        if(window.isMaximized()){
            window.unmaximize()
        } else {
            window.maximize()
        }
    });

    titleBarButton_minimize.addEventListener('click', e => {
        (document.activeElement as HTMLButtonElement).blur();
        const window = remote.getCurrentWindow()
        window.minimize()
    });

    document.querySelectorAll("progress").forEach(bar => {
        const label = document.querySelector(`.label span[data-for=${bar.id}][data-type=progress]`) as HTMLLabelElement;
        setInterval(() => {
            if(Math.random() > 0.5)
            {
                bar.value++;
                if(bar.value >= bar.max)
                    bar.value = 0;
            }
            label.innerHTML = `${bar.value} / ${bar.max}`;
        }, 30);
    });

    document.querySelectorAll(".content-container").forEach(c => {
        c.classList.add("hidden");
    });
    document.querySelector(".content-container:first-child")!.classList.remove("hidden");

    btnOptions.addEventListener("click", () => showContainer("#options"));
    btnOptionsDone.addEventListener("click", () => showContainer("#overview"));
}