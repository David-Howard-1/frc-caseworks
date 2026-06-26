CREATE TABLE `case_notes` (
	`id` varchar(64) NOT NULL,
	`case_id` varchar(64) NOT NULL,
	`program_enrollment_id` varchar(64),
	`author_id` varchar(64) NOT NULL,
	`note_date` date NOT NULL,
	`contact_type` varchar(80),
	`summary` varchar(191),
	`body` text NOT NULL,
	`is_session` boolean NOT NULL DEFAULT true,
	`session_hours` decimal(5,2),
	`is_private` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `case_program_caseworkers` (
	`program_enrollment_id` varchar(64) NOT NULL,
	`caseworker_id` varchar(64) NOT NULL,
	`is_primary` boolean NOT NULL DEFAULT false,
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `case_program_caseworkers_program_enrollment_id_caseworker_id_pk` PRIMARY KEY(`program_enrollment_id`,`caseworker_id`)
);
--> statement-breakpoint
CREATE TABLE `case_program_enrollments` (
	`id` varchar(64) NOT NULL,
	`case_id` varchar(64) NOT NULL,
	`program_id` varchar(64) NOT NULL,
	`supervisor_id` varchar(64),
	`program_enrollment_status` enum('active','pending','completed','inactive','waitlisted') NOT NULL DEFAULT 'pending',
	`start_date` date,
	`target_date` date,
	`end_date` date,
	`goal_summary` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_program_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` varchar(64) NOT NULL,
	`frc_id` varchar(64) NOT NULL,
	`primary_person_id` varchar(64) NOT NULL,
	`case_status` enum('open','pending','closed') NOT NULL DEFAULT 'pending',
	`case_risk` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`opened_at` date,
	`last_contact_at` date,
	`closed_at` date,
	`closure_reason` varchar(191),
	`household_name` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `concrete_services` (
	`id` varchar(64) NOT NULL,
	`case_id` varchar(64) NOT NULL,
	`program_enrollment_id` varchar(64),
	`provided_by_id` varchar(64),
	`service_date` date NOT NULL,
	`category` varchar(120) NOT NULL,
	`description` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL DEFAULT 0,
	`grant_code` varchar(80),
	`grantor` varchar(120),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `concrete_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `frcs` (
	`id` varchar(64) NOT NULL,
	`name` varchar(191) NOT NULL,
	`legal_name` varchar(191),
	`county` varchar(120),
	`state` varchar(2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `frcs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intake_submissions` (
	`id` varchar(64) NOT NULL,
	`frc_id` varchar(64) NOT NULL,
	`case_id` varchar(64),
	`created_by_id` varchar(64) NOT NULL,
	`converted_by_id` varchar(64),
	`intake_status` enum('draft','duplicate_review','rejected','converted_to_case') NOT NULL DEFAULT 'draft',
	`started_at` timestamp NOT NULL,
	`saved_at` timestamp,
	`duplicate_warnings` json,
	`duplicate_override_reason` text,
	`client_snapshot` json,
	`demographic_snapshot` json,
	`address_snapshot` json,
	`income_sources` json,
	`benefits` json,
	`relevant_contacts` json,
	`legal_snapshot` json,
	`housing_snapshot` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intake_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `people` (
	`id` varchar(64) NOT NULL,
	`frc_id` varchar(64) NOT NULL,
	`person_role` enum('client','caregiver','child','household_member','collateral_contact') NOT NULL DEFAULT 'client',
	`first_name` varchar(120),
	`middle_name` varchar(120),
	`last_name` varchar(120),
	`preferred_name` varchar(120),
	`pronouns` varchar(40),
	`approximate_age` varchar(16),
	`date_of_birth` date,
	`phone` varchar(40),
	`email` varchar(191),
	`address_line_1` varchar(191),
	`address_line_2` varchar(191),
	`city` varchar(120),
	`state` varchar(2),
	`postal_code` varchar(20),
	`county` varchar(120),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `people_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `person_relationships` (
	`id` varchar(64) NOT NULL,
	`source_person_id` varchar(64) NOT NULL,
	`related_person_id` varchar(64) NOT NULL,
	`relationship` varchar(80) NOT NULL,
	`lives_in_household` boolean NOT NULL DEFAULT true,
	`related_case_id` varchar(64),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `person_relationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `primary_intakes` (
	`id` varchar(64) NOT NULL,
	`case_id` varchar(64) NOT NULL,
	`completed_by_id` varchar(64),
	`intake_date` date,
	`referral_source` varchar(191),
	`family_strengths` text,
	`presenting_needs` text,
	`safety_concerns` text,
	`household_income` varchar(120),
	`housing` varchar(191),
	`field_values` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `primary_intakes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` varchar(64) NOT NULL,
	`frc_id` varchar(64) NOT NULL,
	`code` varchar(48) NOT NULL,
	`name` varchar(191) NOT NULL,
	`grantor` varchar(120),
	`reporting_type` varchar(80),
	`color` varchar(24),
	`supervisor_id` varchar(64),
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_reports` (
	`id` varchar(64) NOT NULL,
	`frc_id` varchar(64) NOT NULL,
	`name` varchar(191) NOT NULL,
	`grantor` varchar(120) NOT NULL,
	`period_start` date NOT NULL,
	`period_end` date NOT NULL,
	`generated_by_id` varchar(64),
	`metrics` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_programs` (
	`user_id` varchar(64) NOT NULL,
	`program_id` varchar(64) NOT NULL,
	CONSTRAINT `user_programs_user_id_program_id_pk` PRIMARY KEY(`user_id`,`program_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`frc_id` varchar(64) NOT NULL,
	`user_role` enum('caseworker','program_supervisor','executive_director') NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `case_notes` ADD CONSTRAINT `case_notes_case_id_cases_id_fk` FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_notes` ADD CONSTRAINT `case_notes_program_enrollment_id_case_program_enrollments_id_fk` FOREIGN KEY (`program_enrollment_id`) REFERENCES `case_program_enrollments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_notes` ADD CONSTRAINT `case_notes_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_program_caseworkers` ADD CONSTRAINT `case_program_caseworkers_program_enrollment_id_case_program_enrollments_id_fk` FOREIGN KEY (`program_enrollment_id`) REFERENCES `case_program_enrollments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_program_caseworkers` ADD CONSTRAINT `case_program_caseworkers_caseworker_id_users_id_fk` FOREIGN KEY (`caseworker_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_program_enrollments` ADD CONSTRAINT `case_program_enrollments_case_id_cases_id_fk` FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_program_enrollments` ADD CONSTRAINT `case_program_enrollments_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `case_program_enrollments` ADD CONSTRAINT `case_program_enrollments_supervisor_id_users_id_fk` FOREIGN KEY (`supervisor_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cases` ADD CONSTRAINT `cases_frc_id_frcs_id_fk` FOREIGN KEY (`frc_id`) REFERENCES `frcs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cases` ADD CONSTRAINT `cases_primary_person_id_people_id_fk` FOREIGN KEY (`primary_person_id`) REFERENCES `people`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `concrete_services` ADD CONSTRAINT `concrete_services_case_id_cases_id_fk` FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `concrete_services` ADD CONSTRAINT `concrete_services_program_enrollment_id_case_program_enrollments_id_fk` FOREIGN KEY (`program_enrollment_id`) REFERENCES `case_program_enrollments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `concrete_services` ADD CONSTRAINT `concrete_services_provided_by_id_users_id_fk` FOREIGN KEY (`provided_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intake_submissions` ADD CONSTRAINT `intake_submissions_frc_id_frcs_id_fk` FOREIGN KEY (`frc_id`) REFERENCES `frcs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intake_submissions` ADD CONSTRAINT `intake_submissions_case_id_cases_id_fk` FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intake_submissions` ADD CONSTRAINT `intake_submissions_created_by_id_users_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intake_submissions` ADD CONSTRAINT `intake_submissions_converted_by_id_users_id_fk` FOREIGN KEY (`converted_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `people` ADD CONSTRAINT `people_frc_id_frcs_id_fk` FOREIGN KEY (`frc_id`) REFERENCES `frcs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `person_relationships` ADD CONSTRAINT `person_relationships_source_person_id_people_id_fk` FOREIGN KEY (`source_person_id`) REFERENCES `people`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `person_relationships` ADD CONSTRAINT `person_relationships_related_person_id_people_id_fk` FOREIGN KEY (`related_person_id`) REFERENCES `people`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `person_relationships` ADD CONSTRAINT `person_relationships_related_case_id_cases_id_fk` FOREIGN KEY (`related_case_id`) REFERENCES `cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `primary_intakes` ADD CONSTRAINT `primary_intakes_case_id_cases_id_fk` FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `primary_intakes` ADD CONSTRAINT `primary_intakes_completed_by_id_users_id_fk` FOREIGN KEY (`completed_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `programs` ADD CONSTRAINT `programs_frc_id_frcs_id_fk` FOREIGN KEY (`frc_id`) REFERENCES `frcs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `programs` ADD CONSTRAINT `programs_supervisor_id_users_id_fk` FOREIGN KEY (`supervisor_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saved_reports` ADD CONSTRAINT `saved_reports_frc_id_frcs_id_fk` FOREIGN KEY (`frc_id`) REFERENCES `frcs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `saved_reports` ADD CONSTRAINT `saved_reports_generated_by_id_users_id_fk` FOREIGN KEY (`generated_by_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_programs` ADD CONSTRAINT `user_programs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_programs` ADD CONSTRAINT `user_programs_program_id_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_frc_id_frcs_id_fk` FOREIGN KEY (`frc_id`) REFERENCES `frcs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `case_notes_case_date_idx` ON `case_notes` (`case_id`,`note_date`);--> statement-breakpoint
CREATE INDEX `case_notes_program_enrollment_idx` ON `case_notes` (`program_enrollment_id`);--> statement-breakpoint
CREATE INDEX `case_program_caseworkers_caseworker_idx` ON `case_program_caseworkers` (`caseworker_id`,`is_primary`);--> statement-breakpoint
CREATE INDEX `case_program_caseworkers_enrollment_primary_idx` ON `case_program_caseworkers` (`program_enrollment_id`,`is_primary`);--> statement-breakpoint
CREATE INDEX `case_program_enrollments_case_program_idx` ON `case_program_enrollments` (`case_id`,`program_id`);--> statement-breakpoint
CREATE INDEX `cases_frc_status_idx` ON `cases` (`frc_id`,`case_status`);--> statement-breakpoint
CREATE INDEX `cases_primary_person_idx` ON `cases` (`primary_person_id`);--> statement-breakpoint
CREATE INDEX `concrete_services_case_date_idx` ON `concrete_services` (`case_id`,`service_date`);--> statement-breakpoint
CREATE INDEX `concrete_services_grant_date_idx` ON `concrete_services` (`grant_code`,`service_date`);--> statement-breakpoint
CREATE INDEX `intake_submissions_frc_status_idx` ON `intake_submissions` (`frc_id`,`intake_status`);--> statement-breakpoint
CREATE INDEX `intake_submissions_case_idx` ON `intake_submissions` (`case_id`);--> statement-breakpoint
CREATE INDEX `intake_submissions_created_by_idx` ON `intake_submissions` (`created_by_id`);--> statement-breakpoint
CREATE INDEX `people_frc_name_idx` ON `people` (`frc_id`,`last_name`,`first_name`);--> statement-breakpoint
CREATE INDEX `person_relationships_source_idx` ON `person_relationships` (`source_person_id`);--> statement-breakpoint
CREATE INDEX `person_relationships_related_case_idx` ON `person_relationships` (`related_case_id`);--> statement-breakpoint
CREATE INDEX `primary_intakes_case_idx` ON `primary_intakes` (`case_id`);--> statement-breakpoint
CREATE INDEX `programs_frc_code_idx` ON `programs` (`frc_id`,`code`);--> statement-breakpoint
CREATE INDEX `programs_grantor_idx` ON `programs` (`grantor`);--> statement-breakpoint
CREATE INDEX `saved_reports_frc_grantor_idx` ON `saved_reports` (`frc_id`,`grantor`);--> statement-breakpoint
CREATE INDEX `users_frc_role_idx` ON `users` (`frc_id`,`user_role`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);