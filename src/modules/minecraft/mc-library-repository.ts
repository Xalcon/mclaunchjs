import { IDownloader, DefaultDownloader } from "../downloader";
import { MinecraftVersion } from "./mojang";
import Path from "path";
import Fs from "fs";
import Hasha from "hasha";
import {mvnArtifact} from "../utils/maven";
import isUrl = require("is-url");

var DecompressZip = require('decompress-zip');

async function downloadArtifact(artifact:MinecraftVersion.ArtifactFile, libraryPath:string, downloader:IDownloader)
{
    const localPath = Path.join(libraryPath, artifact.path);
    if(Fs.existsSync(localPath) && (artifact.sha1 == "" || (await Hasha.fromFile(localPath, { algorithm: "sha1" })) == artifact.sha1))
    {
        console.log(`Skipping existing library ${Path.basename(artifact.path)}`);
        return;
    }

    console.log(`Downloading ${Path.basename(artifact.path)} from ${artifact.url}...`);
    await downloader.downloadFileTo(artifact.url, localPath);
}

export class McLibraryRepository
{
    private static mavenRepos:string[] = [ "https://libraries.minecraft.net/", "https://repo.maven.apache.org/maven2/" ];

    public static addMavenRepo(url:string)
    {
        if(!isUrl(url))
            throw "Malformed url";

        if(!this.mavenRepos.find(r => r == url))
            this.mavenRepos.push(url);
    }

    private constructor(private libraryPath:string, private downloader:IDownloader)
    {
    }

    public static async at(libraryPath: string, downloader: IDownloader = DefaultDownloader): Promise<McLibraryRepository> {
        return new McLibraryRepository(libraryPath, downloader);
    }

    public getNativeLibPath(version: MinecraftVersion.Manifest) : string
    {
        return Path.resolve(Path.join(this.libraryPath, "__native", version.jar || version.id));
    }
    
    public getPathTo(lib: MinecraftVersion.Library): string
    {
        const artifact = mvnArtifact(lib.name);
        const path = Path.join(this.libraryPath, artifact.path);
        /*if(!Fs.existsSync(path))
            throw "Lib not found locally: " + lib.name;*/

        return Path.resolve(path);
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

                            if(lib.extract)
                            {
                                const fullPath = Path.join(this.libraryPath, classifiedArtifact.path);
                                const unzipper = new DecompressZip(fullPath);
                                await new Promise((resolve, reject) =>
                                {
                                    unzipper.on('extract', resolve);
                                    unzipper.on('error', reject);
                                    unzipper.on('progress', (fileIndex:number, fileCount:number) =>
                                    {
                                        console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
                                    })

                                    unzipper.extract(
                                    {
                                        path: this.getNativeLibPath(version),
                                        filter: (f:any) => 
                                        {
                                            const path = f.path.replace(/\\/g, "/");
                                            return !lib.extract!.exclude.find(ex => path.startsWith(ex))
                                        }
                                    })
                                });
                            }
                        }
                    }
                }
            }
            else
            {
                const mvnArtifactInfo = mvnArtifact(lib.name);

                if(Fs.existsSync(Path.join(this.libraryPath, mvnArtifactInfo.path)))
                {
                    console.log(`Skipping existing library ${lib.name}`);
                    continue;
                }

                const errors:Record<string, string> = {};
                let success:boolean = false;
                for(const mavenBase of [lib.url].concat(McLibraryRepository.mavenRepos))
                {
                    if(!mavenBase || !isUrl(mavenBase)) continue;
                    
                    const artifact:MinecraftVersion.ArtifactFile = {
                        path: mvnArtifactInfo.path,
                        url: `${mavenBase}${mvnArtifactInfo.path}`,
                        sha1: lib.checksums && lib.checksums.length > 0 ? lib.checksums[lib.checksums.length - 1] : "" || "",
                        size: -1
                    };

                    try
                    {
                        await downloadArtifact(artifact, this.libraryPath, this.downloader);
                        success = true;
                        break;
                    }
                    catch { } // Pokemon exception, gotta catch them all.
                }

                if(!success)
                {
                    console.error(`unable to download library: ${lib.name}`);
                }
            }
        }

        return this;
    }
}