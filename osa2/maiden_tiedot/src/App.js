import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({countries, setNewSearch}) => {
  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
      )
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => <p key={country.alpha2Code}>{country.name} <button onClick={() => setNewSearch(country.name)}>show</button></p>)}
      </div>
    )
  } else if (countries.length == 1) {
    return (
      <OneCountry country={countries[0]} />
    )
  } else {
    return (
      <p>No countries found</p>
    )
  }
}

const Weather = ({city}) => {
  const api_key = process.env.REACT_APP_WEATHER_API_KEY
  const [weather, setWeather] = useState("")

  useEffect(() => {
    axios
      .get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric&appid='+api_key)
      .then(response => {
        setWeather(response.data)
      })
  }, [])

  if (weather.length == 0) {
    return (
      <p></p>
    )
  } else {
    return (
      <div>
        <h3>Weather in {city}</h3>
        <p>Temperature {weather.main.temp} &#176;C</p>
        <img src={"http://openweathermap.org/img/wn/"+ weather.weather[0].icon +"@2x.png"} alt={weather.weather[0].description}></img>
        <p>{weather.weather[0].description}</p>
        <p>Wind {weather.wind.speed} m/s</p>
      </div>
    )
  }
}

const OneCountry = ({country}) => {
  return (
    <div>
      <h2>{country.name} ({country.nativeName})</h2>
      <p>Capital {country.capital}</p>
      <p>Area {country.area} km&#178;</p>
      <p>Popultaion {country.population}</p>
      <h4>Languages</h4>
      <ul>
        {country.languages.map(language => <li key={language.iso639_2}>{language.name} ({language.nativeName})</li>)}
      </ul>
      <br></br>
      <img src={country.flag} alt={"Flag of " + country.name} width="200px"></img>
      <Weather city={country.capital}/>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setNewSearch] = useState('')


  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase()))
  

  return (
    <div>
      filter shown with <input value={search} onChange={handleSearch}/>
      <Countries countries={countriesToShow} setNewSearch={setNewSearch}/>
    </div>
  )
}

export default App