export interface Config {
  url: string;
  output: string;
  templates?: string;
  requestStr?: string;
  customFunBody?: (body: {
    // get请求传参
    queryStr: string;
    // post请求传参类型
    bodyStr: string;
    // 数据返回类型
    resType: string | undefined;
    // 请求地址
    requestUrl: string;
    // 请求方法名称
    serviceName: string;
    // 请求类型
    fetchMethod: Method
  }) => string
}

export interface Tags {
  name: string;
  description?: string;
  value?: string
}

export interface ParamsInfo {
  name: string;
  in: 'query' | 'path' | 'body';
  description: string;
  required: boolean;
  type: string;
  schema: IntegratedType;
}

export interface IntegratedType {
  $ref?: string;
  type?: string;
  items?: {
    $ref: string;
  }
}

export interface NormalRes {
  description: string;
  schema: IntegratedType
}

export interface MethodItem {
  tags: string[];
  summary: string;
  description: string;
  parameters: ParamsInfo[]
  responses: {
    "200": NormalRes
  }
}

export interface PathItem {
  [method: string]: MethodItem
}

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';

export type Paths = {
  [path in Method]: PathItem;
};

export interface VoProp {
  type: string;
  description: string;
  items?: IntegratedType;
  $ref?: string;
}

export interface Vo {
  type: string;
  required?: string[];
  properties: {
    [prop: string]: VoProp
  }
}

export interface DftItem {
  [vo: string]: Vo
}

export interface SwaggerDocType {
  swagger: string;
  basePath: string;
  tags: Tags[];
  paths: Paths;
  definitions: DftItem
}

export interface ConvertItem {
  name: string;
  type?: string;
  required: boolean;
}

export interface GlobalFileTag extends Tags {
  serviceStr: string;
  importType: string[];
}

export type StrObj<T = string> = {
  [key in string]: T
}
// 函数主体的请求体
export interface GenerateRequestBody {
  paths: Paths;
  globalTags: GlobalFileTag[];
  config: Config,
  definitionsMap: StrObj
}


export interface ResultDefinitionType {
  name: string;
  typesContent: string
}