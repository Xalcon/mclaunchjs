export interface IDownloader
{
    getJson<T>(url:string):Promise<T>
    downloadFileTo(url:string, path:string):Promise<void>
}

import __axios, { AxiosInstance } from "axios";
import Path from "path";
import Fs from "fs";

class AxiosDownloader implements IDownloader
{
    constructor(private ax:AxiosInstance = __axios) { }

    public async getJson<T>(url: string)
    {
        return (await this.ax.get<T>(url)).data;
    }
    
    public async downloadFileTo(url: string, path: string)
    {
        const response = await this.ax({
            url,
            method: "GET",
            responseType: "stream"
        });

        const dirName = Path.dirname(path);
        Fs.mkdirSync(dirName, { recursive: true });
        const writer = Fs.createWriteStream(path);
        response.data.pipe(writer);
    }
};

const DefaultDownloader = new AxiosDownloader((() => {
    if(process.env.socks_proxy)
    {
        const SocksProxyAgent = require("socks-proxy-agent")
        const agent = new SocksProxyAgent(process.env.socks_proxy);
        return require("axios").create({ httpsAgent: agent, httpAgent: agent })
    }
    return require("axios");
})());

export { DefaultDownloader };