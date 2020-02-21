CREATE DATABASE `scheduler`;
USE scheduler;

CREATE TABLE `appointments` (
  `id` int(20) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  `customer` varchar(30) NOT NULL,
  `time` timestamp NOT NULL,
  `notes` text DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL
);

INSERT INTO `appointments`(customer, price, time) VALUES ('David', 225.00, '2020-02-18 14:00:00');
INSERT INTO `appointments`(customer, price, time) VALUES ('Jason', 320.00, '2020-02-10 15:00:00');
INSERT INTO `appointments`(customer, price, time) VALUES ('Melissa', 225.00, '2020-02-20 12:50:00');
INSERT INTO `appointments`(customer, price, time) VALUES ('Sarah', 400.00, '2020-02-18 14:30:00');
INSERT INTO `appointments`(customer, price, time) VALUES ('John', 100.00, '2020-02-22 10:00:00');
INSERT INTO `appointments`(customer, price, time) VALUES ('Max', 240.00, '2020-02-23 20:30:00');
