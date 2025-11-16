import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const controller = new AbortController()
    const url = `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`

    axios
      .get(url, { signal: controller.signal })
      .then(response => {
        setCountry({ data: response.data, found: true })
      })
      .catch(error => {
        // ignore aborts
        if (error.name === 'CanceledError' || error.message === 'canceled') return
        // 404 from API -> not found
        if (error.response && error.response.status === 404) {
          setCountry({ found: false })
          return
        }
        // other errors: log and set not found
        console.error(error)
        setCountry({ found: false })
      })

    return () => controller.abort()
  }, [name])
  
  return country
} 

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}