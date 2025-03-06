import logo from './logo.svg';
import './App.css';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ConversationHeader, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react';
import { Mistral } from '@mistralai/mistralai';


function App() {
    const apiKey ='your-api-key';

    const [messages, setMessages] = useState([
        {
            message: 'Hello, I am an AI, you can click on the attach button to empty the chat',
            direction: 'incoming',
            sender: 'chatty'
        },
    ]);

    function vide() {
        setMessages([{
            message: 'Hello, I am an AI',
            direction: 'incoming',
            sender: 'chatty'
        },]);
    }

    const sendmessage = async (message, isUser) => {
        let senderType = isUser ? "outgoing" : "incoming";

        const Newmessage = {
            message: message,
            direction: senderType
        }
        setMessages((prevMessages) => [...prevMessages, Newmessage]);

        if (isUser) {
            const client = new Mistral({ apiKey: apiKey });
            const chatResponse = await client.chat.complete({
                model: "mistral-small-2402",
                messages: [{ role: 'user', content: message }]
            });

            sendmessage(chatResponse.choices[0].message.content, false);
        }
    };

    return (
        <MainContainer>
            <ChatContainer>
                <ConversationHeader>
                    <ConversationHeader.Back />
                    <ConversationHeader.Content
                        info="Always active"
                        userName="AI" />
                </ConversationHeader>
                <MessageList>
                    {messages.map((msg, index) => (
                        <Message key={index} model={msg} />))}
                </MessageList>
                <MessageInput placeholder="chat with the ai" sendButton={true} onSend={(message) => sendmessage(message, true)} onAttachClick={vide} />
            </ChatContainer>
        </MainContainer>
    );
}

export default App;