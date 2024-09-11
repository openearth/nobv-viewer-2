import queryString from 'query-string'

// GeoServer - GetFeature Docs
// https://docs.geoserver.org/stable/en/user/services/wfs/reference.html#getfeature
export default function ({
  url,
  identifier,
  propertyName = null,
  filter = null,
  maxFeatures = null
}) {
  const params = {
    request: 'Execute',
    service: 'WPS',
    version: '2.0.0',
    outputFormat: 'json',
    identifier: identifier
    // TODO for the future: add datainputs to filter per projectnr. Example: datainputs=projectinfo={"projectnr":11206021}
  }

  if (filter) {
    params.CQL_FILTER = `${propertyName}='${filter}'`
  } else if (propertyName) {
    params.propertyName = propertyName
  }

  if (maxFeatures) {
    params.maxFeatures = maxFeatures
  }

  return `${url}?${queryString.stringify(params)}`
}
