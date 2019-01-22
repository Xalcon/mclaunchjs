import Path from "path";

export function getDefaultMinecraftDir()
{
    switch(process.platform)
    {
        case "win32": return Path.resolve('%APPDATA%\\.minecraft'.replace(/%([^%]+)%/g, (_,n) => process.env[n]!));
        case "linux": return Path.resolve('~/.minecraft');
        case "darwin": return Path.resolve("~/Library/Application Support/minecraft");
    }
}