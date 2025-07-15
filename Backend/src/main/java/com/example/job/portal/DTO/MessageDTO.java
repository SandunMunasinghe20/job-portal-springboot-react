package com.example.job.portal.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MessageDTO {

    private Long msgId;
    private Long senderId;
    private Long receiverId;
    private String senderName;
    private String receiverName;
    private String content;
    private LocalDateTime sendTime;
    private LocalDateTime receiveTime;
    private String status;
    private Long unreadCount;

}
