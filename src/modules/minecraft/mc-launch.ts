import { MinecraftVersion } from "./mojang";
import { McAssetRepository } from "./mc-asset-repository";
import { McLibraryRepository } from "./mc-library-repository";
import { version } from "punycode";

export class McLauncher
{
    constructor(private version:MinecraftVersion.Manifest, private assetRepo:McAssetRepository, private libRepo:McLibraryRepository)
    {
    }

    public launch(instanceDir:string, javaArgs:string)
    {
        if(!this.version.libraries || !this.version.assetIndex) throw "Version manifest invalid";

        const runJar = "";
        const nativeLibPath = this.libRepo.getNativeLibPath(this.version);
        const clientJar = "";
        const classPath = this.version.libraries.map(lib => this.libRepo.getPathTo(lib)).join(";").concat(runJar);
        const logConfigFile = "";

        const rtMcArgs:Record<string, string> = 
        {
            "auth_player_name": "",
            "auth_uuid": "",
            "auth_access_token": "",
            "user_type": "",
            "version_name": this.version.jar || this.version.id,
            "game_directory": instanceDir,
            "assets_root": this.assetRepo.getAssetDir(this.version),
            "assets_index_name": this.version.assetIndex.id
        };
        const mcArgs = this.version.minecraftArguments!.replace(/\$\{([^\}]+)\}/gi, (m, c) =>
        {
            return `"${rtMcArgs[c.toLowerCase()]}"`;
        });
        const run =
        [
            javaArgs,
            `-cp "${classPath}"`,
            `"-Dlog4j.configurationFile=${logConfigFile}"`,
            `"-Dminecraft.client.jar=${clientJar}"`,
            this.version.mainClass,
            mcArgs
        ].join(" ");

        console.log(run);
    }
}