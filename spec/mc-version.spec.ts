import "jasmine";
import { McVersion } from "../src/modules/minecraft"
import { MinecraftVersion } from "../src/modules/minecraft/mojang";

describe("retrieve list of mc version", () => {
    it(`should contain 1.12.2`, async () => {
        const list = await McVersion.getVersionList();
        expect(list).toBeDefined();
        expect(list.versions).toBeDefined();
        expect(list.versions.find(v => v.id == "1.12.2")).toBeDefined();
    });
});

describe("parse vanilla version.json", () => {
    let version:MinecraftVersion.Manifest;

    beforeAll(async (done:DoneFn) => 
    {
        version = await McVersion.getManifest("1.12.2");
        done();
    });

    it("should have libraries", () => expect(version.libraries).toBeDefined("no libraries found"))
    it("should have 39 libraries", () => expect(version.libraries.length).toBe(39, "library count mismatch"))
});

describe("parse forge version.json", () => {
    let version:MinecraftVersion.Manifest;

    beforeAll(async (done:DoneFn) => 
    {
        version = await McVersion.getManifest(`file://${__dirname}/forge-1.12.2.json`);
        done();
    });
});