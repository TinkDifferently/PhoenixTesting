import {promises as fs} from 'fs'
import * as path from 'path'

let paths: Array<string> = []

export async function searchFiles(folderName: string, isAbsolute: boolean = false) {
    const folderPath: string = isAbsolute ? folderName : `${await path.resolve("./.")}/src${folderName}`;
    const folderChildren = await fs.readdir(folderPath)

    for (const child of folderChildren) {
        const childPath = `${folderPath}/${child}`
        const childStats = await fs.lstat(childPath)

        if (childStats.isDirectory()) {
            await searchFiles(childPath)
        }

        if (childStats.isFile()) {
            const fullPathToFile = path.resolve(childPath)

            paths = [...paths, fullPathToFile]
        }

    }

    return paths
}
