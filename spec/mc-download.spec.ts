import "jasmine";
import { McVersion, McAssetRepository } from "../src/modules/minecraft"
import Fs from "fs";
import Path from "path";

describe("testsuite for setting up a minecraft instance", () => {
    const version = "1.12.2";

    it(`should download assets`, async() => {
        const mcVersion = await McVersion.getManifest(version);
        expect(mcVersion).toBeDefined();
        expect(mcVersion.id).toEqual(version);

        const assetsDir = "temp/assets";
        let repo = await McAssetRepository.at(assetsDir);
        await repo.download(mcVersion);

        expect(Fs.readdirSync(Path.join(assetsDir, "objects")).length).toBeGreaterThan(100);
    }, 5 * 60 * 1000);

});