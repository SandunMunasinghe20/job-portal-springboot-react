package com.example.job.portal.Service;

import com.example.job.portal.DTO.MessageDTO;
import com.example.job.portal.Entity.Employer;
import com.example.job.portal.Entity.Message;
import com.example.job.portal.Entity.Seeker;
import com.example.job.portal.Entity.User;
import com.example.job.portal.Repository.EmployerRepo;
import com.example.job.portal.Repository.MessageRepo;
import com.example.job.portal.Repository.SeekerRepo;
import com.example.job.portal.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final UserRepo userRepo;
    private final MessageRepo messageRepo;
    private final SeekerRepo seekerRepo;
    private final EmployerRepo employerRepo;

    @Autowired
    public MessageService(UserRepo userRepo, MessageRepo messageRepo, SeekerRepo seekerRepo, EmployerRepo employerRepo) {
        this.userRepo = userRepo;
        this.messageRepo = messageRepo;
        this.seekerRepo = seekerRepo;
        this.employerRepo = employerRepo;
    }

    // Send a message from sender to receiver
    public ResponseEntity<String> sendMessage(MessageDTO messageDTO, Authentication authentication) {

        // Prevent sending message to self
        if (messageDTO.getSenderId().equals(messageDTO.getReceiverId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot send message to yourself");
        }

        // Get currently logged-in user
        String email = authentication.getName();

        // Find sender in the database
        Optional<User> optionalSender = userRepo.findByEmail(email);
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        // Find receiver in the database
        Optional<User> optionalReceiver = userRepo.findById(messageDTO.getReceiverId());
        if (optionalReceiver.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        User receiver = optionalReceiver.get();

        // Create new message entity
        Message message = new Message();
        message.setReceiver(receiver);
        message.setSender(sender);
        message.setContent(messageDTO.getContent());
        message.setSendTime(LocalDateTime.now()); // set current timestamp
        messageRepo.save(message); // save message to DB

        return ResponseEntity.ok("Message sent Successfully");
    }

    // Get conversation between two users
    public ResponseEntity<?> getConversation(MessageDTO messageDTO) {

        // Find sender by ID
        Optional<User> optionalSender = userRepo.findById(messageDTO.getSenderId());
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        // Find receiver by ID
        Optional<User> optionalReceiver = userRepo.findById(messageDTO.getReceiverId());
        if (optionalReceiver.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receiver not found");
        }
        User receiver = optionalReceiver.get();

        // Validate allowed messaging: Seeker <> Employer <> Admin
        boolean isSeekerToEmployer = sender.getRole().equalsIgnoreCase("seeker") && receiver.getRole().equalsIgnoreCase("employer");
        boolean isEmployerToSeeker = sender.getRole().equalsIgnoreCase("employer") && receiver.getRole().equalsIgnoreCase("seeker");
        boolean isSeekerToAdmin = sender.getRole().equalsIgnoreCase("seeker") && receiver.getRole().equalsIgnoreCase("admin");
        boolean isEmployerToAdmin = sender.getRole().equalsIgnoreCase("employer") && receiver.getRole().equalsIgnoreCase("admin");
        boolean isAdminToSeeker = sender.getRole().equalsIgnoreCase("admin") && receiver.getRole().equalsIgnoreCase("seeker");
        boolean isAdminToEmployer = sender.getRole().equalsIgnoreCase("admin") && receiver.getRole().equalsIgnoreCase("employer");

        if (!(isSeekerToEmployer || isEmployerToSeeker || isSeekerToAdmin || isEmployerToAdmin || isAdminToSeeker || isAdminToEmployer)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Messaging allowed only between Seeker, Employer, and Admin");
        }

        final String senderName;
        final String receiverName;

        // Determine sender's display name based on role
        if (sender.getRole().equalsIgnoreCase("seeker")) {
            Optional<Seeker> seeker = seekerRepo.findById(sender.getId());
            senderName = seeker.get().getFname() + " " + seeker.get().getLname();
        } else if (sender.getRole().equalsIgnoreCase("employer")) {
            Optional<Employer> employer = employerRepo.findById(sender.getId());
            senderName = employer.get().getCompanyName();
        } else {
            senderName = "Admin";
        }

        // Determine receiver's display name based on role
        if (receiver.getRole().equalsIgnoreCase("seeker")) {
            Optional<Seeker> seeker = seekerRepo.findById(receiver.getId());
            receiverName = seeker.get().getFname() + " " + seeker.get().getLname();
        } else if (receiver.getRole().equalsIgnoreCase("employer")) {
            Optional<Employer> employer = employerRepo.findById(receiver.getId());
            receiverName = employer.get().getCompanyName();
        } else {
            receiverName = "Admin";
        }

        // Fetch messages between sender and receiver
        List<Message> messages = messageRepo.findConversation(sender.getId(), receiver.getId());

        // Map messages to DTOs for frontend
        List<MessageDTO> dtoList = messages.stream().map(msg -> {
            MessageDTO dto = new MessageDTO();

            dto.setMsgId(msg.getMsgId());
            dto.setSenderId(msg.getSender().getId());
            dto.setReceiverId(msg.getReceiver().getId());
            dto.setSenderName(msg.getSender().getId().equals(sender.getId()) ? senderName : receiverName);
            dto.setReceiverName(msg.getReceiver().getId().equals(receiver.getId()) ? receiverName : senderName);
            dto.setContent(msg.getContent());
            dto.setSendTime(msg.getSendTime());
            dto.setReceiveTime(msg.getReceiveTime());
            dto.setStatus(msg.getStatus());
            return dto;

        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    // Mark a message as READ
    public ResponseEntity<String> markAsRead(MessageDTO messageDTO, Authentication authentication) {
        Long msgId = messageDTO.getMsgId();

        Optional<Message> message = messageRepo.findById(msgId);
        if (message.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        }
        Message msg = message.get();

        // Get currently logged-in user
        String email = authentication.getName();
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        User currentUser = userOpt.get();

        // Only receiver can mark message as read
        if (!msg.getReceiver().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to mark this message as read");
        }

        msg.setStatus("READ");
        msg.setReceiveTime(LocalDateTime.now());
        messageRepo.save(msg);
        return ResponseEntity.ok("Message marked READ successfully");
    }

    // Mark a message as DELIVERED
    public ResponseEntity<String> markAsDelivered(MessageDTO messageDTO, Authentication authentication) {
        Long msgId = messageDTO.getMsgId();

        String email = authentication.getName();
        Optional<User> optionalSender = userRepo.findById(messageDTO.getSenderId());
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        if (!sender.getId().equals(messageDTO.getSenderId())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to read these messages");
        }

        Optional<Message> message = messageRepo.findById(msgId);
        if (message.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        }
        Message msg = message.get();

        msg.setStatus("DELIVERED");
        msg.setReceiveTime(LocalDateTime.now());
        messageRepo.save(msg);
        return ResponseEntity.ok("Message marked DELIVERED successfully");
    }

    // Delete a message
    public ResponseEntity<String> deleteMessage(Long msgId, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> optionalSender = userRepo.findByEmail(email);
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        // Fetch message entity
        Optional<Message> message = messageRepo.findById(msgId);
        if (message.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        }
        Message msg = message.get();

        // Only sender can delete their message
        if (msg.getSender().getId().equals(sender.getId())) {
            messageRepo.deleteById(msgId);
            return ResponseEntity.ok(("Message deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You are not allowed to read these messages");
    }

    // Edit a message
    public ResponseEntity<String> editMessage(MessageDTO messageDTO, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> optionalSender = userRepo.findByEmail(email);
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        // Fetch message entity
        Optional<Message> message = messageRepo.findById(messageDTO.getMsgId());
        if (message.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        }
        Message msg = message.get();

        // Only sender can edit their message
        if (msg.getSender().getId().equals(sender.getId())) {
            msg.setContent(messageDTO.getContent());
            messageRepo.save(msg);
            return ResponseEntity.ok(("Message edited successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You are not allowed to edit these messages");
    }

    // Get inbox messages for a user
    public ResponseEntity<?> getInbox(Long userId) {

        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Get latest messages in all user conversations
        List<Message> messages = messageRepo.findLatestMessagesInUserConversations(userId);

        // Filter out self messages
        List<Message> filteredMessages = messages.stream().filter(m -> !m.getSender().getId().equals(m.getReceiver().getId()))  // skip self-msg
                .collect(Collectors.toList());

        if (filteredMessages.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Your Inbox is empty");
        }

        List<MessageDTO> dtoList = new ArrayList<>();
        for (Message message : filteredMessages) {
            MessageDTO dto = new MessageDTO();
            dto.setMsgId(message.getMsgId());
            dto.setSenderId(message.getSender().getId());
            dto.setReceiverId(message.getReceiver().getId());
            dto.setContent(message.getContent());
            dto.setSendTime(message.getSendTime());
            dto.setReceiveTime(message.getReceiveTime());
            dto.setStatus(message.getStatus());

            // Determine chat user (the other participant)
            User chatUser;
            if (message.getSender().getId().equals(userId)) {
                chatUser = message.getReceiver();
            } else {
                chatUser = message.getSender();
            }

            // Get chat user's display name based on role
            String chatUserName;
            if (chatUser.getRole().equalsIgnoreCase("seeker")) {
                chatUserName = seekerRepo.findById(chatUser.getId()).map(s -> s.getFname() + " " + s.getLname()).orElse("Seeker");
            } else if (chatUser.getRole().equalsIgnoreCase("employer")) {
                chatUserName = employerRepo.findById(chatUser.getId()).map(Employer::getCompanyName).orElse("Employer");
            } else {
                chatUserName = "Admin";
            }
            dto.setSenderName(chatUserName);  // you might want to rename this to chatUserName in DTO for clarity

            // Set unread message count for this conversation
            Long unreadCount = messageRepo.countUnreadMessages(userId, chatUser.getId());
            dto.setUnreadCount(unreadCount);

            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }
}
