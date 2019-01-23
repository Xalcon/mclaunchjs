import Fs from "fs";
console.log("Preloading");

declare const button1:HTMLButtonElement;

onload = () =>
{
    console.log("Preloaded");
    button1.addEventListener("click", () => {
        alert("You clicked me, and Fs is " + Fs);
    })
}