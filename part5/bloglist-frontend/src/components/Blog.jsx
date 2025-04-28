import {useState} from "react";

const Blog = ({blog}) => {
    const [showDetails, setShowDetails] = useState(false)
    const blogStyle = {
        paddingTop: 12,
        paddingLeft: 4,
        border: 'solid 1px',
        borderWidth: '1px',
        marginBottom: 5
    }

    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
            </div>
            {showDetails && (
                <div>
                    <p>{blog.url}</p>
                    <p>likes: {blog.likes} <button>like</button></p>
                    <p>{blog.user.name}</p>
                </div>
            )}
        </div>
    )
}

export default Blog