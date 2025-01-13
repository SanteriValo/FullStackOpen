const App = () => {
    const course = 'Half Stack application development'
    const partsAndExercises = [
        {name: 'Fundamentals of React', exercises: 10},
        {name: 'Using props to pass data', exercises: 7},
        {name: 'State of a component', exercises: 14}
    ]
    return (
        <div>
            <Header course={course}/>
            <Content partsAndExercises={partsAndExercises}/>
            <Total partsAndExercises={partsAndExercises}/>
        </div>
    )
}

const Header = (props) => {
    return <h1>{props.course}</h1>
}

const Content = ({partsAndExercises}) => {
    return (
        <div>
            <p>
                {partsAndExercises[0].name} {partsAndExercises[0].exercises}
            </p>
            <p>
                {partsAndExercises[1].name} {partsAndExercises[1].exercises}
            </p>
            <p>
                {partsAndExercises[2].name} {partsAndExercises[2].exercises}
            </p>
        </div>
    )
}

const Total = ({partsAndExercises}) => {
    return <p>Number of exercises {partsAndExercises[0].exercises + partsAndExercises[1].exercises + partsAndExercises[2].exercises}</p>
}

export default App