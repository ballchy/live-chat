import React, { useState, useEffect } from 'react';
import { sendMessage, fetchMessages, deleteMessage } from '../api/messages';
import { TextField, Container } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import styled from 'styled-components'

import io from 'socket.io-client';

const ENDPOINT = 'https://ballchy.com/5000';
let socket;

const Form = styled.div`
    width: 100%;
    height: 56px;
    position: fixed;
    botton: 0;
    right: 0;
    background: #FFFFFF;
`;

const Input = styled(TextField)`
    width: calc(100vw - 55px);
`;

const Message = styled.div`
    font-size:20px;
    font-weight: 500;
    padding: 15px 24px;
    white-space: pre-wrap;
    position: relative;
`

const PostedAt = styled.div`
    font-weight: 400;
    font-size: 16px;
    color: #eff8fb;
    text-align: right;
`;

const ScrollBox = styled.div`
    overflow-y: auto;
    height: calc(100vh - 120px);
    color: #93d7ee;
    background: #303030;
    box-shadow: 0px 0px 50px 5px rgba(0,0,0,0.7);
`

const TrashIcon = styled(DeleteIcon)`
    color: #93d7ee;
`

const BorderBox = styled.div`
    :hover {
        border-style: solid;
        border-width: 1px;
        border-color: #A9A9A9;
        border-radius: 4px;
    }
`;

const SendButton = styled(SendRoundedIcon)`
    padding: 10px;
    // margin-right: 0.5%;
    float: right;
    color: #303030
`;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    async function sendData() {
        if (input !== '') {
            setSubmitting(true);
            const res = await sendMessage(input);
            setMessages([res, ...messages])
            socket.emit('chat', 'sending message')
            setInput('')
            setSubmitting(false);
        }
    }

    async function deleteData(messageId) {
        setSubmitting(true);
        const res = await deleteMessage(messageId);
        console.log(res);
        const newMessages = messages.filter(message => { return message._id !== messageId })
        setMessages(newMessages)
        setSubmitting(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchMessages();
            setMessages(res.reverse());
        }
        // fetchData();
        socket = io(ENDPOINT);
        socket.on('connect', () => {
            fetchData();
        })

        socket.on('chat', function(data) {
            console.log('receive: ' + data);
            setMessages(messages => [data, ...messages])
        })
    }, []);

    return (
        <Container>
            <ScrollBox>
                {messages.map((message, idx) => {
                    let current_datetime = new Date(message.posted_at);
                    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()

                    return (
                        <BorderBox key={idx}>
                            <Message>{message.text}</Message>
                            <PostedAt>posted at: {formatted_date}
                                <IconButton onClick={() => deleteData(message._id)}>
                                    <TrashIcon/>
                                </IconButton>
                            </PostedAt>
                        </BorderBox>
                    );
                })}
            </ScrollBox>
            <Form>
                <Input
                    value={input}
                    placeholder="Message goes here"
                    variant="outlined"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {if (e.key === 'Enter')  {
                        sendData();
                    }} }></Input>
                <SendButton variant="filled" fontSize="large" onClick={() => sendData()} />
            </Form>
        </Container>
    );
}

export default Chat;