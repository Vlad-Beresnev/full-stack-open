import Content from './content/Content'
import Header from './header/Header'
import Total from './total/Total'

const Course = (promps) => {

return (
  <div>
    <Header course={promps.course} />
    <Content course={promps.course} />
    <Total course={promps.course} />
  </div>
)
}


export default Course
