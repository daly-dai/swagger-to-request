import { CONVERT_TYPE_MAP, TARGET_FOLDER } from './static';
import { Config, IntegratedType, VoProp } from './type';

import fs from 'fs';

export const capitalizedWord = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const lowerWord = (word: string): string =>
  word.charAt(0).toLowerCase() + word.slice(1);

/**
 * @description 横线转换成驼峰
 * @param str
 * @returns
 */
export function getCamelCase(str: string) {
  return str.replace(/-([a-z])/g, function (all, i) {
    return capitalizedWord(i);
  });
}

export const handleRefType = (str: string): string | undefined =>
  str.split('/')?.pop()?.replace(/«/g, '')?.replace(/»/g, '');

export const getType = (
  typeObj?: IntegratedType | VoProp,
): string | undefined => {
  if (typeObj?.type) {
    const typeTmp =
      CONVERT_TYPE_MAP[typeObj.type as keyof typeof CONVERT_TYPE_MAP];
    if (typeTmp === undefined && typeObj.type === 'array') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return getArrayType(typeObj);
    } else {
      return typeTmp;
    }
  }

  if (typeObj?.$ref) {
    return handleRefType(typeObj?.$ref);
  }
  return undefined;
};

export const getArrayType = (detail: IntegratedType | VoProp) => {
  const typeRes = getType(detail.items);
  if (typeRes) {
    return `${typeRes}[]`;
  } else {
    return undefined;
  }
};

export const getCmdPath = (path: string, outPutPath?: string) => {
  let result!: string;

  if (!outPutPath) {
    result += process.cwd();
  }

  result += outPutPath;

  return result;
};

export const formateTypesName = (name: string) => {
  if (!name) return name;

  return name
    .replace(/\[/g, '')
    .replace(/\]/g, '')
    .replace(/»/g, '')
    .replace(/«/g, '')
    .replace(/,/g, '');
};

/**
 * @description 获取生成文件夹的目标路径
 * @param config
 * @returns
 */
export function getTargetFolderPath(config: Config): string {
  const pathName = config.output.split('/').pop();
  const output = config.output as string;

  if (pathName === TARGET_FOLDER) return config.output;

  const outputList = output.split('');

  if (outputList[outputList.length - 1] === '/') {
    return output + TARGET_FOLDER;
  }

  return output + '/' + TARGET_FOLDER;
}

export function setTargetFolder(config: Config) {
  const path = getTargetFolderPath(config);

  if (!fs.existsSync(config?.output || '')) {
    throw (`${config?.output}文件路径不存在`)
  }

  if (fs.existsSync(path)) return;

  fs.mkdir(path, (err) => {
    if (err) throw err; // 如果出现错误就抛出错误信息

    console.log('文件夹创建成功');
  });
}
