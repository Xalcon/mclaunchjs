import { MinecraftVersion } from "./mojang";

export class CompositeMcVersionManifest implements MinecraftVersion.Manifest
{
    constructor(private primary:MinecraftVersion.Manifest, private secondary:MinecraftVersion.Manifest) { }

    get assetIndex() { return this.primary.assetIndex || this.secondary.assetIndex; }
    get assets() { return this.primary.assets || this.secondary.assets; }
    get downloads() { return this.primary.downloads || this.secondary.downloads; }
    get id() { return this.primary.id; }
    get libraries ()
    {
        const pLibs = this.primary.libraries;
        const sLibs = this.secondary.libraries;
        if(pLibs)
        {
            if(sLibs)
            {
                const libs = pLibs.slice();
                for(const lib of sLibs)
                {
                    if(!libs.find(l => l.name == lib.name))
                        libs.push(lib);
                }
                return libs;
            }
            return pLibs;
        }
        else if(sLibs)
        {
            return sLibs;
        }
        return undefined;
    }
    
    get logging() { return this.primary.logging || this.secondary.logging; }
    get mainClass() { return this.primary.mainClass || this.secondary.mainClass; }
    get minecraftArguments() { return this.primary.minecraftArguments || this.secondary.minecraftArguments; }
    get minimumLauncherVersion() { return Math.max(this.primary.minimumLauncherVersion, this.secondary.minimumLauncherVersion); }
    get releaseTime() { return this.primary.releaseTime || this.secondary.releaseTime; }
    get time() { return this.primary.time || this.secondary.time; };
    get type() { return this.primary.type || this.secondary.type; }
    get inheritsFrom() { return this.primary.inheritsFrom || this.secondary.inheritsFrom; }
    get jar() { return this.primary.jar || this.secondary.jar; }
}