CREATE TABLE `charger_status_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`station_id` int NOT NULL,
	`previous_status` varchar(50) NOT NULL,
	`new_status` varchar(50) NOT NULL,
	`changed_by` int,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `charger_status_logs_id` PRIMARY KEY(`id`)
);
