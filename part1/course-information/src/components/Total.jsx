const Total = (promps) => {
    const total = promps.course.parts[0].exercises + promps.course.parts[1].exercises + promps.course.parts[2].exercises;
    return (
      <p>Number of exercises {total}</p>
    )
}

export default Total