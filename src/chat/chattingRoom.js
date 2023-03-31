import React, {useEffect, useRef, useState} from 'react';
import {Stomp} from "@stomp/stompjs";
import {useLocation} from "react-router-dom";
import SockJs from 'sockjs-client';
import './css/chat.css';

function ChattingRoom() {
    const location = useLocation();
    const roomId = location.state.roomId;
    const userName = location.state.userName;
    const roomName = location.state.roomName;
    const [enter ,setEnter] = useState([]);
    const [leave, setLeave] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const today = new Date();
    const chatMessagesRef = useRef(null);
    const client = useRef(null);

    const handleInputValue = (e) => {setInputValue(e.target.value)}
    console.log(roomId)
    /**
     * Stomp 연결 및 구독
     */
    useEffect(() => {
        const webSocket = new SockJs('/ws');
        client.current = Stomp.over(webSocket);
        const cleanUp = () => {
            client.current.disconnect();
            webSocket.close();
        };
        if (!client.current.connected) {
            client.current.connect({}, () => {
                client.current.subscribe('/sub/chat/room/' + roomId, onMessageReceived)
                client.current.send('/pub/chat/enterUser', {},
                    JSON.stringify({
                        roomId : roomId,
                        sender : userName,
                        messageType : 'ENTER',
                        time : today.toISOString()
                    })
                );
            });
        }
        return cleanUp;
    }, [roomId, roomName])

    useEffect(() => {
        return () => {
            client.current.disconnect();
        };
    },[])

    /**
     * Message
     */
    useEffect(() => {
        const chatMessageNode = chatMessagesRef.current;
        chatMessageNode.scrollTop = chatMessageNode.scrollHeight - chatMessageNode.clientHeight
    }, [messages]);

    /**
     * 입장 또는 퇴장시 Message 저장
     * @param payload
     */
    const onMessageReceived = (payload) => {
        const chat = JSON.parse(payload.body);
        if (chat.messageType === 'ENTER') {
            setEnter(chat.message);
        }
        if (chat.messageType === 'LEAVE') {
            setLeave(chat.message);
        }
        if (chat.messageType === 'TALK') {
            setMessages((prevMessages) => [...prevMessages, chat]);
        }
    }

    /**
     * WebSocket SendMessage
     * @param e
     */
    const sendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '') {
            alert('메세지를 입력해 주세요.')
            return;
        }
        if (!client.current.connected) {
            alert('연결이 이루어지지 않았습니다. 잠시만 기다려 주세요.')
            return;
        }
        const data = {
            roomId : roomId,
            sender : userName,
            message : inputValue,
            messageType: 'TALK',
            time : today.toISOString()
        }
        client.current.send('/pub/chat/sendMessage', {}, JSON.stringify(data));
        setInputValue('');
    }
    console.log(enter)
    console.log(leave)
    return (
        <div className='chat-container'>
            <h3 className='chat-roomName'>{roomName}</h3>
            <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender === userName ? 'right' : 'left'}`}>
                        <div className='chat-bubble'>
                            <span className="chat-username">{message.sender}</span> : {" "}
                            <span className="chat-message">{message.message}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/*{enter ? (*/}
            {/*    <div className="chat-enter-leave">*/}
            {/*        {enter}*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    <div className="chat-enter-leave">*/}
            {/*        {leave}*/}
            {/*    </div>*/}
            {/*)}*/}
            <form onSubmit={sendMessage}>
            <div className="chat-input">
                <input type="text" value={inputValue} onChange={handleInputValue}/>
                <button type={'submit'}>전송</button>
            </div>
            </form>
        </div>
    );
}

export default ChattingRoom;