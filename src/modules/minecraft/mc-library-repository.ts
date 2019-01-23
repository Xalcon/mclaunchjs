import { IDownloader } from "../downloader";
import { MinecraftVersion } from "./mojang";
import Path from "path";
import Fs from "fs";
import Hasha from "hasha";

async function downloadArtifact(artifact:MinecraftVersion.ArtifactFile, libraryPath:string, downloader:IDownloader)
{
    const localPath = Path.join(libraryPath, artifact.path);
    if(Fs.existsSync(localPath) && (await Hasha.fromFile(localPath, { algorithm: "sha1" })) == artifact.sha1)
    {
        console.log(`Skipping existing library ${Path.basename(artifact.path)}`);
        return;
    }

    console.log(`Downloading ${Path.basename(artifact.path)}...`)
    Fs.mkdirSync(Path.dirname(localPath), { recursive: true });
    await downloader.downloadFileTo(artifact.url, localPath);
}

export class McLibraryRepository
{
    private static mavenHosts:string[];

    private constructor(private libraryPath:string, private downloader:IDownloader)
    {
        McLibraryRepository.mavenHosts.push("https://libraries.minecraft.net/")
    }

    public static async at(libraryPath: string, downloader: IDownloader): Promise<McLibraryRepository> {
        return new McLibraryRepository(libraryPath, downloader);
    }

    public async download(version: MinecraftVersion.Manifest): Promise<McLibraryRepository>
    {
        if(!version.libraries) throw "MinecraftVersion Manifest does not contain a library section!";

        for(const lib of version.libraries)
        {
            if(lib.rules)
            {
                // check rules
            }

            if(lib.downloads)
            {
                if(lib.downloads.artifact)
                {
                    await downloadArtifact(lib.downloads.artifact, this.libraryPath, this.downloader);
                }

                if(lib.natives)
                {
                    let classifier;
                    switch(process.platform)
                    {
                        case "win32":
                            classifier = lib.natives.windows;
                            break;
                        case "linux":
                            classifier = lib.natives.linux;
                            break;
                        case "darwin":
                            classifier = lib.natives.osx;
                            break;
                    }

                    if(classifier && lib.downloads.classifiers)
                    {
                        const classifiedArtifact = lib.downloads.classifiers[classifier];
                        if(classifiedArtifact)
                        {
                            await downloadArtifact(classifiedArtifact, this.libraryPath, this.downloader);
                        }
                    }
                }

                if(lib.extract)
                {
                    
                }
            }
        }

        return this;
    }
}