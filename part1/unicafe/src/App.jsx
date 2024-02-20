import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
    {text}
  </button>
    )
}

const calculateAverage = (good, neutral, bad, allClicks) => {
  if (allClicks === 0) {
    return 0
  }
  return (
    ((good * 1) + (neutral * 0) + (bad * -1)) / allClicks
  )
}

const calculatePositive = (good, allClicks) => {
  if (allClicks === 0) {
    return 0
  }
  return (
    good / allClicks * 100 + " %"
  )
}

const StatisticLineTable = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.allClicks == 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <table>
        <tbody>
        <StatisticLineTable text="good" value={props.good} />
        <StatisticLineTable text="neutral" value={props.neutral} />
        <StatisticLineTable text="bad" value={props.bad} />
        <StatisticLineTable text="all" value={props.allClicks} />
        <StatisticLineTable text="average" value={calculateAverage(props.good, props.neutral, props.bad, props.allClicks)} />
        <StatisticLineTable text="positive" value={calculatePositive(props.good, props.allClicks)} />    
        </tbody>
      </table>
    </div>
  )
  }

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(allClicks + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(allClicks + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(allClicks + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='nautral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} allClicks={allClicks} />
    </div>
  )
}

export default App
