import React, { useEffect, useState } from 'react';
import API from "./API";

const Friends = () => {
    const [filter, setFilter] = useState('');
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [friends, setFriends] = useState([]);
    const [addFriends, setAddFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [relations, setRelations] = useState([]);
    const [requestsFromUser, setRequestsFromUser] = useState([]);
    let actualUserId = parseInt(sessionStorage.getItem('userId'));

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleAcceptRequest = async (id) => {
        try {
            const response = await API.patch('/users_relations/' + id, { status: 'Friends' });
            console.log('Zaktualizowano obiekt request:', response.data);
        } catch (error) {
            console.error('Błąd podczas aktualizacji obiektu request:', error);
        }
        fetchData();
    };

    const handleRemoveRequest = async (id) => {
        try {
            const response = await API.delete('/users_relations/' + id);
            console.log('Zaktualizowano obiekt request:', response.data);
        } catch (error) {
            console.error('Błąd podczas aktualizacji obiektu request:', error);
        }
        fetchData();
    };


    const handleRemoveFriend = async (id) => {
        try {
            const response = await API.delete('/users_relations/' + id);
            console.log('Zaktualizowano obiekt friends:', response.data);
        } catch (error) {
            console.error('Błąd podczas aktualizacji obiektu friends:', error);
        }
        fetchData();
    };

    const handleSendRequest = async (id) => {
        try {
            const requestBody = {
                user_id: parseInt(id),
                status: "Request",
                userRelationsFrom: actualUserId,
                userRelationsTo: parseInt(id),
            }
            const response = await API.post('/users_relations', requestBody)
            console.log(response.data)
        } catch (error) {
            console.error('Błąd podczas aktualizacji obiektu request:', error);
        }
        fetchData();
    }

    const fetchData = async () => {
        try {
            const usersTmp = await API.get("/users");
            const relationsTmp = await API.get("/users_relations");

            setUsers(usersTmp.data);
            setRelations(relationsTmp.data);


            const userRRelations = relations.filter(item => parseInt(item.user_id) === actualUserId && item.status === "Request");
            const fullRUserRelations = userRRelations.map(item => ({
                ...item,
                userRelationsFrom: users.find(itemUser => parseInt(itemUser.id) === item.userRelationsFrom),
                userRelationsTo: users.find(itemUser => parseInt(itemUser.id) === item.userRelationsTo)
            }));
            setRequests(fullRUserRelations);

            const userFRelations = relations.filter(item => parseInt(item.user_id) === actualUserId && item.status === "Friends");
            const fullFUserRelations = userFRelations.map(item => ({
                ...item,
                userRelationsFrom: users.find(itemUser => parseInt(itemUser.id) === item.userRelationsFrom)
                
                
            }));
            setFriends(fullFUserRelations);
            console.log("PRZyjaciele", fullFUserRelations)

            const usersWithoutRelations = users.filter(user => {
                console.log(requests)
                const isFriend = friends.some(friend => parseInt(friend.userRelationsFrom.id) === parseInt(user.id)); //sprawdza czy nie sa juz znajomymi
                const isRequestSent = requests.some(request => parseInt(request.userRelationsFrom.id) === parseInt(user.id)); //sprawdza czy zalogowany user nie ma zaproszenia juz od tego typa
                console.log("relacje userow", relations);

                const isRequestReceived = relations.some(
                    relation => parseInt(relation.userRelationsFrom) === parseInt(actualUserId) && parseInt(relation.userRelationsTo) === parseInt(user.id)
                );
             //sprawdza czy dany user juz ma zaproszenie od zalogowanego usera
                console.log("is request received", isRequestReceived);
                return !isFriend && !isRequestSent && !isRequestReceived && user.id != actualUserId;
            });

            console.log("userzy bez relacji", usersWithoutRelations);

            setAddFriends(usersWithoutRelations);

        } catch (error) {
            console.error('Error while fetching data', error);
        }

    };



    useEffect(() => {
        fetchData();
        console.log("fetchdata")
    },[relations.length, addFriends.length]);


    return (
        <div className="friends-container">
            <div>
                <h2>Requests:</h2>
                {requests.length > 0 ? (
                    <ul>
                        {requests.map(item => (
                            <li key={item.id}>
                                {`${item.userRelationsFrom.name} ${item.userRelationsFrom.surname}`}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        type="button"
                                        variant="info"
                                        onClick={() => handleAcceptRequest(item.id)}>
                                        Accept
                                    </button>
                                    <button
                                        type="button"
                                        variant="info"
                                        onClick={() => handleRemoveRequest(item.id)}>
                                        Remove
                                    </button>
                                </div>

                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No invites</p>
                )}

            </div>
            <div>
                <h2>Friends:</h2>
                {friends.length > 0 ? (
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
            <div>
                <h2>Add friend:</h2>
                {addFriends.length > 0 ? (
                    <ul>
                        {addFriends.map(user => (
                            <li key={user.id}>
                                {`${user.name} ${user.surname}`}
                                <button
                                    type="button"
                                    onClick={() => handleSendRequest(user.id)}>
                                    Add Friend
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users to add</p>
                )}
            </div>
        </div>
    );
};

export default Friends;