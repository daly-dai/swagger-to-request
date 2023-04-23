import { generateRequest } from '../src/index'

generateRequest({
  url: 'http://10.10.203.163:8081/crm-boot/v2/api-docs',
  output: './test/service'
})