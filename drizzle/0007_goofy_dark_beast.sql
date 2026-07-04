CREATE TABLE `queued_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`client_ref` varchar(64) NOT NULL,
	`station_id` int,
	`station_name` varchar(255),
	`amount` text NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GHS',
	`phone_number` varchar(20) NOT NULL,
	`kind` varchar(40) NOT NULL DEFAULT 'charging_payment',
	`status` enum('queued','synced','failed') NOT NULL DEFAULT 'synced',
	`client_created_at` timestamp NOT NULL,
	`error_message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `queued_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `queued_transactions_client_ref_unique` UNIQUE(`client_ref`)
);
