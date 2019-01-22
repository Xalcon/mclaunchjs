export interface IDownloader
{
    getJson<T>(url:string):Promise<T>
    downloadFileTo(url:string, path:string):Promise<void>
}

import __axios, { AxiosInstance } from "axios";
import Path from "path";
import Fs from "fs";

export class AxiosDownloader implements IDownloader
{
    constructor(private ax:AxiosInstance = __axios) { }

    public async getJson<T>(url: string): Promise<T>
    {
        return (await this.ax.get<T>(url)).data;
    }
    
    public async downloadFileTo(url: string, path: string): Promise<void>
    {
        const dirName = Path.dirname(path);
        Fs.mkdirSync(dirName, { recursive: true });
            
        const writer = Fs.createWriteStream(path);
        const response = await this.ax({
            url,
            method: "GET",
            responseType: "stream"
        });
        response.data.pipe(writer);
    
        return new Promise<void>((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}