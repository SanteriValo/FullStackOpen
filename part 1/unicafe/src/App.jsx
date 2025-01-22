import {useState} from 'react'

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const total = good + bad + neutral;

    const handleGoodClick = () => {
        const updatedGood = good + 1;
        setGood(updatedGood);
    }
    const handleNeutralClick = () => {
        const updatedNeutral = neutral + 1;
        setNeutral(updatedNeutral);
    }
    const handleBadClick = () => {
        const updatedBad = bad + 1;
        setBad(updatedBad);
    }

    let average = 0;
    if (total > 0) {
        average = (good - bad) / (good + neutral + bad);
    }

    let positive = 0;
    if (total > 0) {
        positive = (good / total) * 100;
    }

    let statisticsContent
    if (total === 0) {
        statisticsContent = <p>No feedback given</p>
    } else {
        statisticsContent = <Statistics
            good={good}
            neutral={neutral}
            bad={bad}
            total={total}
            average={average}
            positive={positive}
        />
    }

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text='Good'/>
            <Button onClick={handleNeutralClick} text='Neutral'/>
            <Button onClick={handleBadClick} text='Bad'/>
            {statisticsContent}
        </div>
    )
}

const Button = ({onClick, text}) => {
    return (
        <button onClick={onClick}>
            {text}
        </button>
    )
}

const Statistics = (props) => {
    return (
        <div>
            <h1>statistics</h1>
            <StatisticLine text="good" value={props.good} />
            <StatisticLine text="neutral" value={props.neutral} />
            <StatisticLine text="bad" value={props.bad} />
            <StatisticLine text="all" value={props.total} />
            <StatisticLine text="average" value={props.average} />
            <StatisticLine text="positive" value={props.positive} />
        </div>
    )
}

const StatisticLine = ({ text, value }) => {
    return (
        <p>
            {text}: {value}
        </p>
    )
}

export default App