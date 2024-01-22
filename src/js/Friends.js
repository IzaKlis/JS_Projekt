import React, {useEffect, useState} from 'react';
import API from "./API";

const Friends = () => {
    const [filter, setFilter] = useState('');
    const [count, setCount] = useState(0);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleAcceptFriend = async (friendId) => {
    };

    const handleRemoveFriend = async (friendId) => {
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const fetchData = async () => {
        try {
            const response = await API.get("/users_relations");
            const relations = response.data;
            const friendsList = relations.filter(relation => relation.status === "Friends");
            const requestsList = relations.filter(relation => relation.status === "Request");

            setFriends(friendsList);
            setRequests(requestsList);
        } catch (error) {
            console.error('Error while fetching users_relations data', error);
        }
        try {
            const response = await API.get("/users");
            const relations = response.data;
            const friendsList = relations.filter(relation => relation.status === "Friends");
            const requestsList = relations.filter(relation => relation.status === "Request");

            setFriends(friendsList);
            setRequests(requestsList);
        } catch (error) {
            console.error('Error while fetching users_relations data', error);
        }


    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="friends-container">
            <form>
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Search"
                />
            </form>
            <div>
                <h2>Requests:</h2>
                {Array.isArray(requests) && requests.length > 0 ? (
                    <ul>
                        {requests.map(request => (
                            <li key={request.id}>
                                {`${request.name} ${request.surename}`}
                                <button
                                    type="button"
                                    variant="info"
                                    onClick={() => handleAcceptFriend(request.id)}>
                                    Accept
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No invites</p>
                )}
            </div>
            <div>
                <h2>Friends List:</h2>
                {Array.isArray(friends) && friends.length > 0 ? (
                    <ul>
                        {friends.map(friend => (
                            <li key={friend.id}>
                                {`${friend.name} ${friend.surname}`}
                                <button
                                    type="button"   
                                    onClick={() => handleRemoveFriend(friend.id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No friends</p>
                )}
            </div>
        </div>
    );
};

export default Friends;