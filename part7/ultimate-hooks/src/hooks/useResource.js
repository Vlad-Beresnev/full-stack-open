import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
    const [resourse, setResourse] = useState([])

    useEffect(() => {
        axios.get(baseUrl)
            .then(res => {
                setResourse(res.data)
            })
    }, [baseUrl, setResourse])

    const create = async newObject => {
        const res = await axios.post(baseUrl, newObject)
        setResourse(resourse.concat(res.data))
    }

    const service = {
        create
    }

    return [
        resourse, service
    ]
}

export default useResource