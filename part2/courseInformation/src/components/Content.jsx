import Part from "./Part.jsx";

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part) => (
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            ))}
            <Total parts={parts} />
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0);
    return <p><strong>total of {total} exercises</strong></p>;
};

export default Content