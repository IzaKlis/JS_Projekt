import React, {useEffect, useState} from 'react';
import API from "./API";
import {Link} from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState([]);
    const [reactions, setReactions] = useState([]);
    const userId = sessionStorage.getItem('userId');

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const fetchData = async () => {
        try {
            const poststmp = await API.get("/posts");
            setPosts(poststmp.data);

            const userstmp = await API.get("/users");
            setUsers(userstmp.data);

            const commentstmp = await API.get("/posts_comments");
            setComments(commentstmp.data);

            const reactionstmp = await API.get("/posts_reactions");
            setReactions(reactionstmp.data);

        } catch (error) {
            console.error('Error while fetching data', error);
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
            const existingReaction = reactions.find(
                reaction => reaction.id_post === postId && reaction.id_user === userId  //sprawdzam czy istnieje zalogowany uzytkownik juz polajkowal ten post
            );
            if (!existingReaction) {    //jesli nie polajkowal to dodajemy nowa reakcje
                const response = await API.post("/posts_reactions", {
                    type: type,
                    id_post: postId,
                    id_user: userId
                });
                fetchData();
                console.log('Reaction response:', response.data);
            } else if (existingReaction.type != type) { //jezeli polajkowal, ale klika inny przycisk niz wczesniej wybrany to nie cofamy lajka
                console.log("Inny typ reakcji, wiec nie kasuje")
            } else {    //jezeli polajkowal, i klika wczesniej wybrany lajk to "cofamy lajka"
                const deleteResponse = await API.delete(`/posts_reactions/${existingReaction.id}`);
                fetchData();
                console.log('Reaction deleted:', deleteResponse.data);
            }
        } catch (error) {
            console.error('Error while reacting to post', error);
        }
    };
    

    const handleComment = async (postId, commentContent) => {
        try {
           const response = await API.post("/posts_comments", {
                content: commentContent,
                id_post: postId,
                id_user: userId
            });
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
                <img className="user-profile-img" src={post.postPictures} alt="PostPicture"/>
                <div>
                    <p className="home-post-title">{post.title}</p>
                    <Link className="home-post-author" to={"/profile/" + post.id_user}>
                        <p>{findUserName(post.id_user)}</p></Link>
                    <p>{post.dateCreated}</p>
                </div>
                <div className="home-post-body">
                    <p>{post.body}</p>
                </div>
                <div className="home-post-buttons">
                    <div>
                        <button onClick={() => handleReaction(post.id, "like")} className="home-like-button">
                            Like ({reactions.filter(reaction => reaction.type === "like" && reaction.id_post === post.id).length})
                        </button>
                        <button onClick={() => handleReaction(post.id, "dislike")} className="home-dislike-button">
                            Dislike ({reactions.filter(reaction => reaction.type === "dislike" && reaction.id_post === post.id).length})
                        </button>
                        <div className="home-comment">
                            {comments
                                .filter(comment => comment.id_post === post.id)
                                .map((comment, commentIndex) => (
                                    <div key={commentIndex}>
                                        <p>{comment.content}</p>
                                        <p>{findUserName(comment.id_user)}</p>
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
                            <button type={"submit"} className="home-comment-button">
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
