import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (content) => {
    const object = { content, votes: 0 }
    const response = axios.post(baseUrl, object)
    return response.data
}

const update = async (anecdote) => {
    const { id } = anecdote
    const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1 }
    const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
    return response.data
}

export default { getAll, create, update }