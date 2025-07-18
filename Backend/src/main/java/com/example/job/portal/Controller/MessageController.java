package com.example.job.portal.Controller;


import com.example.job.portal.DTO.MessageDTO;
import com.example.job.portal.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/msg")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody MessageDTO messageDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }

        return messageService.sendMessage(messageDTO,authentication);
    }
    
    @GetMapping("/inbox")
    public ResponseEntity<?> getInbox(Authentication authentication,@RequestParam Long userId) {
        if(authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return messageService.getInbox(userId);
    }

    @GetMapping("/chat")
    public ResponseEntity<?> getChatMessages(Authentication authentication,  @RequestParam Long senderId,
                                             @RequestParam Long receiverId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setSenderId(senderId);
        messageDTO.setReceiverId(receiverId);

        return messageService.getConversation(messageDTO);
    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<String> markAsRead(@RequestBody MessageDTO messageDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return messageService.markAsRead(messageDTO,authentication);
    }

    @PostMapping("/mark-as-delivered")
    public ResponseEntity<String> markAsDelivered(@RequestBody MessageDTO messageDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return messageService.markAsDelivered(messageDTO,authentication);
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editMessage(@RequestBody MessageDTO messageDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return messageService.editMessage(messageDTO,authentication);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login first");
        }
        return messageService.deleteMessage(id,authentication);
    }

}

