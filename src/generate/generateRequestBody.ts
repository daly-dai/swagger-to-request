import { SERVICE_TYPES_NAME } from "../static"
import { ConvertItem, GlobalFileTag, Method, Paths, GenerateRequestBody, Config, StrObj } from "../type"
import { capitalizedWord, formateTypesName, getCamelCase, getTargetFolderPath, getType, lowerWord } from "../utils"
import fs from 'fs';

let globalConfig!: Config;
let globalTypesMap!: StrObj


const getServiceName = (path: string, fetchMethod: Method) => {
  const plist = path.split('/').map(item => getCamelCase(item)).filter(item => item)

  plist.push('by')
  plist.push(fetchMethod)

  plist.shift();

  return plist.map((item, index) => {
    let stashItem = item;
    // 去掉{}
    if (item.indexOf('{') >= 0) stashItem = item.slice(1, item.length - 1);

    if (index === 0) return stashItem

    return capitalizedWord(stashItem)
  }).join('')
}

const getParamsStr = (queryParams: ConvertItem[]) => {
  let paramsStr = ''

  queryParams.forEach((item, index) => {
    paramsStr += `${item.name}${item.required ? '' : '?'}: ${item.type}; `;
  })

  paramsStr && (paramsStr = `{${paramsStr}},`);

  return paramsStr
}

const convertPath = (path: string) => {
  return path.split('/').map(item => {
    if (item.indexOf('{') >= 0) return `$${item}`

    return item
  }).join('/')
}

const getImportStr = (importType: string[]) => {
  let str!: string

  if (globalConfig?.requestStr) {
    str = globalConfig?.requestStr
  } else {
    str = `import { request } from '@umijs/max'\n\n`
  }

  importType.forEach((item, index) => {
    if (index === 0) {
      str += `import { `
    }

    str += `${formateTypesName(item)}, `
    if (index === importType.length - 1) {
      str += `} from './${SERVICE_TYPES_NAME}'\n\n`
    }
  })
  return str
}


export function dispatchRequestBody(paths: Paths, globalTags: GlobalFileTag[]) {
  // eslint-disable-next-line guard-for-in
  for (let prop in paths) {
    const content = paths[prop as Method]
    const methodsArr = Object.keys(content);

    for (let fetchMethod of methodsArr) {
      // 自动生成方法的名称，可后期改造
      const serviceName = getServiceName(prop, fetchMethod as Method)
      // 当前方法的主体配置
      const methodValueObj = content[fetchMethod!];
      const curTag = methodValueObj?.tags?.pop();


      let tagInfo = globalTags.find(item => item.name === curTag)

      if (!tagInfo) {
        tagInfo = {
          name: curTag || '',
          description: curTag || '',
          importType: [],
          serviceStr: ''
        }

        globalTags.push(tagInfo)
      }

      const normalResponse = methodValueObj.responses['200'] ? methodValueObj.responses['200'].schema : undefined
      const resType = getType(normalResponse)
      const queryParams = []
      const parameters = content[fetchMethod!].parameters || [];

      let bodyStr = ''

      for (let paramsItem of parameters) {
        const inValue = paramsItem.in;

        const convertItem = {
          name: paramsItem.name,
          type: getType(paramsItem),
          required: paramsItem.required,
        }


        // 收集需要导入的类型
        if (inValue === 'body') {
          // 只会有一个 body
          bodyStr = getType(paramsItem.schema)!
          continue
        }

        if (inValue === 'query') {
          // such as /users?role=admin
          queryParams.push(convertItem)
          continue
        }
      }

      const queryStr = getParamsStr(queryParams)

      let serviceStr = tagInfo?.serviceStr;


      if (globalTypesMap[bodyStr]) {
        serviceStr += `${globalTypesMap[bodyStr as string]}\n`
      }

      if (globalTypesMap[resType as string]) {
        serviceStr += `${globalTypesMap[resType as string]}\n`
      }



      serviceStr += `/**\n* @description ${methodValueObj?.description || ''}\n* @tags ${curTag}\n* @request ${fetchMethod}:${prop}\n*/\n`

      if (globalConfig?.customFunBody) {
        serviceStr += globalConfig?.customFunBody({
          queryStr,
          // post请求传参类型
          bodyStr,
          // 数据返回类型
          resType,
          // 请求地址
          requestUrl: convertPath(prop),
          // 请求方法名称
          serviceName,
          // 请求类型
          fetchMethod: (fetchMethod as Method)
        })
      } else {
        serviceStr += `export const ${serviceName} = (${queryStr ? 'params: ' + queryStr : ''} ${bodyStr ? 'data:' + bodyStr : ''}) => request<${resType}>(\'${convertPath(prop)}\', {method:'${fetchMethod}',${queryStr ? ' params, ' : ' '}${bodyStr ? 'data' : ''} })\n\n`
      }


      tagInfo!.serviceStr = serviceStr!
    }
  }

}

export function generateRequestBody({ paths, globalTags, config, definitionsMap }: GenerateRequestBody) {
  globalConfig = config;
  globalTypesMap = definitionsMap;

  dispatchRequestBody(paths, globalTags);

  globalTags.forEach(tagFile => {
    const name = tagFile?.value || tagFile.name;
    const fileName = lowerWord(name.replace(/\s*/g, '')) + '.ts'
    const dftStr = getImportStr(tagFile.importType) + tagFile.serviceStr
    fs.writeFile(`${getTargetFolderPath(config)}/${fileName}`, dftStr, (err: any) => {
      if (err) throw err;
      console.log(`${fileName} is created successfully`)
    })
  })
}