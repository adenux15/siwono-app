CREATE TABLE `albums` (
	`id` text PRIMARY KEY NOT NULL,
	`rack_id` text NOT NULL,
	`row_pos` integer NOT NULL,
	`col_pos` integer NOT NULL,
	`code` text NOT NULL,
	`capacity` integer DEFAULT 100 NOT NULL,
	`current_fill` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`rack_id`) REFERENCES `racks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `archives` (
	`id` text PRIMARY KEY NOT NULL,
	`archive_number` text NOT NULL,
	`owner_name` text,
	`status` text DEFAULT 'Tersedia' NOT NULL,
	`album_id` text NOT NULL,
	`region_code` text,
	`doc_type` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loan_transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`loan_id` text NOT NULL,
	`from_user_id` text NOT NULL,
	`to_user_id` text NOT NULL,
	`transfer_date` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`archive_id` text NOT NULL,
	`initial_user_id` text NOT NULL,
	`borrow_date` integer NOT NULL,
	`due_date` integer NOT NULL,
	`status` text DEFAULT 'Berjalan' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`archive_id`) REFERENCES `archives`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`initial_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`loan_id` text,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loan_id`) REFERENCES `loans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `racks` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text NOT NULL,
	`code` text NOT NULL,
	`rows` integer NOT NULL,
	`cols` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`admin_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'petugas' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);