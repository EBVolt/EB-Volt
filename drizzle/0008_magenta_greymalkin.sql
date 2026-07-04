CREATE TABLE `ussd_payment_intents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference_code` varchar(20) NOT NULL,
	`msisdn` varchar(20) NOT NULL,
	`amount` text NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GHS',
	`station_id` int,
	`station_name` varchar(255),
	`status` enum('pending','processing','completed','failed','expired') NOT NULL DEFAULT 'pending',
	`aggregator_transaction_id` varchar(255),
	`linked_payment_id` int,
	`error_message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ussd_payment_intents_id` PRIMARY KEY(`id`),
	CONSTRAINT `ussd_payment_intents_reference_code_unique` UNIQUE(`reference_code`)
);
--> statement-breakpoint
CREATE TABLE `ussd_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(128) NOT NULL,
	`msisdn` varchar(20) NOT NULL,
	`menu_state` varchar(50) NOT NULL DEFAULT 'main_menu',
	`session_data` text,
	`status` enum('active','completed','timeout','error') NOT NULL DEFAULT 'active',
	`payment_intent_id` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ussd_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `ussd_sessions_session_id_unique` UNIQUE(`session_id`)
);
