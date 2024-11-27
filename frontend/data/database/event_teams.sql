-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-20 13:58:01
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `guru`
--

-- --------------------------------------------------------

--
-- 資料表結構 `event_teams`
--

CREATE TABLE `event_teams` (
  `team_id` int(5) NOT NULL,
  `registration_id` int(5) NOT NULL,
  `event_id` int(5) NOT NULL,
  `user_id` int(5) NOT NULL COMMENT '隊長的用戶ID',
  `team_name` varchar(100) NOT NULL,
  `captain_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '隊長資訊 JSON格式' CHECK (json_valid(`captain_info`)),
  `valid` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `event_teams`
--
ALTER TABLE `event_teams`
  ADD PRIMARY KEY (`team_id`),
  ADD KEY `registration_id` (`registration_id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `event_teams`
--
ALTER TABLE `event_teams`
  MODIFY `team_id` int(5) NOT NULL AUTO_INCREMENT;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `event_teams`
--
ALTER TABLE `event_teams`
  ADD CONSTRAINT `event_teams_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `event_registration` (`registration_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;