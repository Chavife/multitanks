-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Hostiteľ: localhost
-- Čas generovania: St 19.Apr 2017, 14:26
-- Verzia serveru: 10.1.21-MariaDB
-- Verzia PHP: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáza: `tanks`
--

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `Fights`
--

CREATE TABLE `Fights` (
  `ID` int(11) NOT NULL,
  `fight_start` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fight_end` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `team_win` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `Kills`
--

CREATE TABLE `Kills` (
  `ID` int(11) NOT NULL,
  `in_fight` int(11) NOT NULL,
  `tank_kill` int(11) NOT NULL,
  `tank_death` int(11) NOT NULL,
  `at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `damage_done` int(11) NOT NULL,
  `damage_taken` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `Tanks`
--

CREATE TABLE `Tanks` (
  `ID` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `damage` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `shield` int(11) NOT NULL,
  `tank_rotation_speed` int(11) NOT NULL,
  `barrel_rotation_speed` int(11) NOT NULL,
  `tank_speed` int(11) NOT NULL,
  `shoot_speed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Sťahujem dáta pre tabuľku `Tanks`
--

INSERT INTO `Tanks` (`ID`, `owner_id`, `damage`, `health`, `shield`, `tank_rotation_speed`, `barrel_rotation_speed`, `tank_speed`, `shoot_speed`) VALUES
(1, 9, 20, 20, 20, 20, 20, 20, 19),
(2, 10, 5, 3, 2, 10, 1, 7, 1),
(3, 11, 1, 1, 1, 1, 1, 1, 1),
(4, 12, 1, 1, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `tanks_in_fight`
--

CREATE TABLE `tanks_in_fight` (
  `tank_id` int(11) NOT NULL,
  `fight_id` int(11) NOT NULL,
  `team` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Štruktúra tabuľky pre tabuľku `Users`
--

CREATE TABLE `Users` (
  `ID` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `login_name` varchar(100) NOT NULL,
  `currency` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Sťahujem dáta pre tabuľku `Users`
--

INSERT INTO `Users` (`ID`, `user_name`, `password`, `login_name`, `currency`) VALUES
(3, 'Chavife', '$2a$10$HTuyywJ1miAR60l2f/wJ6e/F3v5RBeGfvEMwoW5t77eBISlBCOVmu', 'Chavife', 10000),
(6, 'nieco', '$2a$10$lSHZKuR7v1RT1UzbD.rRS.yzf747fz1gc/6Aoj3mf2E6PUCb91l0K', 'nieco', 10000),
(7, 'user', '$2a$10$DWiKY6M8bgCTjvSjTIY7H.382SpU8GoJ5zfatudwKPCV/jXm2OST6', 'user', 10000),
(8, 'test', '$2a$10$DnVkVHtfMqbBDxXAEe4m7OrOAZ/gP1ch06kbjx7ZNKBXBRihOkzLi', 'test', 10000),
(9, 'FastLogin1', '$2a$10$RRKESbTG9oUkS3KwyJzGCugVkqvFuZABtIIwMHfBcBrJA6IsYkNgi', '1', 17000),
(10, 'Lacko', '$2a$10$GS2oyRHvGUU20M1qNQp3Lek0OW0cKgEvJLcSCvBEKnMLWLwQwR02m', 'feldsam', 500),
(11, 'dvojka', '$2a$10$vGVp8AIUaTGLLu7Uxn6.ieCN3qP9WwZcEIbCeFCA8T14Wl1wkTkHy', '2', 10000),
(12, 'trojka', '$2a$10$aRSYpKsbtLA83Tuu7wcHaOwMlvXI0YxXElflvNjtR9TTcf7o4PJu.', '3', 10000);

--
-- Kľúče pre exportované tabuľky
--

--
-- Indexy pre tabuľku `Fights`
--
ALTER TABLE `Fights`
  ADD PRIMARY KEY (`ID`);

--
-- Indexy pre tabuľku `Kills`
--
ALTER TABLE `Kills`
  ADD PRIMARY KEY (`ID`);

--
-- Indexy pre tabuľku `Tanks`
--
ALTER TABLE `Tanks`
  ADD PRIMARY KEY (`ID`);

--
-- Indexy pre tabuľku `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT pre exportované tabuľky
--

--
-- AUTO_INCREMENT pre tabuľku `Fights`
--
ALTER TABLE `Fights`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pre tabuľku `Kills`
--
ALTER TABLE `Kills`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pre tabuľku `Tanks`
--
ALTER TABLE `Tanks`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pre tabuľku `Users`
--
ALTER TABLE `Users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
