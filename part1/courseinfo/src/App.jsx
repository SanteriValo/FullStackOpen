const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10
            },
            {
                name: 'Using props to pass data',
                exercises: 7
            },
            {
                name: 'State of a component',
                exercises: 14
            },
        ]
    }

    return (
        <div>
            <Header course={course.name}/>
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
        </div>
    )
}

const Header = (props) => {
    return <h1>{props.course}</h1>
}

const Content = ({parts}) => {
    return (
        <div>
            <p>{parts[0].name} {parts[0].exercises}</p>
            <p>{parts[1].name} {parts[1].exercises}</p>
            <p>{parts[2].name} {parts[2].exercises}</p>
        </div>
    );
};

const Total = ({parts}) => {
    const TotalExercises = (parts[0].exercises + parts[1].exercises + parts[2].exercises);
    return (
        <p>
            Number of exercises: {TotalExercises}
        </p>
    );
};

export default App