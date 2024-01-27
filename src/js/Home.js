import React, {useEffect, useState} from 'react';
import API from "./API";
import {Link, useNavigate} from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [commentContent, setCommentContent] = useState('');
    const [comments,setComments]=useState([]);
    let userId = sessionStorage.getItem('userId');

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const fetchData = async () => {
        try {
            const response = await API.get("/posts");
            setPosts(response.data);
        } catch (error) {
            console.error('Error while fetching posts data', error);
        }

        try {
            const response = await API.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error('Error while fetching users data', error);
        }
        try {
            const response = await API.get("/tags");
            setTags(response.data);
        } catch (error) {
            console.error('Error while fetching tags data', error);
        }
        try {
            const response = await API.get("/posts_comments");
            setComments(response.data);
        } catch (error) {
            console.error('Error while fetching tags data', error);
        }
    }

    const findUserName = (userId) => {
        const user = users.find((user) => user.id == userId);
        return user ? user.name + " " + user.surname : 'Unknown User';
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReaction = async (postId, type) => {
        try {
            // Pobierz aktualny stan posta
            const response = await API.get(`/posts/${postId}`);
            const currentPost = response.data;

            if (type == "like") {
                currentPost.postLikeReactions++;
            } else {
                currentPost.postDislikeReactions++;
            }

            const updateResponse = await API.put(`/posts/${postId}`, currentPost);
            const r = await API.get("/posts");
            setPosts(r.data);

            console.log('Reaction response:', updateResponse.data);
        } catch (error) {
            console.error('Error while reacting to post', error);
        }
    };

    const handleComment = async (postId, commentContent) => {
        try {
            const newComment = {
                content: commentContent, id_post: postId, id_user: userId
            };
            //TODO trzeba wrzucić jeszcze date do komentarza
            const response = await API.post("/posts_comments", newComment);
            setCommentContent('');
            fetchData();
        } catch (error) {
            console.error('Error while adding a comment', error);
        }
    };

    const filteredPosts = posts.filter(post => {
        const lowerSearch = search.toLowerCase();
        return (post.title.toLowerCase().includes(lowerSearch) || post.body.toLowerCase().includes(lowerSearch) || findUserName(post.id_user).toLowerCase().includes(lowerSearch));
    });

    return (<div className="home-container">
        <div className="home-search-container">
            <form>
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="home-search-input"
                />
            </form>
        </div>
        <h2>Popular posts:</h2>
        <div>

            {filteredPosts.map((post, index) => (<div key={post.id} className="home-post">
                <img src={require(`../images/avatar.jpg`/*${post.postPictures}*/)} alt="logo" height={100}/>
                <div>
                    <p className="home-post-title">{post.title}</p>
                    <Link className="home-post-author" to={"/profile/" + post.id_user}>
                        <p>{findUserName(post.id_user)}</p></Link>
                </div>
                <div className="home-post-body">
                    <p>{post.body}</p>
                    <ul className="home-post-tags">
                        {post.tags?.map((tagId, index) => {
                            const tag = tags.find(tag => tag.id === Number(tagId));  // Dodano konwersję na liczbę
                            return tag ? <li key={index}> #{tag.name}</li> : null;
                        })}
                    </ul>
                </div>
                <div className="home-post-buttons">
                    <div>
                        <button onClick={() => handleReaction(post.id, "like")} className="home-like-button">
                            Like ({post.postLikeReactions})
                        </button>
                        <button onClick={() => handleReaction(post.id, "dislike")}
                                className="home-dislike-button">
                            Dislike ({post.postDislikeReactions})
                        </button>
                        <div className="home-comment">
                            <p>Pętla po komentarzach w bazie danych trzeba</p>
                            {/*<img src=user image/>*/}
                            {comments
                                .filter(comment => comment.id_post === post.id)
                                .map((comment, commentIndex) => (
                                    <div key={commentIndex}>
                                        <p>{comment.content}</p>
                                    </div>
                                ))}
                        </div>
                        <form className="home-comment-form" onSubmit={(e) => {
                            e.preventDefault();
                            handleComment(post.id, commentContent);
                        }}>
                            <textarea
                                className={"home-comment-field"}
                                placeholder={"Add your comment"}
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <button type={"submit"}  className="home-comment-button">
                                Comment
                            </button>
                        </form>
                    </div>
                </div>
            </div>))}
        </div>
    </div>);
};

export default Home;
