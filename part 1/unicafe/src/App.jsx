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

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text='Good'/>
            <Button onClick={handleNeutralClick} text='Neutral'/>
            <Button onClick={handleBadClick} text='Bad'/>
            <Statistics
                good={good}
                neutral={neutral}
                bad={bad}
                total={total}
                average={average}
                positive={positive}
            />
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
            <p>good {props.good}</p>
            <p>neutral {props.neutral}</p>
            <p>bad {props.bad}</p>
            <p>all {props.total}</p>
            <p>average {props.average}</p>
            <p>positive {props.positive}%</p>
        </div>
    )
}

export default App