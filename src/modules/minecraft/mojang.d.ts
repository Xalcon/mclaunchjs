export module MinecraftVersionList {
    export interface LatestVersions {
        release: string;
        snapshot: string;
    }
    
    export interface ReleaseVersion {
        id: string;
        type: string;
        url: string;
        time: Date;
        releaseTime: Date;
    }
    
    export interface Manifest {
        latest: LatestVersions;
        versions: ReleaseVersion[];
    }
}

export module MinecraftVersion {
    export interface Manifest {
        assetIndex?: AssetIndex;
        assets?: string;
        downloads: Downloads;
        id: string;
        libraries?: Library[];
        logging?: Logging;
        mainClass?: string;
        minecraftArguments?: string;
        minimumLauncherVersion: number;
        releaseTime?: Date;
        time?: Date;
        type?: string;

        inheritsFrom?:string;
        jar?:string;
    }

    export interface AssetIndex {
        id: string;
        sha1: string;
        size: number;
        totalSize: number;
        url: string;
    }

    export interface GameDownload {
        sha1: string;
        size: number;
        url: string;
    }
    
    export interface Downloads {
        client: GameDownload;
        server: GameDownload;
    }

    export interface LogFileSettings {
        id: string;
        sha1: string;
        size: number;
        url: string;
    }

    export interface LogSettings {
        argument: string;
        file: LogFileSettings;
        type: string;
    }

    export interface Logging {
        client: LogSettings;
    }

    export interface ArtifactFile {
        path: string;
        sha1: string;
        size: number;
        url: string;
    }

    export interface ArtifactDownloadInfo {
        artifact?: ArtifactFile;
        classifiers?: Record<string, ArtifactFile>;
    }

    export interface OperatingSystem {
        name: string;
    }

    export interface Rule {
        action: string;
        os: OperatingSystem;
    }

    export interface Extract {
        exclude: string[];
    }

    export interface Natives {
        linux?: string;
        osx?: string;
        windows?: string;
    }

    export interface Library {
        downloads?: ArtifactDownloadInfo;
        name: string;
        rules?: Rule[];
        extract?: Extract;
        natives?: Natives;

        checksums?: string[],
        url?: string;
        serverreq?: boolean;
        clientreq?: boolean;
    }
}

export module MinecraftAssetIndex {
    export interface Asset {
        hash:string,
        size:number
    }
    export interface Manifest {
        objects: Record<string, Asset>
    }
}