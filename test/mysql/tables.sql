CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel` varchar(50) NOT NULL,
  `type` enum('agentMessage', 'visitorMessage') NOT NULL,
  `agent_email` varchar(100) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `attachments` text DEFAULT NULL,
  `timestamp` datetime(3) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
