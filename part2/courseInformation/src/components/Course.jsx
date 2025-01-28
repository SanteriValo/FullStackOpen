import Header from "./Header.jsx";
import Content from "./Content.jsx";

const Course = (props) => {
    return (
        <div>
            <Header course={props.course.name} />
            <Content parts={props.course.parts} />
        </div>
    )
}

export default Course