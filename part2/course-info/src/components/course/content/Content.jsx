const Content = (promps) => {
    return (
      <div>
        {promps.course.parts.map(part=> 
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>  
          )}
      </div>
    )
};

export default Content 