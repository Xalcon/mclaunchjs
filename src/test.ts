import { McVersion, McLibraryRepository, McAssetRepository, McLauncher } from "./modules/minecraft"
import { MinecraftVersion } from "./modules/minecraft/mojang";
let version:MinecraftVersion.Manifest;

(async () => {
    try
    {
        version = await McVersion.getManifest(`http://xalcon.net/forge-1.12.2.json`);
        const assets = await McAssetRepository.at("temp/assets");
        const libs = await McLibraryRepository.at("temp/libraries");
        await assets.download(version);
        await libs.download(version);

        const launcher = new McLauncher(version, assets, libs);
        launcher.launch("temp", "-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump");
    }
    catch(error)
    {
        console.error(error);
    }
})();