export class MavenArtifact
{
    public readonly path:string;
    public readonly filename:string;

    constructor(readonly groupId:string, readonly artifact:string, readonly version:string, readonly classifier:string = "", readonly packaging:string = "jar")
    {
        this.filename = `${artifact}-${version}.${packaging}`;
        this.path = `${groupId.replace(/\./g, "/")}/${artifact}/${version}/${this.filename}`;
    }
}

export function mvnArtifact(coordinates:string)
{
    const [groupId, artifact, version, classifier] = coordinates.split(':');
    return new MavenArtifact(groupId, artifact, version, classifier || "");
}