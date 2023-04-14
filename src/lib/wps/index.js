import axios from 'axios'
import { xmlRequestTemplate } from './template'

export default function ({ identifier, functionid, data, outputName }) {
  const template = xmlRequestTemplate({ identifier, functionid, data, outputName })

  return axios({
    method: 'post',
    url: 'https://grondwater-ijmuiden.openearth.nl/wps?', // process.env.VUE_APP_WPS_URL
    data: template,
    headers: { 'Content-Type': 'application/xml' }
  }).then(({ data }) => {
    return typeof data === 'object' ? data : JSON.parse(data)
  })
}
