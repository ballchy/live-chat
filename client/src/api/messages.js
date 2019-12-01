const messageEndpoint = 'https://ballchy/api/messages';

export function sendMessage(input) {
    return (
        fetch(messageEndpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'text': input
            })
        }).then(res => res.json())
            .catch(err => console.log(err))
    );
}

export function fetchMessages() {
    return (
        fetch(messageEndpoint)
            .then(res => res.json())
            .catch(err => console.log(err))
    );
}

export function deleteMessage(id) {
    return (
        fetch(messageEndpoint + '/' + id, {
            method: 'delete'
        }).then(res => res.json())
            .catch(err => console.log(err))
    );
}

export default {
    sendMessage,
    fetchMessages,
    deleteMessage
};