import "jasmine";
import { McVersion } from "../src/modules/minecraft"

describe("retrieve list of mc version", () => {
    it(`should contain 1.12.2`, async () => {
        const list = await McVersion.getVersionList();
        expect(list).toBeDefined();
        expect(list.versions).toBeDefined();
        expect(list.versions.find(v => v.id == "1.12.2")).toBeDefined();
    });
});