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
            <Content
                part1 = {partsAndExercises[0]}
                part2 = {partsAndExercises[1]}
                part3 = {partsAndExercises[2]}
            />
            <Total partsAndExercises={partsAndExercises}/>
        </div>
    )
}

const Header = (props) => {
    return <h1>{props.course}</h1>
}

const Content = ({part1, part2, part3}) => {
    return (
        <div>
            <Part part={part1} />
            <Part part={part2} />
            <Part part={part3} />
        </div>
    )
}

const Part = ({part}) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    )
}

const Total = ({partsAndExercises}) => {
    return <p>Number of exercises {partsAndExercises[0].exercises + partsAndExercises[1].exercises + partsAndExercises[2].exercises}</p>
}

export default App