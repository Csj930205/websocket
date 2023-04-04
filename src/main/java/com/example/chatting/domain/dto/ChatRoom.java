package com.example.chatting.domain.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Data
public class ChatRoom {

    /**
     * Stomp 를 통해 sub/pub 를 사용하면 구독자 관리가 알아서 된다.?
     * 따라서 세션 관리를 하는 코드를 작성할 필요가 없으며 메세지를 다른 세션의 클라이언트에게 발송하는 것도 구현할 필요가 없다.
     */

    private String roomId;

    private String roomName;

    private long userCount;

    private HashMap<String, String> userList = new HashMap<>();

    private List<ChatDto> messageList = new ArrayList<>();

    public ChatRoom create(String roomName) {
        ChatRoom room = new ChatRoom();
        room.roomId = UUID.randomUUID().toString();
        room.roomName = roomName;

        return room;
    }

    public void addMessage(ChatDto chatDto) {
        messageList.add(chatDto);
    }
}
