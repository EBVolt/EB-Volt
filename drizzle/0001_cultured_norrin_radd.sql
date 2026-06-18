CREATE TABLE `receipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payment_transaction_id` int NOT NULL,
	`reservation_id` int NOT NULL,
	`user_id` int NOT NULL,
	`receipt_number` varchar(50) NOT NULL,
	`amount` text NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GHS',
	`receipt_url` text,
	`receipt_format` varchar(20) NOT NULL DEFAULT 'pdf',
	`download_count` int NOT NULL DEFAULT 0,
	`last_downloaded_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `receipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `receipts_receipt_number_unique` UNIQUE(`receipt_number`)
);
--> statement-breakpoint
CREATE TABLE `refund_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payment_transaction_id` int NOT NULL,
	`reservation_id` int NOT NULL,
	`user_id` int NOT NULL,
	`refund_amount` text NOT NULL,
	`reason` text NOT NULL,
	`status` enum('pending','approved','rejected','processed','failed') NOT NULL DEFAULT 'pending',
	`refund_transaction_id` varchar(255),
	`refunded_at` timestamp,
	`rejection_reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `refund_requests_id` PRIMARY KEY(`id`)
);
