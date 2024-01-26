import React, { useEffect, useState } from 'react';
import API from "./API";

const Friends = () => {
    const [filter, setFilter] = useState('');
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [relations, setRelations] = useState([]);
    let actualUserId = parseInt(sessionStorage.getItem('userId'));

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleAcceptFriend = async (request) => {
        try {
            console.log(request)
            // Wykonaj zapytanie PUT
            const response = await API.put('/users_relations?id=' + request.id, request);

            console.log('Zaktualizowano obiekt request:', response.data);
        } catch (error) {
            console.error('Błąd podczas aktualizacji obiektu request:', error);
        }
    };

    const handleRemoveFriend = async (id) => {
        try {
            console.log(id)
            // Wykonaj zapytanie DELETE
            const response = await API.delete('/users_relations?id=' + id);

            console.log('Zaktualizowano obiekt request:', response.data);
        } catch (error) {
            console.error('Błąd podczas aktualizacji obiektu request:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const fetchData = async () => {
        try {
            const usersTmp = await API.get("/users");
            const relationsTmp = await API.get("/users_relations");

            setUsers(usersTmp.data);
            setRelations(relationsTmp.data);


            const userRRelations = relations.filter(item => parseInt(item.user_id) === actualUserId && item.status === "Request");
            const fullRUserRelations = userRRelations.map(item => ({
                ...item,
                userRelationsFrom: users.find(itemUser => parseInt(itemUser.id) === item.userRelationsFrom)
            }));
            setRequests(fullRUserRelations);

            const userFRelations = relations.filter(item => parseInt(item.user_id) === actualUserId && item.status === "Friends");
            const fullFUserRelations = userFRelations.map(item => ({
                ...item,
                userRelationsFrom: users.find(itemUser => parseInt(itemUser.id) === item.userRelationsFrom)
            }));
            setFriends(fullFUserRelations);


        } catch (error) {
            console.error('Error while fetching data', error);
        }

    };


    useEffect(() => {
        fetchData();
        console.log("fetchdata")
    },[fetchData()]);


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
                {requests.length > 0 ? (
                    <ul>
                        {requests.map(item => (
                            <li key={item.id}>
                                {`${item.userRelationsFrom.name} ${item.userRelationsFrom.surname}`}
                                <button
                                    type="button"
                                    variant="info"
                                    onClick={() => handleAcceptFriend(item.id)}>
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
                                {`${friend.userRelationsFrom.name} ${friend.userRelationsFrom.surname}`}
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