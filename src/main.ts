import { AxiosDownloader } from "./modules/downloader";
import { McAssetRepository } from "./modules/mc-asset-repository";
import { McLibraryRepository } from "./modules/mc-library-repository";
import { McVersion } from "./modules/mc-version";

const downloader = new AxiosDownloader((() => {
    if(process.env.socks_proxy)
    {
        const SocksProxyAgent = require("socks-proxy-agent")
        const httpsAgent = new SocksProxyAgent(process.env.socks_proxy)
        return require("axios").create({httpsAgent})
    }
    return require("axios");
})());

(async () => 
{
    var minecraft = await McVersion.getManifest("1.12.2", downloader);
    var assetRepo = await (await McAssetRepository.at("temp/assets", downloader)).download(minecraft);
    var libRepo = await (await McLibraryRepository.at("temp/libraries", downloader)).download(minecraft);
})();


