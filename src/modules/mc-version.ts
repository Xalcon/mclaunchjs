import { IDownloader } from "./downloader";
import { MinecraftVersionList, MinecraftVersion } from "./mojang";
import isUrl = require("is-url");

export class McVersion
{
    private static versionListManifest?:MinecraftVersionList.Manifest;

    public static async getVersionList(downloader: IDownloader)
    {
        return this.versionListManifest
           || (this.versionListManifest = await downloader.getJson<MinecraftVersionList.Manifest>("https://launchermeta.mojang.com/mc/game/version_manifest.json"));
    }

    public static async lookupManifest(id:string, downloader: IDownloader) : Promise<MinecraftVersion.Manifest>
    {
        // here we could have some form of lookup for non-mojang versions and where to get their version.json
        // at the moment we only support mojang files

        const versionList = await this.getVersionList(downloader);
        const versionDef = versionList.versions.find(v => v.id == id);

        if(!versionDef) throw `Unable to find minecraft version ${id}`;
        return McVersion.getManifest(versionDef.url, downloader);
    }

    /**
     * Downloads and parses the version manifest for the given version
     * @param version Either an Url to the version.json or the id of a valid vanilla version
     * @param downloader IDownloader implementation
     */
    public static async getManifest(version: string, downloader: IDownloader): Promise<MinecraftVersion.Manifest>
    {
        const manifest = isUrl(version)
            ? await downloader.getJson<MinecraftVersion.Manifest>(version)
            : await this.lookupManifest(version, downloader);

        if(manifest.inheritsFrom)
        {
            const parentManifest = await this.lookupManifest(manifest.inheritsFrom, downloader);
            if(manifest.assetIndex) parentManifest.assetIndex = manifest.assetIndex;
            if(manifest.assets) parentManifest.assets = manifest.assets;
            if(manifest.logging) parentManifest.logging = manifest.logging;
            if(manifest.mainClass) parentManifest.mainClass = manifest.mainClass;
            if(manifest.minecraftArguments) parentManifest.minecraftArguments = manifest.minecraftArguments;
            if(manifest.releaseTime) parentManifest.releaseTime = manifest.releaseTime;
            if(manifest.time) parentManifest.time = manifest.time;
            if(manifest.type) parentManifest.type = manifest.type;
            if(manifest.jar) parentManifest.jar = manifest.jar;
            if(manifest.libraries)
            {
                if(parentManifest.libraries !== undefined)
                {
                    manifest.libraries.forEach(lib => {
                        if(parentManifest.libraries!.find(l => l.name === lib.name)) return;
                            parentManifest.libraries!.push(lib);
                    })
                }
                else
                {
                    parentManifest.libraries = manifest.libraries;
                }
            }

            parentManifest.inheritsFrom = undefined;
            return parentManifest;
        }
        return manifest;
    }
    
}