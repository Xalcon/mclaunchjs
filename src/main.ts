import { AxiosDownloader } from "./modules/downloader";
import { McAssetRepository } from "./modules/mc-asset-repository";
import { McLibraryRepository } from "./modules/mc-library-repository";
import { McVersion } from "./modules/mc-version";

process.env.socks_proxy = "socks://127.0.0.1:1081";

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
    var minecraft = McVersion.getManifest("", downloader);

    var assetRepo = await (await McAssetRepository.at("temp/assets", downloader)).download("1.12.2");
    var libRepo = await (await McLibraryRepository.at("temp/libraries", downloader)).download("1.12.2");
})();


