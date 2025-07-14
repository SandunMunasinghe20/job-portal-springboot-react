package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepo extends JpaRepository<Message, Long> {

    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderBySendTimeAsc(
            Long senderId1, Long receiverId1, Long senderId2, Long receiverId2);

    @Query("SELECT m FROM Message m where "+
            "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
            "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
            "ORDER BY m.sendTime ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
