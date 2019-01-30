import { McVersion, McLibraryRepository } from "./modules/minecraft"
import { MinecraftVersion } from "./modules/minecraft/mojang";
let version:MinecraftVersion.Manifest;

(async () => {
    try
    {
        version = await McVersion.getManifest(`http://xalcon.net/forge-1.12.2.json`);
        const repo = await McLibraryRepository.at("temp/libraries");
        await repo.download(version);
    }
    catch(error)
    {
        console.error(error);
    }
})();