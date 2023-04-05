package com.example.chatting.controller;

import com.example.chatting.domain.dto.ChatDto;
import com.example.chatting.domain.dto.ChatRoom;
import com.example.chatting.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Log4j2
public class ChatRoomController {

    private final ChatService chatService;

    /**
     * 채팅방 전체 리스트 조회
     * @return
     */
    @GetMapping("chatlist")
    public ResponseEntity<Map<String, Object>> chatRoomList() {
        List chatRoomList = chatService.findAllRoom();

        Map<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("code", HttpStatus.OK.value());
        result.put("chatRoomList", chatRoomList);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 채팅방 이전 메세지 조회
     * @param roomId
     * @return
     */
    @GetMapping("messageList")
    public ResponseEntity<Map<String, Object>> chatRoomMessage(String roomId) {
        List<ChatDto> messageList = chatService.messageList(roomId);
        Map<String, Object> result = new HashMap<>();

        result.put("result", "success");
        result.put("code", HttpStatus.OK.value());
        result.put("messageList", messageList);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 채팅방 생성
     * @param chatRoom
     * @return
     */
    @PostMapping("createroom")
    public ResponseEntity<Map<String, Object>> createRoom(@RequestBody ChatRoom chatRoom) {
        ChatRoom room = chatService.createChatRoom(chatRoom.getRoomName());
        log.info("Create Chatting Room {}", room);

        Map<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("code", HttpStatus.OK.value());
        result.put("message", "채팅방이 생성되었습니다.");
        result.put("roomAdd", room);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 유저리스트 반환
     * @param roomId
     * @return
     */
    @GetMapping("userlist")
    public ResponseEntity<Map<String, Object>> userList(String roomId) {
        List<String> userList = chatService.getUserList(roomId);

        Map<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("code", HttpStatus.OK.value());
        result.put("userList", userList);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * 채팅방에 참여한 유저 닉네임 중복 확인
     * @param roomId
     * @param userName
     * @return
     */
    @GetMapping("duplicateuser")
    public ResponseEntity<Map<String, Object>> duplicateUser( String roomId, String userName) {
        String user = chatService.isDuplicateName(roomId, userName);
        log.info("동작 확인 {}", user);

        Map<String, Object> result = new HashMap<>();
        result.put("result", "success");
        result.put("code", HttpStatus.OK.value());
        result.put("user", user);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
