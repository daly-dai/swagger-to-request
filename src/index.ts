import { generateRequestBody } from './generate/generateRequestBody';
import { generateTypes } from './generate/generateTypes';
import type {
  Config,
  SwaggerDocType,
  Tags,
} from './type'

import axios, { AxiosResponse } from 'axios'
import { setTargetFolder } from './utils';

async function generateRequest(config: Config) {
  let result!: AxiosResponse<SwaggerDocType, any>;

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
    result = await axios.get<SwaggerDocType>(url)
  } catch (error) {
    console.error(error)
    return
  }

  if (!Object.keys(result)?.length) return;

  const { data } = result;
  const { definitions = {}, tags } = data || {};

  const definitionsMap = generateTypes(definitions || {}, config);

  const globalTags = tags.map((item: Tags) => ({ ...item, serviceStr: '', importType: [] }))

  generateRequestBody({ paths: data?.paths || {}, globalTags, config, definitionsMap })
}

generateRequest({
  url: 'http://10.10.203.163:8081/crm-boot/v2/api-docs',
  output: "./src/service"
})

// export default generateRequest