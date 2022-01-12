CREATE TABLE IF NOT EXISTS `inzet` (
`m_code` int(4) NOT NULL,
  `ws_id` int(2) NOT NULL,
  `m_id` int(2) NOT NULL,
  `start` date NOT NULL,
  `eind` date DEFAULT NULL
) AUTO_INCREMENT=3925 DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

INSERT INTO `inzet` (`m_code`, `ws_id`, `m_id`, `start`, `eind`) VALUES
(3080, 3, 12, '2009-01-07', NULL),
(3134, 3, 6, '2008-09-28', NULL),
(3226, 3, 8, '2005-10-04', NULL),
(3251, 2, 15, '2016-03-27', NULL),
(3338, 5, 15, '2010-01-01', '2010-06-01'),
(3356, 2, 9, '2016-03-27', NULL),
(3412, 4, 2, '2005-10-04', '2007-09-09'),
(3512, 4, 4, '2007-09-09', '2011-12-20'),
(3582, 1, 7, '2007-07-14', NULL),
(3607, 4, 5, '2011-12-20', NULL),
(3637, 1, 12, '2007-07-14', NULL),
(3664, 5, 7, '2017-07-14', NULL),
(3681, 3, 2, '2005-10-04', '2008-09-28'),
(3721, 2, 1, '2016-03-27', NULL),
(3847, 3, 13, '2005-10-04', '2009-01-07'),
(3913, 5, 8, '2010-01-01', NULL),
(3918, 1, 5, '2007-07-14', NULL),
(3922, 5, 12, '2005-10-04', NULL),
(3924, 5, 2, '2005-10-04', '2008-10-30');

CREATE TABLE IF NOT EXISTS `meters` (
`m_id` int(2) NOT NULL,
  `type` text COLLATE latin1_german1_ci NOT NULL,
  `merk` text COLLATE latin1_german1_ci NOT NULL,
  `voeding` text COLLATE latin1_german1_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

INSERT INTO `meters` (`m_id`, `type`, `merk`, `voeding`) VALUES
(1, 'luchtdruk', 'Samsung', '5V'),
(2, 'luchtdruk', 'Samsung', '12V'),
(3, 'luchtdruk', 'Philips', '5V'),
(4, 'luchtdruk', 'Philips', '5V'),
(5, 'luchtdruk', 'Vavetech', '5V'),
(6, 'luchtdruk', 'Vavetech', '12V'),
(7, 'luchtdruk', 'Vavetech', '5V'),
(8, 'windkracht', 'Vavetech', '3V'),
(9, 'windkracht', 'Samsung', '5V'),
(10, 'windkracht', 'Samsung', '5V'),
(11, 'windkracht', 'Samsung', '3V'),
(12, 'temperatuur', 'Vavetech', '5V'),
(13, 'temperatuur', 'Philips', '5V'),
(14, 'temperatuur', 'Philips', '5V'),
(15, 'temperatuur', 'Samsung', '5V'),
(16, 'temperatuur', 'Samsung', '12V'),
(17, 'temperatuur', 'Samsung', '3V'),
(18, 'temperatuur', 'Samsung', '3V');

CREATE TABLE IF NOT EXISTS `stations` (
`ws_id` int(2) NOT NULL,
  `plaats` text COLLATE latin1_german1_ci NOT NULL,
  `beheerder` varchar(32) COLLATE latin1_german1_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_german1_ci;

INSERT INTO `stations` (`ws_id`, `plaats`, `beheerder`) VALUES
(1, 'Zuidhorn', 'Van der Veen'),
(2, 'Groningen', 'Velthuizen'),
(3, 'Groningen', 'Grgurina'),
(4, 'Bedum', 'Palsma'),
(5, 'Garrelsweer', 'Osinga');


ALTER TABLE `inzet`
 ADD PRIMARY KEY (`m_code`);

ALTER TABLE `meters`
 ADD PRIMARY KEY (`m_id`);

ALTER TABLE `stations`
 ADD PRIMARY KEY (`ws_id`);

ALTER TABLE `inzet`
MODIFY `m_code` int(4) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3925;

ALTER TABLE `meters`
MODIFY `m_id` int(2) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;

ALTER TABLE `stations`
MODIFY `ws_id` int(2) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
