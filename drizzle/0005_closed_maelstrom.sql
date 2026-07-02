ALTER TABLE `users` ADD `emailBookingConfirmation` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailPaymentReceipt` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailRefundStatus` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `emailPromotions` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `smsBookingConfirmation` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `smsPaymentReceipt` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `smsRefundStatus` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `smsPromotions` boolean DEFAULT false NOT NULL;