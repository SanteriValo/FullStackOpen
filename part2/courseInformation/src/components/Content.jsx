import Part from "./Part.jsx";

const Content = (props) => {
    const total = props.parts.reduce((sum, x) => sum + x.exercises, 0)
    return (
    <div>
        <Part part={props.parts[0]}/>
        <Part part={props.parts[1]}/>
        <Part part={props.parts[2]}/>
        <Part part={props.parts[3]}/>
        <p><b>total of {total} exercises</b></p>
    </div>
    )
}

export default Content