package com.example.job.portal.Repository;

import com.example.job.portal.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MessageRepo extends JpaRepository<Message, Long> {

    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderBySendTimeAsc(
            Long senderId1, Long receiverId1, Long senderId2, Long receiverId2);

    @Query("SELECT m FROM Message m where "+
            "(m.sender.id = :userId1 AND m.receiver.id = :userId2) OR " +
            "(m.sender.id = :userId2 AND m.receiver.id = :userId1) " +
            "ORDER BY m.sendTime ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    @Query("""
SELECT m FROM Message m
WHERE m.sendTime IN (
    SELECT MAX(m2.sendTime) FROM Message m2
    WHERE (m2.sender.id = :userId OR m2.receiver.id = :userId)
      AND m2.sender.id <> m2.receiver.id
    GROUP BY 
        CASE 
            WHEN m2.sender.id < m2.receiver.id THEN CONCAT(m2.sender.id, '-', m2.receiver.id)
            ELSE CONCAT(m2.receiver.id, '-', m2.sender.id)
        END
)
AND m.sender.id <> m.receiver.id
ORDER BY m.sendTime DESC
""")
    List<Message> findLatestMessagesInUserConversations(@Param("userId") Long userId);



    @Query("""
SELECT COUNT(m) FROM Message m
WHERE m.receiver.id = :userId 
  AND m.sender.id = :senderId 
  AND m.status IN ('SENT', 'DELIVERED')
""")
    Long countUnreadMessages(@Param("userId") Long userId, @Param("senderId") Long senderId);



}
