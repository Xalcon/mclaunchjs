import { IDownloader } from "./downloader";

export class McLibraryRepository
{
    private constructor(private libraryPath:string, private downloader:IDownloader)
    {

    }

    public static async at(libraryPath: string, downloader: IDownloader): Promise<McLibraryRepository> {
        return new McLibraryRepository(libraryPath, downloader);
    }

    public async download(version: string): Promise<McLibraryRepository>
    {
        

        return this;
    }
}