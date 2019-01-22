import { IDownloader } from "./downloader";
import { MinecraftVersionList, MinecraftVersion, MinecraftAssetIndex } from "./mojang";
import Path from "path";
import Fs from "fs";
import Hasha from "hasha";

async function getVersion(version:string, downloader:IDownloader)
{
    const listManifest = await downloader.getJson<MinecraftVersionList.Manifest>("https://launchermeta.mojang.com/mc/game/version_manifest.json");
    const def = listManifest.versions.find(v => v.id == version);
    if(!def) throw `Version ${version} not found!`;
    const versionManifest  = await downloader.getJson<MinecraftVersion.Manifest>(def.url);
    if(!versionManifest) throw `Unable to retrieve version.json for ${version}`;
    return versionManifest;
}

export class McAssetRepository
{
    private constructor(private repositoryPath:string, private downloader:IDownloader)
    {
    }

    private async getAssetIndexManifest(versionManifest:MinecraftVersion.Manifest):Promise<MinecraftAssetIndex.Manifest>
    {
        const localIndexPath = Path.join(this.repositoryPath, "indexes", versionManifest.assetIndex.id + ".json")
        if(Fs.existsSync(localIndexPath))
        {
            console.log("found local asset index");
            const json = await Fs.promises.readFile(localIndexPath, { encoding: "utf8" });
            return JSON.parse(json);
        }

        Fs.mkdirSync(Path.dirname(localIndexPath));
        console.log("local asset index not found, downloading latest...");
        const assetIndex = await this.downloader.getJson<MinecraftAssetIndex.Manifest>(versionManifest.assetIndex.url);
        await Fs.promises.writeFile(localIndexPath, JSON.stringify(assetIndex), { encoding: "utf8" });
        return assetIndex;
    }

    public async download(version:string):Promise<McAssetRepository>
    {
        const versionManifest = await getVersion(version, this.downloader).catch(reason => {
            console.log(reason);
            throw reason;
        });
        const assetIndex = await this.getAssetIndexManifest(versionManifest);

        let i = 0;
        const files = Object.keys(assetIndex.objects);
        for(const file of files)
        {
            i++;
            const asset = assetIndex.objects[file];
            const localPath = Path.join(this.repositoryPath, "objects", asset.hash.substr(0, 2), asset.hash);
            const remotePath = `https://resources.download.minecraft.net/${asset.hash.substr(0, 2)}/${asset.hash}`;
            if(Fs.existsSync(localPath))
            {
                const hash = await Hasha.fromFile(localPath, { algorithm: 'sha1' });
                if(hash === asset.hash)
                {
                    console.log(`Skipping existing file: ${file} (${i} / ${files.length})`);
                    continue;
                }
                console.error(`Invalid hash for ${file}, expected ${asset.hash}, found ${hash}`);
            }

            console.log(`Downloading ${file} ... (${i} / ${files.length})`);
            await this.downloader.downloadFileTo(remotePath, localPath);
        }

        const logFile = versionManifest.logging.client.file;
        const localLogFileName = Path.join(this.repositoryPath, "log_configs", logFile.id);
        if(!Fs.existsSync(localLogFileName) || (await Hasha.fromFile(localLogFileName, { algorithm: "sha1" })) !== logFile.sha1)
        {
            Fs.mkdirSync(Path.dirname(localLogFileName));
            this.downloader.downloadFileTo(logFile.url, localLogFileName);
        }

        return this;
    }

    public static async at(repositoryPath:string, downloader:IDownloader):Promise<McAssetRepository>
    {
        const repo = new McAssetRepository(repositoryPath, downloader);
        return repo;
    }
}