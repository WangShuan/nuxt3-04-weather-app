interface weatherElement {
  elementName: string,
  time: [
    {
      startTime: string,
      endTime: string,
      parameter: {
        parameterName: string,
        parameterValue: string
      }
    }
  ]
}

interface Response {
  success: boolean,
  result: object,
  records: {
    datasetDescription: string,
    location: [
      {
        locationName: string,
        weatherElement: weatherElement[]
      }
    ]
  }
}

interface WeatherData {
  name: string,
  startTime: string,
  endTime: string,
  MinT: string,
  MaxT: string,
  CI: string,
  PoP: string,
  Wx: string
}

interface WeatherCondition {
  condition: string,
  weatherImg: string,
  bgimg: string
}


interface ResError {
  data: object,
  message: string,
  statusCode: number,
  statusMessage: string
}