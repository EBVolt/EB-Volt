CREATE TABLE `charging_reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`station_id` int NOT NULL,
	`reservation_date` timestamp NOT NULL,
	`duration_minutes` int NOT NULL,
	`estimated_cost` text NOT NULL,
	`status` enum('pending','confirmed','active','completed','cancelled') NOT NULL DEFAULT 'pending',
	`phone_number` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `charging_reservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `charging_stations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`latitude` text NOT NULL,
	`longitude` text NOT NULL,
	`charger_type` varchar(50) NOT NULL,
	`total_slots` int NOT NULL DEFAULT 4,
	`available_slots` int NOT NULL DEFAULT 4,
	`price_per_kwh` text NOT NULL,
	`amenities` text,
	`rating` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `charging_stations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservation_id` int NOT NULL,
	`user_id` int NOT NULL,
	`amount` text NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'GHS',
	`phone_number` varchar(20) NOT NULL,
	`transaction_id` varchar(255),
	`reference_id` varchar(255),
	`status` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`payment_method` varchar(50) NOT NULL DEFAULT 'MTN_MOMO',
	`momo_transaction_ref` varchar(255),
	`error_message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_transactions_transaction_id_unique` UNIQUE(`transaction_id`),
	CONSTRAINT `payment_transactions_reference_id_unique` UNIQUE(`reference_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
