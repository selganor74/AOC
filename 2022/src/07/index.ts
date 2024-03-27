import { commands } from "./input";

class FileInfo {
    constructor(
        public fileName: string,
        public fileSize: number,
        public parentDir: DirectoryInfo | null = null
    ) { }

    print(depth: number = 0) {
        let spacer = "";
        for (let i = 0; i < depth; i++)
            spacer += " ";
        
        console.log(spacer + this.fileName.padEnd(20, " ") + " (" + (this.fileSize + "").padStart(10, " ") + ")");
    }
}

class DirectoryInfo {
    public dirSize: number = 0;
    public dirs: DirectoryInfo[] = [];
    public files: FileInfo[] = [];

    constructor(
        public dirName: string,
        public parentDir: DirectoryInfo | null = null
    ) { }

    addFile(newFile: FileInfo) {
        this.files.push(newFile);
        newFile.parentDir = this;
        this.dirSize += newFile.fileSize;
    }

    getFullSize(): number {
        let toReturn = this.dirSize;

        for (const d of this.dirs)
            toReturn += d.getFullSize();

        return toReturn;
    }

    print(depth: number = 0) {
        let spacer = "";
        for (let i = 0; i < depth; i++)
            spacer += " ";
        console.log(spacer + this.dirName.padEnd(20, " ") + "   [" + this.dirSize + "] / [" + this.getFullSize() + "]");
        for(const file of this.files) {
            file.print(depth + 1);
        }
        for(const dir of this.dirs) {
            dir.print(depth + 1);
        }
    }

    getDirectoriesAtMost10000(toReturn: DirectoryInfo[] = []): DirectoryInfo[] {
        if(this.getFullSize() <= 100000) {
            toReturn.push(this);
        }
        for(const dir of this.dirs) {
            dir.getDirectoriesAtMost10000(toReturn);
        }
        return toReturn;
    }

    getSmallestDirectoryToFree30000000(toReturn: DirectoryInfo[] | null = null, actualFreeSpace = 0): DirectoryInfo | undefined {
        const isFirst = !toReturn;
        toReturn = toReturn || [];

        if (isFirst) {
            actualFreeSpace = 70000000 - this.getFullSize();
            console.log("actual free Space:                  " + actualFreeSpace);
            console.log("minimum to free:                     " + (30000000 - actualFreeSpace) );
        } 

        if (actualFreeSpace + this.getFullSize() > 30000000 ) {
            toReturn.push(this);
        }
    
        for(const dir of this.dirs) {
            dir.getSmallestDirectoryToFree30000000(toReturn, actualFreeSpace);
        }

        if (isFirst)
            return toReturn.sort((a,b) => Math.sign(a.getFullSize() - b.getFullSize()))[0];
    }
}

class BuiltFileSystem {
    currentDirectory: DirectoryInfo;
    commandPtr: number = 0;
    rootDirectory: DirectoryInfo = new DirectoryInfo("/");

    constructor() {
        this.currentDirectory = this.rootDirectory;
    }

    addDirectory(newDir: DirectoryInfo) {
        this.currentDirectory.dirs.push(newDir);
        newDir.parentDir = this.currentDirectory;
    }

    cd(dirName: string) {
        if (dirName.startsWith("/"))
            this.currentDirectory = this.rootDirectory;

        const path = dirName.split("/");
        for (const dir of path) {
            if (!dir)
                continue;
            if (dir === "..") {
                if (!this.currentDirectory.parentDir)
                    throw new Error("Unable to move to parent from " + this.currentDirectory.dirName);

                this.currentDirectory = this.currentDirectory.parentDir;
                continue;
            }
            const nextDir = this.currentDirectory.dirs.find(d => d.dirName === dir);
            if (!nextDir) {
                throw new Error("Directory " + dir + " not found in path " + dirName);
            }
            this.currentDirectory = nextDir;
        }
    }
}

function fileSystemBuilder(commands: string) {
    const allCommands = commands.split("\n");
    const builderStatus = new BuiltFileSystem();
    builderStatus.commandPtr = -1;
    while (builderStatus.commandPtr < allCommands.length - 1) {
        builderStatus.commandPtr++;
        const command = allCommands[builderStatus.commandPtr];
        const tokens = command.split(" ");
        switch (tokens[0]) {
            case "$": {
                switch (tokens[1]) {
                    case "cd":
                        builderStatus.cd(tokens[2]);
                        break;
                    case "ls":
                        while (builderStatus.commandPtr < allCommands.length - 1) {
                            builderStatus.commandPtr++;
                            const row = allCommands[builderStatus.commandPtr];
                            const rowTokens = row.split(" ");
                            if (rowTokens[0] === "$") {
                                builderStatus.commandPtr--;
                                break;
                            }
                            if (rowTokens[0] === "dir") {
                                builderStatus.addDirectory(new DirectoryInfo(rowTokens[1]));
                                continue;
                            }
                            // ... otherwise is a file.
                            const fileSize = Number.parseInt(rowTokens[0]);
                            const fileName = rowTokens[1];
                            builderStatus.currentDirectory.addFile(new FileInfo(fileName, fileSize));
                        }
                        break;
                }
            }
        }
    }
    return builderStatus;
}

const fileSystem = fileSystemBuilder(commands);
// fileSystem.rootDirectory.print();
const allDirs = fileSystem.rootDirectory.getDirectoriesAtMost10000();
const totalSize = allDirs.map(d => d.getFullSize()).reduce((p, c) => p + c, 0);
console.log("Total Size of directories whose full size is at most 100000: " + totalSize);
const smallestDirToFree30000000 = fileSystem.rootDirectory.getSmallestDirectoryToFree30000000();
console.log("Smallest dir to Delete: " + smallestDirToFree30000000?.dirName + " size: " + smallestDirToFree30000000?.getFullSize() );