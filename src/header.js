import React from 'react';
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

function Header() {
    return (
        <Nav variant={'tabs'}>
            <Nav.Item>
                <Nav.Link as={Link} to={'/'}> 홈 </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to={'/chatRoomList'}> 채팅방 리스트 </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default Header;