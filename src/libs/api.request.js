import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = config.baseUrl.dev

const service = new HttpRequest(baseUrl)
export default service
