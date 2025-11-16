import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/index'

const CreateNew = (props) => {

    const navigate = useNavigate()

    const contentField = useField('text')
    const authorField = useField('text')
    const infoField = useField('text')
  
    const handleSubmit = (e) => {
      e.preventDefault()
      props.addNew({
        content: contentField.inputProps.value,
        author: authorField.inputProps.value,
        info: infoField.inputProps.value,
        votes: 0
      })
      navigate('/')
    }

    const handleReset = (e) => {
        e.preventDefault()
        contentField.reset()
        authorField.reset()
        infoField.reset()
    }
  
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div>
            content
            <input name='content' {...contentField.inputProps}   />
          </div>
          <div>
            author
            <input name='author' {...authorField.inputProps} />
          </div>
          <div>
            url for more info
            <input name='info' {...infoField.inputProps} />
          </div>
          <button type='submit'>create</button>
          <button type='reset'>reset</button>
        </form>
      </div>
    )
  }

export default CreateNew