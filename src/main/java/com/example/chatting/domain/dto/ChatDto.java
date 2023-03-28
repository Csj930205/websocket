package com.example.chatting.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatDto {

    /**
     * 메세지타입: 입장, 채팅
     * 메세지 타입에 따라서 동작하는 구조가 달라짐.
     * 입장과 퇴장 ENTER 과 LEAVE 의 경우 입장/퇴장 이벤트 처리가 실행됨
     * TALK 의 경우 내용이 해당 채팅방을 SUB 하고 있는 모든 클라이언트에게 전달.
     */
    public enum MessageType {
        ENTER, TALK, LEAVE
    }

    private MessageType messageType;

    private String roomId;

    private String sender;

    private String message;

    private String time;
}
