interface file {
  path: string;
}

export function getFilePath(file: file) {
  const filePath = file.path;
  const fileSplit = filePath.split("\\");

  return `${fileSplit[2]}/${fileSplit[3]}`;
}
