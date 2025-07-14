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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private final UserRepo userRepo;
    @Autowired
    private MessageRepo messageRepo;
    @Autowired
    private SeekerRepo seekerRepo;
    @Autowired
    private EmployerRepo employerRepo;

    public MessageService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    //send
    public ResponseEntity<String> sendMessage(MessageDTO messageDTO) {
        //sender
        Optional<User> optionalSender = userRepo.findById(messageDTO.getSenderId());
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        //check for receiver
        Optional<User> optionalReceiver = userRepo.findById(messageDTO.getReceiverId());
        if (optionalReceiver.isEmpty()) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        User receiver = optionalReceiver.get();

        Message message = new Message();
        message.setReceiver(receiver);
        message.setSender(sender);
        message.setContent(messageDTO.getContent());
        message.setSendTime(LocalDateTime.now());
        messageRepo.save(message);
        return ResponseEntity.ok("Message sent Successfully");
    }

    //receive
    public ResponseEntity<?> getConversation(MessageDTO messageDTO) {


        //sender
        Optional<User> optionalSender = userRepo.findById(messageDTO.getSenderId());
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();



       //receiver
        Optional<User> optionalReceiver = userRepo.findById(messageDTO.getReceiverId());
        if (optionalReceiver.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receiver not found");
        }
        User receiver = optionalReceiver.get();


// Validate only seeker <> employer <> admin allowed
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
        final String receiverName ;

// Get sender's name based on role
        if (sender.getRole().equalsIgnoreCase("seeker")) {
            Optional<Seeker> seeker = seekerRepo.findById(sender.getId());
            senderName = seeker.get().getFname()+" "+seeker.get().getLname();
        } else if (sender.getRole().equalsIgnoreCase("employer")) {
            Optional<Employer> employer = employerRepo.findById(sender.getId());
            senderName = employer.get().getCompanyName();
        } else {
            senderName = "Admin";
        }

// Get receiver's name based on role
        if (receiver.getRole().equalsIgnoreCase("seeker")) {
            Optional<Seeker> seeker = seekerRepo.findById(receiver.getId());
            receiverName = seeker.get().getFname()+" "+seeker.get().getLname();
        } else if (receiver.getRole().equalsIgnoreCase("employer")) {
            Optional<Employer> employer = employerRepo.findById(receiver.getId());
            receiverName = employer.get().getCompanyName();
        } else {
            receiverName = "Admin";
        }

        System.out.println("senderName: " + senderName+" receiverName: " + receiverName);


        //get all msg entities
        List<Message> messages = messageRepo.findConversation(sender.getId(), receiver.getId());



        //map into a dto
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
        System.out.println("messages: " + messages);
        return ResponseEntity.ok(dtoList);
    }


    public ResponseEntity<String> markAsRead(MessageDTO messageDTO, Authentication authentication) {
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

        msg.setStatus("READ");
        messageRepo.save(msg);
        return ResponseEntity.ok("Message marked READ successfully");
    }

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

    public ResponseEntity<String> deleteMessage(Long msgId, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> optionalSender = userRepo.findByEmail(email);
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        //msg
        Optional<Message> message = messageRepo.findById(msgId);
        if (message.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        }
        Message msg = message.get();

        if (msg.getSender().getId().equals(sender.getId())) {
            messageRepo.deleteById(msgId);
            return ResponseEntity.ok(("Message deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You are not allowed to read these messages");
    }

    public ResponseEntity<String> editMessage(MessageDTO messageDTO, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> optionalSender = userRepo.findByEmail(email);
        if (optionalSender.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sender not found");
        }
        User sender = optionalSender.get();

        //msg
        Optional<Message> message = messageRepo.findById(messageDTO.getMsgId());
        if (message.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
        }
        Message msg = message.get();

        if (msg.getSender().getId().equals(sender.getId())) {
            msg.setContent(messageDTO.getContent());
            messageRepo.save(msg);
            return ResponseEntity.ok(("Message edited successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You are not allowed to edit these messages");
    }
}
