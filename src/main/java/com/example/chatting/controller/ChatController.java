package com.example.chatting.controller;

import com.example.chatting.domain.dto.ChatDto;
import com.example.chatting.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@RequiredArgsConstructor
@Log4j2
public class ChatController {
    private final SimpMessageSendingOperations simpMessageSendingOperations;

    private final ChatService chatService;

    /**
     * MessageMapping 을 통해 WebSocket 으로 들어오는 메세지를 발신 처리
     * 클라이언트에서는 /pub/chat/message 로 요청
     * 처리가 완료되면 /sub/chat/room/roomId 로 메세지가 전송
     * @param chatDto
     * @param simpMessageHeaderAccessor
     */
    @MessageMapping("/chat/enterUser")
    public void enterUser(@Payload ChatDto chatDto, SimpMessageHeaderAccessor simpMessageHeaderAccessor) {
        chatService.plusUserCnt(chatDto.getRoomId());

        String userUUID = (String) simpMessageHeaderAccessor.getSessionAttributes().get("userUUID");
        if (userUUID == null) {
            userUUID = chatService.addUser(chatDto.getRoomId(), chatDto.getSender());
            simpMessageHeaderAccessor.getSessionAttributes().put("userUUID", userUUID);
        }
        simpMessageHeaderAccessor.getSessionAttributes().put("roomId", chatDto.getRoomId());

        chatDto.setMessage(chatDto.getSender() + " 님이 입장하셧습니다.");
        simpMessageSendingOperations.convertAndSend("/sub/chat/room/" + chatDto.getRoomId(), chatDto);
    }

    /**
     * 해당 유저
     * @param chatDto
     */
    @MessageMapping("/chat/sendMessage")
    public void sendMessage(@Payload ChatDto chatDto) {
        log.info("Chat {}", chatDto);
        chatDto.setMessage(chatDto.getMessage());
        chatService.addMessage(chatDto);
        simpMessageSendingOperations.convertAndSend("/sub/chat/room/" + chatDto.getRoomId(), chatDto);
    }

    /**
     * 유저 퇴장 시 EventListener
     * @param event
     */
    @EventListener
    public void webSocketDisconnectListener(SessionDisconnectEvent event) {
        log.info("DisConnEvent {}", event);
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getSessionAttributes() != null) {
            String userUUID = (String) headerAccessor.getSessionAttributes().get("userUUID");
            String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");

            if (userUUID != null && roomId !=null) {
                log.info("headerAccessor {}", headerAccessor);

                chatService.minusUserCnt(roomId);
                String userName = chatService.getUserName(roomId, userUUID);
                chatService.delUser(roomId, userUUID);

                if (userName != null) {
                    log.info("User DisConnected", userName);

                    ChatDto chat = ChatDto.builder()
                            .messageType(ChatDto.MessageType.LEAVE)
                            .sender(userName)
                            .message(userName + " 님 퇴장")
                            .build();
                    simpMessageSendingOperations.convertAndSend("/sub/chat/room/" + roomId, chat);
                }
            }
        }
    }
}
