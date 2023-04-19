# swagger-to-request

**swagger 自动生成 service 相关请求文件**

## 工具使用必传的参数为*url,output*

### 文档将会生成在 ${output}/swagger 文件夹中

```javascript
  // 默认使用
  import generateRequest from 'swagger-to-request';

  generateRequest({
    url:'http://test:8081/test-boot/v2/api-docs' // 文档的请求地址
    output:'./src/service' // 代码会生成在'./src/service/swagger中'
  })
```

## 可自定义请求的引用*requestStr*

**默认为 import {request} from '@umijs/max'**

```javascript
generateRequest({
  url: "http://test:8081/test-boot/v2/api-docs", // 文档的请求地址
  output: "./src/service", // 代码会生成在'./src/service/swagger中'
  requestStr: "import axios from 'axios'",
});
```

## 可自定义请求体

```javascript
generateRequest({
  url: "http://test:8081/test-boot/v2/api-docs", // 文档的请求地址
  output: "./src/service", // 代码会生成在'./src/service/swagger中'
  requestStr: "import axios from 'axios'",
  customFunBody: ({
    queryStr, //get请求传参
    bodyStr, // post请求传参类型
    resType, // 数据返回类型
    requestUrl, // 请求地址
    serviceName, // 请求方法名称
    fetchMethod, // 请求类型
  }): string => {
    return `export const ${serviceName} = (${
      queryStr ? "params: " + queryStr : ""
    } ${
      bodyStr ? "data:" + bodyStr : ""
    }) => axios.${fetchMethod}<${resType}>(\`${requestUrl}\`, {${
      queryStr ? " params, " : " "
    }${bodyStr ? "data" : ""} })\n\n`;
  },
});

// 默认生成代码未
import { request } from "@umijs/max";

export const testBootApprovalApprovalByPost = (data: ApprovalDTO) =>
  request < R > (`/crm-boot/approval/approval`, { method: "post", data });

// 自定义配置之后生成代码未
import axios from "axios";

export const crmBootRegionListByPost = (data: RegionSearchDTO) =>
  axios.post < RListRegionVO > (`/test-boot/region/list`, { data });
```
