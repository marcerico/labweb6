const credentials = require('./credentials.js')
const request = require('request')

const express = require('express')
const path = require('path')
const app = express()

const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))
//const readline = require('readline')

/*const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
*/
/*rl.question('Cual es tu ciudad? ', function(cityName) {
mapBoxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=pk.eyJ1IjoibWFyY2VhIiwiYSI6ImNqdDU1a2J4NjAyd3E0OW82dGgyZ3hrOGwifQ.kWfpX9XEukAPmNXY_qabdA`
  getCoordinates(cityName)
  rl.close();
});
*/

//Voy a revisar errores offline, input equivocado y APIKEY incorrecta

const cityName = 'Monterrey'

function getWeather(latitude,longitude,callback){
const url = `https://api.darksky.net/forecast/${credentials.DARK_SKY_SECRET_KEY}/${latitude},${longitude}?lang=es&units=si`;
  request({url : url , json : true},function(error,response){

    if(error){
      callback('Youre offline',undefined)
    }
    else if(response.statusCode === '403'){
      callback('Invalid Key',undefined)
    }
    else if(response.statusCode === '400'){
      callback('Bad Request',undefined)
    }
    else{
    /  const data = response.body
      const weather ={
      day : data.summary,
      temperature:  data.temperature,
      precipitation_prob: (data.precipProbability)*100
      }
      const info = `Hoy ${weather.day}. El clima está a ${weather.temperature} grados Celsius. La probabilidad de que llueva es de ${weather.precipitation_prob}%`
      console.log(info)
    }
  })
}


function getCoordinates(cityName,callback){
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+cityName+'.json?access_token='+credentials.MAPBOX_TOKEN
  if(error){
    callback('Youre offline',undefined)
  }
  else if(response.statusCode === '403'){
    callback('Invalid Key',undefined)
  }
  else if(response.body.features = ' '){
    callback('Invalid City',undefined)
  }

  request({url: url , json: true},function(error,response){
      const data = response.body.features[0]
      getWeather(data.center[0],data.center[1])
  })
}

app.get('/weather',function(req,res){
  if(!req.query.search){
    return res.send({
        error: 'Error. No city with such name'
    })
  }
  getCoordinates(req.query.search,function(error,coordinates){
    if(error){
      return res.send({
        error: error
      })
    }
    getWeather(response, req.query.search,function(error,response){
      if(error){
        return res.send({
          error: error
        })
      }
      else{
        res.send(response)
      }
    })
  }
})
app.get('*', function(req,res){
    res.send({
        error: 'This route does not exist'
    })
})

app.listen(3000,function() {
  console.log('Up and Running')
})

module.exports = {
  getCoordinates: getCoordinates,
  getWeather : getWeather
}
