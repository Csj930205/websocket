import React, {useEffect, useRef, useState} from 'react';
import {Stomp} from "@stomp/stompjs";
import {useLocation} from "react-router-dom";
import SockJs from 'sockjs-client';
import './css/chat.css';
import axios from "axios";
import {Modal} from "react-bootstrap";

function ChattingRoom() {
    const location = useLocation();
    const roomId = location.state.roomId;
    const userName = location.state.userName;
    const [userList, setUserList] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const roomName = location.state.roomName;
    const [enter ,setEnter] = useState([]);
    const [leave, setLeave] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const today = new Date();
    const chatMessagesRef = useRef(null);
    const client = useRef(null);
    const handleInputValue = (e) => {setInputValue(e.target.value)}
    const [messageList, setMessageList] = useState([]);

    console.log("userList :" + userList);
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
    }, [roomId, roomName]);

    useEffect(() => {
        const url = '/chat/messageList';
        const data = {roomId : roomId}
        axios.get(url, {params: data} )
            .then(function (res) {
                if (res.data.code === 200) {
                    setMessageList(res.data.messageList);
                    console.log("messageList: " + messageList)
                } else {
                    return;
                }
            })
            .catch(error => console.log(error));
        return () => {
            client.current.disconnect();
        };
    },[]);

    /**
     * 나가기버튼 클릭
     */
    const close = () => {
        client.current.disconnect();
        window.location.href = "/chatRoomList"
    }

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
            setEnter([])
            setEnter((prevEnters) => [...prevEnters, chat.message]);
            setUserList((prevUserList) => [...prevUserList, chat.sender]);
        } else if (chat.messageType === 'LEAVE') {
            setLeave([])
            setLeave((prevLeaves) => [...prevLeaves, chat.message]);
            setUserList((prevUserList) => prevUserList.filter(user => user == chat.sender));
        } else if (chat.messageType === 'TALK') {
            setMessages((prevMessages) => [...prevMessages, chat]);
        }
    }
    console.log(messages)

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
    const openModal = (userList) => {
        setIsModal(true);
    }

    const closedModal = () => {
        setIsModal(false);
    }

    console.log(enter)
    console.log(leave)
    console.log(roomId);

    return (
        <div className='chat-container'>
            <h3 className='chat-roomName'>{roomName}</h3>
            <div className="chat-messages" ref={chatMessagesRef}>
                <div className="userList">
                    <button type='button'onClick={openModal}>--</button>
                </div>
                <div>
                    {enter.map((message, index) => (
                        <div key={`enter-${index}`}>
                            {message}
                        </div>
                    ))}
                </div>
                {/*    {leave.map((message, index) => (*/}
                {/*        <div key={`enter-${index}`}>*/}
                {/*            {message}*/}
                {/*        </div>*/}
                {/*    ))}*/}
                {/*</div>*/}
                {messageList?.map((messageList, index) => (
                    <div key={index} className={`chat-message ${messageList.sender === userName ? 'right' : 'left'}`}>
                        <div className='chat-bubble'>
                            <span className="chat-username">{messageList.sender}</span> : {" "}
                            <span className="chat-message">{messageList.message}</span> {" "}
                        </div>
                    </div>
                    ))}
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender === userName ? 'right' : 'left'}`}>
                        <div className='chat-bubble'>
                            <span className="chat-username">{message.sender}</span> : {" "}
                            <span className="chat-message">{message.message}</span> {" "}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
            <div className="chat-input">
                <input type="text" value={inputValue} onChange={handleInputValue}/>
                <button className="submitButton" type={'submit'}>전송</button>
                <button className="closeButton" type={'button'} onClick={close}>나가기</button>
            </div>
            </form>
            <div>
                <Modal show={isModal} onHide={closedModal}>
                    <Modal.Header>
                        <Modal.Title>채팅방 유저</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {userList.map((user, index) => (
                            <div key={index}>{user}</div>
                        ))}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default ChattingRoom;