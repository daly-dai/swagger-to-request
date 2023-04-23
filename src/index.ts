import { generateRequestBody } from './generate/generateRequestBody';
import { generateTypes } from './generate/generateTypes';

import superagent from 'superagent'
import { setTargetFolder } from './utils';
import { Config, GenerateRequest, Tags } from './type';

const generateRequest: GenerateRequest = async (config: Config) => {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
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
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
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