import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const api_key = import.meta.env.VITE_WEATHER_KEY
  const [value, setValue] = useState('')
  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [capital, setCapital] = useState('')

  const getAll = () => {
    const request = axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    return request.then(response => response.data)
  }

  
  
  useEffect(() => {
      getAll().then(data => setCountries(data))
      if (country && country.capital !== capital) {
        setCapital(country.capital);      }
  }, [country])


  const handleChange = (event) => {
    setValue(event.target.value)
    setCountry('')
  }

  const onSearch = (event) => {
    event.preventDefault()
  }
  
  const countriesToShow = value 
  ? countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()))
  : countries

  const showWeather = (city) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
    return request.then(response => response.data)
  }

  const ShowCountry = ({countries}) => {
    const [weather, setWeather] = useState('')

    useEffect(() => {
      if (countries[0]) {
        showWeather(countries[0].capital).then(data => setWeather(data));

      }
    }, [countries]);

    if (countries) {
      console.log(weather && weather.weather[0].icon)
      return (
        <div>
            <h1>{countries[0].name.common}</h1>
            <p>capital {countries[0].capital}</p>
            <p>area {countries[0].area}</p>
            <h3>Languages:</h3>
            <ul>
              {Object.values(countries[0].languages).map(lang => 
                <li key={lang}>{lang}</li>  
              )}
            </ul>
            <img src={countries[0].flags.png} alt={countries[0].name.common} width="200" height="200" />
            {weather && (
              <div>
                <h2>Weather in {countries[0].capital}</h2>
                <p>temperature {weather.main.temp} Celcius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                <p>wind {weather.wind.speed} m/s</p>
              </div>
            )}
          </div>
      )
    } 
  }

  const ShowResult = ({countries}) => {

      if (countries.length > 10) {
        return (
          <p>Too many matches, specify another filter</p>
      )
    } else if (countries.length === 1) {
      console.log(capital)
      return (
        <ShowCountry countries={countries} />
      )
    } else {
      console.log(capital)
      return (
        <div>
        {countries.map(country => 
          <p key={country.name.common}>
          {country.name.common} 
          <button onClick={() => setCountry(country)} id="show">show</button></p>
        )}
          {country && <ShowCountry countries={[country]} />}
        </div>
      )
    }
  }
  return (
    <div>
      <form onSubmit={onSearch}>
      <p>find countries <input value={value} onChange={handleChange} /></p>
      </form>
      <div>
        <ShowResult countries={countriesToShow} />
      </div>
    </div>
  )
}

export default App
