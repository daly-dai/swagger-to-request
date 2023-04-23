import { generateRequest } from '../src/index'

generateRequest({
  url: 'http://localhost:8000/default_OpenAPI.json',
  output: './test/service'
})