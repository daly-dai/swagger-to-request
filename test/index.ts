import { generateRequest } from '../src/index'

generateRequest({
  url: 'http://127.0.0.1:8000/js-manage/api.json',
  output: './test/service'
})