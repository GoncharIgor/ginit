import * as fs from 'fs';
import * as  path from 'path';

export const directoryExists = (filePath) => {
    return fs.existsSync(filePath);
}

export const getCurrentDirectoryBase = () => {
    return path.basename(process.cwd());
}
