import {useState} from "react";
import blogService from "../services/blogs";

const Blog = ({blog, updateBlog, deleteBlog, currentUser}) => {
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
            user: blog.user.id || blog.user._id || blog.user,
            likes: likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url
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
            console.error('Error liking blog:', error.response?.data || error.message)
        }
    }

    const handleDelete = async () => {
        if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
            try {
                await blogService.remove(blog.id)
                deleteBlog(blog.id)
            } catch (error) {
                console.error('Error deleting blog:', error.response?.data || error.message)
            }
        }
    }

    const isBlogCreator = currentUser && blog.user &&
        (currentUser.username === (blog.user.username || blog.user))

    return (
        <div style={blogStyle}>
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleDetails}>{showDetails ? 'hide' : 'view'}</button>
            </div>
            {showDetails && (
                <div>
                    <p>{blog.url}</p>
                    <p>likes: {likes} <button onClick={handleLike}>like</button></p>
                    <p>{(blog.user.username || blog.user) || 'Unknown user'}</p>
                    {isBlogCreator && (
                        <button onClick={handleDelete}>remove</button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Blog