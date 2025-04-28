import {useState} from "react";
import blogService from "../services/blogs";

const Blog = ({blog, updateBlog}) => {
    const [showDetails, setShowDetails] = useState(false)
    const [likes, setLikes] = useState(blog.likes)

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

    const handleLike = async () => {
        const updatedBlog = {
            user: blog.user.id || blog.user._id,
            likes: likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url,
        }

        try {
            const returnedBlog = await blogService.update(blog.id, updatedBlog)
            const blogToUpdate = {
                ...returnedBlog,
                user: returnedBlog.user.username ? returnedBlog.user : blog.user
            }
            setLikes(blogToUpdate.likes)
            updateBlog(blogToUpdate)
        } catch (error) {
            console.error('Like error:', error)
        }
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
                    <p>likes: {blog.likes} <button onClick={handleLike}>like</button></p>
                    <p>{blog.user.username}</p>
                </div>
            )}
        </div>
    )
}

export default Blog