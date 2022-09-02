import { getFileSystem } from 'browserfs';
import { FileFlag } from 'browserfs/dist/node/core/file_flag';
import { FileSystem } from 'browserfs/dist/node/core/file_system';

let fs: FileSystem;
getFileSystem(
  {
    fs: 'LocalStorage',
    options: {},
  },
  (e, fileSystem) => {
    if (e) {
      console.log(e);
    }
    if (fileSystem) {
      fs = fileSystem;
    }
  },
);

export const fileApi = {
  existFile: (name: string) => {
    return fs.existsSync('/' + name);
  },
  newFile: (name: string) => {
    let suffix = '';
    // 不存在同名文件
    if (!fs.existsSync('/' + name)) {
      fileApi.writeFile(name, '');
      return name;
    }
    // 存在同名文件，增加后缀
    for (let i = 1; fs.existsSync('/' + name + suffix); i++) {
      suffix = `(${i})`;
    }
    fileApi.writeFile(name + suffix, '');
    return name + suffix;
  },
  writeFile: (file: string, content: string) => {
    fs.writeFileSync('/' + file, content, null, FileFlag.getFileFlag('w+'), 0);
  },
  readFile: (file: string) => {
    try {
      const bytes: Uint8Array = fs.readFileSync(
        '/' + file,
        null,
        FileFlag.getFileFlag('r'),
      );
      return bytes.toString();
    } catch (e) {
      return '';
    }
  },
  renameFile: (fileName: string, newFileName: string) => {
    fs.renameSync('/' + fileName, '/' + newFileName);
  },
  deleteFile: (file: string) => {
    fs.unlinkSync('/' + file);
  },
  getFileList: () => {
    return fs.readdirSync('/');
  },
};
