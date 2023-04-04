package com.example.chatting.service;

import com.example.chatting.domain.dto.ChatDto;
import com.example.chatting.domain.dto.ChatRoom;
import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Log4j2
public class ChatService {
    private Map<String, ChatRoom> chatRoomMap;

    @PostConstruct
    private void init() {
        chatRoomMap = new LinkedHashMap<>();
    }

    /**
     * 채팅방 전체 조회
     * @return
     */
    public List<ChatRoom> findAllRoom() {
        List chatRooms = new ArrayList(chatRoomMap.values());
        return chatRooms;
    }

    /**
     * roomId 기준으로 채팅방 찾기
     * @param roomId
     * @return
     */
    public ChatRoom findRoomById(String roomId) {
        return chatRoomMap.get(roomId);
    }

    /**
     * roomName 으로 채팅방 만들기
     * @param roomName
     * @return
     */
    public ChatRoom createChatRoom(String roomName) {
        ChatRoom chatRoom = new ChatRoom().create(roomName);
        chatRoomMap.put(chatRoom.getRoomId(), chatRoom);

        return chatRoom;
    }

    /**
     * 채팅방 인원 + 1
     * @param roomId
     */
    public void plusUserCnt(String roomId) {
        ChatRoom room = chatRoomMap.get(roomId);
        if (room != null) {
            room.setUserCount(room.getUserCount() + 1);
        }
    }

    /**
     * 채팅방 인원 - 1
     * @param roomId
     */
    public void minusUserCnt(String roomId) {
        ChatRoom room = chatRoomMap.get(roomId);
        if (room != null && room.getUserCount() != 0) {
            room.setUserCount(room.getUserCount() - 1);
        }
    }

    /**
     * 채팅방 유저 리스트에 유저 추가
     * @param roomId
     * @param userName
     * @return
     */
    public String addUser(String roomId, String userName) {
        ChatRoom room = chatRoomMap.get(roomId);
        if (room == null) {
            throw new IllegalStateException("Invalid roomId");
        }
        String userUUID = UUID.randomUUID().toString();
        room.getUserList().put(userUUID, userName);
        return userUUID;
    }

    /**
     * 채팅방 메세지 저장
     * @param chatDto
     */
    public void addMessage(ChatDto chatDto) {
        ChatRoom room = chatRoomMap.get(chatDto.getRoomId());

        if (room == null) {
            throw new IllegalStateException();
        }
        room.addMessage(chatDto);
    }

    /**
     * 채팅방 이전 메세지 리스트
     * @param roomId
     * @return
     */
    public List<ChatDto> messageList(String roomId) {
        ChatRoom room = chatRoomMap.get(roomId);
        List<ChatDto> messageList = room.getMessageList();
        return messageList;
    }

    /**
     * 채팅방 유저 이름 중복 확인
     * @param roomId
     * @param userName
     * @return
     */
    public String isDuplicateName(String roomId, String userName) {
        ChatRoom room = chatRoomMap.get(roomId);
        String tmp = userName;

        // userName 이 중복이라면 랜덤한 숫자를 붙힌다.
        // 랜덤숫자 붙힌 후 다시 중복이라면 또 붙힘
        while (room.getUserList().containsValue(tmp)) {
            int ranNum = (int) (Math.random() * 100) + 1;
            tmp = userName + ranNum;
        }

        return tmp;
    }

    /**
     * 채팅방 유저 리스트 삭제
     * @param roomId
     * @param userUUID
     */
    public void delUser(String roomId, String userUUID) {
        ChatRoom room = chatRoomMap.get(roomId);
        room.getUserList().remove(userUUID);
    }

    /**
     * 채팅방 userName 조회
     * @param roomId
     * @return
     */
    public String getUserName(String roomId, String userUUID) {
        ChatRoom room = chatRoomMap.get(roomId);
        String userName = room.getUserList().get(userUUID);
        return userName;
    }

    /**
     * 채팅방 userList 조회
     * @param roomId
     * @return
     */
    public ArrayList<String> getUserList(String roomId) {
        ArrayList<String> list = new ArrayList<>();

        ChatRoom room = chatRoomMap.get(roomId);
        room.getUserList().forEach((key, value) -> { list.add(value);});
        return list;
    }
}
