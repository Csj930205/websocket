package com.example.chatting.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Stomp 접속 url => /ws
        registry
                .addEndpoint("/ws") // Endpoint 설정
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS(); // SocketJw 를 연결하는 설정
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메세지를 구독하는 요청 url => 메세지 받을 때 사용
        registry.enableSimpleBroker("/sub");

        // 메세지를 발행하는 요청 url => 메세지를 보낼 때 사용
        registry.setApplicationDestinationPrefixes("/pub");
    }
}
