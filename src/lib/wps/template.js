// if you need to add an input in the future, you can use the rest of the xml format of wps
export const xmlRequestTemplate = ({ identifier, outputName }) => `
<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
   <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${identifier}</ows:Identifier>
   <wps:DataInputs>  

   </wps:DataInputs>
   <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
         <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${outputName}</ows:Identifier>
      </wps:RawDataOutput>
   </wps:ResponseForm>
</wps:Execute>`

/* <wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">wps_read_gwslocations</ows:Identifier>
    <wps:DataInputs>

    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">jsonstations</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute> */
