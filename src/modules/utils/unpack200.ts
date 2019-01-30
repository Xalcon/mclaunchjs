import Util from "util";
import Path from "path";
const exec = Util.promisify(require("child_process").exec);

export async function unpack200(filepath:string)
{
    const javaHome = "";
    const bin = Path.join(javaHome, "bin", "unpack200");
    const {stdout, stderr} = await exec(`"${bin}" `)
}