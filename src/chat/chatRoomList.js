import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Button, Table, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


function ChatRoomList() {
    const [roomId, setRoomId] = useState('');
    const [roomName, setRoomName] = useState('')
    const [userCount, setUserCont] = useState('');
    const [chatRoomList, setChatRoomList] = useState([]);
    const [userName, setUserName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleRoomName = (e) => {setRoomName(e.target.value)}
    const handleUserName = (e) => {setUserName(e.target.value)}

    useEffect(() => {
        /**
         * 채팅방 리스트 Axios
         * @returns {Promise<void>}
         */
        const chattingRoom =  () => {
            const url = '/chat/chatlist'
            axios.get(url)
                .then(function (res) {
                    if (res.data.code === 200) {
                        setChatRoomList(res.data.chatRoomList);
                    } else {
                        console.log('통신오류')
                    }
                })
                .catch(error => console.log(error))
        }
        chattingRoom();
    }, [])

    /**
     * 채팅방 생성 Axios
     * @returns {Promise<void>}
     */
    const chattingRoomCreate = () => {
        const url = '/chat/createroom';
        const data = {roomName : roomName}
        const config = {"Content-Type" : 'application/json'}
        if (roomName === '') {
            alert('채팅방 이름을 입력해주세요.')
            return ;
        }
        axios.post(url, data, config)
            .then(function (res) {
                if (res.data.code === 200) {
                    alert(res.data.message);
                    setChatRoomList([...chatRoomList, res.data.roomAdd])
                    setRoomName('');
                } else {
                    alert('채팅방 생성에 실패하였습니다.')
                }
            })
            .catch(error => console.log(error))
    }
    const chattingRoomEnter = () => {
        if (userName === '') {
            alert('이름을 입력해주세요.')
            return;
        }
        isDuplicateName();
    }

    /**
     * 닉네임 중복 Axios
     * @returns {Promise<void>}
     */
    const isDuplicateName = () => {
        const url = '/chat/duplicateuser';
        const data = {userName : userName, roomId : roomId}

        axios.get(url, {params : data})
            .then(function (res) {
                if (res.data.code === 200) {
                    alert('사용가능한 닉네임 입니다.')
                    navigate('/chatRoomEnter', {state: {roomId: roomId, userName : userName, roomName : roomName}})
                } else {
                    return;
                }
            })
            .catch(error => console.log(error))
    }

    /**
     * Modal open
     * @param roomId
     */
    const modalOpen = (roomId, roomName) => {
        setRoomId(roomId);
        setRoomName(roomName)
        setIsModalOpen(true);
    }

    /**
     * Modal Hide
     */
    const modalHide = () => {
        setIsModalOpen(false);
    }

    return (
        <div>
            <div>
                채팅방 생성: <input type={'text'} value={roomName} onChange={handleRoomName}/>{" "}
                <Button variant={'primary'} type={'button'} onClick={chattingRoomCreate}> 생성 </Button>
            </div>
            <br/>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>방제목</th>
                        <th>입장인원</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                {chatRoomList?.map(item => (
                    <tr key={item.roomId}>
                        <th>{item.roomName}</th>
                        <th>{item.userCount}</th>
                        <th>
                            <Button variant={'primary'} type={'button'} onClick={() => modalOpen(item.roomId, item.roomName)}> 입장 </Button>
                        </th>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div>
                <Modal show={isModalOpen} onHide={modalHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>채팅방 닉네임</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type={'text'} onChange={handleUserName}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={'danger'} type={'button'} onClick={modalHide}>닫기</Button>
                        <Button type={'button'} onClick={chattingRoomEnter}>확인</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ChatRoomList;