import {useState} from 'react'

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [total, setTotal] = useState(0)

    const handleGoodClick = () => {
        const updatedGood = good + 1;
        setGood(updatedGood);
        const updatedAll = updatedGood + neutral + bad;
        setTotal(updatedAll);
    }
    const handleNeutralClick = () => {
        const updatedNeutral = neutral + 1;
        setNeutral(updatedNeutral);
        const updatedAll = updatedNeutral + good + bad;
        setTotal(updatedAll);
    }
    const handleBadClick = () => {
        const updatedBad = bad + 1;
        setBad(updatedBad);
        const updatedAll = updatedBad + good + neutral;
        setTotal(updatedAll);
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
            <h1>statistics</h1>
            <p>good {good}</p>
            <p>neutral {neutral}</p>
            <p>bad {bad}</p>
            <p>all {total}</p>
            <p>average {average}</p>
            <p>positive {positive}%</p>
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

export default App