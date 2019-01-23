import { IDownloader } from "./downloader";
import { MinecraftVersionList, MinecraftVersion } from "./mojang";
import isUrl from "is-url";
import { CompositeMcVersionManifest } from "./composite-mc-version-manifest";


async function lookupManifest(id:string, downloader: IDownloader) : Promise<MinecraftVersion.Manifest>
{
    // here we could have some form of lookup for non-mojang versions and where to get their version.json
    // at the moment we only support mojang files

    const versionList = await McVersion.getVersionList(downloader);
    const versionDef = versionList.versions.find(v => v.id == id);

    if(!versionDef) throw `Unable to find minecraft version ${id}`;
    return McVersion.getManifest(versionDef.url, downloader);
}

export class McVersion
{
    private static versionListManifest?:MinecraftVersionList.Manifest;

    public static async getVersionList(downloader: IDownloader)
    {
        return this.versionListManifest
           || (this.versionListManifest = await downloader.getJson<MinecraftVersionList.Manifest>("https://launchermeta.mojang.com/mc/game/version_manifest.json"));
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
            : await lookupManifest(version, downloader);

        if(manifest.inheritsFrom)
        {
            const parentManifest = await lookupManifest(manifest.inheritsFrom, downloader);
            return new CompositeMcVersionManifest(manifest, parentManifest);
        }
        return manifest;
    }
}