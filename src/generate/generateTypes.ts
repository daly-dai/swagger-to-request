import { SERVICE_TYPES_NAME } from "../static";
import { Config, DftItem, ResultDefinitionType, StrObj, Vo } from "../type";
import { formateTypesName, getTargetFolderPath, getType } from "../utils";
import fs from 'fs'

const getDefinitionType = (prop: string, definition: Vo): ResultDefinitionType => {
  const cleanProp = formateTypesName(prop)

  let typesContent = `export interface ${cleanProp} {\n`
  const properties = definition?.properties || {};
  const required = definition?.required || [];

  Object.keys(properties).forEach((p: string) => {
    const detail = properties[p]
    const cur = getType(detail)
    let requiredSymbol = '?'

    // 根据required字段设置是否必须
    if (required?.length && required.includes(p)) {
      requiredSymbol = ''
    }


    if (detail.description) {
      typesContent += `  /** ${detail.description} */\n`
      typesContent += `  ${p}${requiredSymbol}: ${cur}\n\n`
    } else {
      typesContent += `  ${p}${requiredSymbol}: ${cur}\n`
    }
  })

  typesContent += `}\n\n`

  return { name: cleanProp, typesContent }
}

/**
 * @description 生成类型文件
 * @param definitions 
 */
export function generateTypes(definitions: DftItem, config: Config): StrObj {
  const definitionsMap: { [key in string]: string } = {}
  let dftStr = '';

  Object.keys(definitions).forEach((prop: string) => {
    const curValue = definitions[prop];

    if (curValue.type === 'object') {

      const { name, typesContent } = getDefinitionType(prop, definitions[prop])

      dftStr += typesContent
      definitionsMap[name] = typesContent
    }
  })

  fs.writeFile(`${getTargetFolderPath(config)}/${SERVICE_TYPES_NAME}.ts`, dftStr, (err: any) => {
    if (err) throw err;
    console.log(`newTypes.ts is created successfully`)
  })

  return definitionsMap
}