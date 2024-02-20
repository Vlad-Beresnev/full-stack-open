const Content = (promps) => {
    return (
      <div>
        <p>{promps.course.parts[0].name} {promps.course.parts[0].exercises}</p>
        <p>{promps.course.parts[1].name} {promps.course.parts[1].exercises}</p>
        <p>{promps.course.parts[2].name} {promps.course.parts[2].exercises}</p>
      </div>
    )
};

export default Content 