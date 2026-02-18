
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin@sf.com','admin123');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
DROP TABLE IF EXISTS `disease_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disease_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_name` varchar(100) DEFAULT NULL,
  `crop` varchar(50) DEFAULT NULL,
  `disease` varchar(100) DEFAULT NULL,
  `confidence` int(11) DEFAULT NULL,
  `risk` varchar(20) DEFAULT NULL,
  `report_date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `disease_reports` DISABLE KEYS */;
INSERT INTO `disease_reports` VALUES (1,'Ramesh Kumar','Potato','Early Blight',91,'High','2025-12-01 10:30:00'),(2,'Sunita Devi','Rice','Blast',88,'Medium','2025-11-29 09:15:00'),(3,'Mohit Sharma','Wheat','Leaf Rust',93,'High','2025-11-25 14:45:00'),(4,'Anita Yadav','Maize','Blight',86,'Medium','2025-11-20 16:20:00'),(6,'MSK KHAN','Wheat','Healthy Leaf',95,'Low','2026-02-18 15:16:57'),(7,'MSK KHAN','Potato','Powdery Mildew',88,'Medium','2026-02-18 16:26:13'),(8,'MSK KHAN','Potato','Powdery Mildew',88,'Medium','2026-02-18 16:26:15'),(9,'MSK KHAN','Potato','Powdery Mildew',88,'Medium','2026-02-18 16:26:15'),(10,'MSK KHAN','Potato','Powdery Mildew',88,'Medium','2026-02-18 16:26:16'),(11,'MSK KHAN','Potato','Powdery Mildew',88,'Medium','2026-02-18 16:26:17'),(12,'MSK KHAN','Potato','Powdery Mildew',88,'Medium','2026-02-18 16:26:17');
/*!40000 ALTER TABLE `disease_reports` ENABLE KEYS */;
DROP TABLE IF EXISTS `soil_parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `soil_parameter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmer_name` varchar(100) DEFAULT NULL,
  `nitrogen` int(11) DEFAULT NULL,
  `phosphorus` int(11) DEFAULT NULL,
  `potassium` int(11) DEFAULT NULL,
  `ph` float DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `soil_parameter` DISABLE KEYS */;
INSERT INTO `soil_parameter` VALUES (1,'Ramesh',50,40,30,6.5,'2026-02-18 15:40:25'),(2,'Sunita',60,35,40,7,'2026-02-18 15:40:25'),(3,'MSK KHAN',50,50,20,0,'2026-02-18 16:25:09');
/*!40000 ALTER TABLE `soil_parameter` ENABLE KEYS */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `mobile_no` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `village` varchar(255) DEFAULT NULL,
  `crop` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

