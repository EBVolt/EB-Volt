CREATE TABLE `notification_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`channel` enum('email','sms') NOT NULL,
	`category` varchar(50) NOT NULL,
	`recipient` varchar(320) NOT NULL,
	`status` enum('sent','failed','skipped') NOT NULL,
	`skip_reason` varchar(255),
	`error_message` text,
	`subject` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `unsubscribeToken` varchar(64);