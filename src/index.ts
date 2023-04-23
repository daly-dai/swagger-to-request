import { generateRequestBody } from './generate/generateRequestBody';
import { generateTypes } from './generate/generateTypes';

import superagent from 'superagent'
import { setTargetFolder } from './utils';
import { Config, generateRequest, Tags } from './type';

const generateRequest: generateRequest = async (config: Config) => {
  let result!: any;

  const { url = '', output } = config;

  if (!url) {
    throw new Error("缺少必要字段url")
  }

  if (!output) {
    throw new Error("缺少必要字段 output")
  }

  // 创建指定文件夹
  setTargetFolder(config)

  try {
    result = await superagent.get(url) as any
  } catch (error) {
    console.error(error)
    return
  }

  const { body } = result;

  if (!Object.keys(body)?.length) return;

  const { definitions = {}, tags, paths } = body || {};

  const definitionsMap = generateTypes(definitions || {}, config);

  const globalTags = tags.map((item: Tags) => ({ ...item, serviceStr: '', importType: [] }))

  generateRequestBody({ paths: paths || {}, globalTags, config, definitionsMap })
}

export { generateRequest }