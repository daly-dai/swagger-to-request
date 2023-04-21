import { generateRequestBody } from './generate/generateRequestBody';
import { generateTypes } from './generate/generateTypes';

// import axios, { AxiosResponse } from 'axios'
// import superagent from 'superagent'
import request from 'request'
import { setTargetFolder } from './utils';
import { Config, SwaggerDocType, Tags } from './type';

const generateRequest = async (config: Config) => {
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

  // try {
  result = await request.get(url, { json: true }, (error, response, body: SwaggerDocType) => {
    if (error) {
      return console.log(error);
    }

    if (!Object.keys(body)?.length) return;

    const { definitions = {}, tags, paths } = body || {};

    const definitionsMap = generateTypes(definitions || {}, config);

    const globalTags = tags.map((item: Tags) => ({ ...item, serviceStr: '', importType: [] }))

    generateRequestBody({ paths: paths || {}, globalTags, config, definitionsMap })

  })
}

export { generateRequest }