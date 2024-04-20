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
        content: contentField.value,
        author: authorField.value,
        info: infoField.value,
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
            <input name='content' type={contentField.type} value={contentField.value} onChange={contentField.onChange}   />
          </div>
          <div>
            author
            <input name='author' type={authorField.type} value={authorField.value} onChange={authorField.onChange} />
          </div>
          <div>
            url for more info
            <input name='info' type={infoField.type} value={infoField.value} onChange={infoField.onChange} />
          </div>
          <button type='submit'>create</button>
          <button type='reset'>reset</button>
        </form>
      </div>
    )
  }

export default CreateNew