-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: hotel_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,1,'/balatodalar/Artist Antik 1/1e1.jpg','2025-09-17 12:52:12'),(2,1,'/balatodalar/Artist Antik 1/1e2.jpg','2025-09-17 12:52:12'),(3,1,'/balatodalar/Artist Antik 1/1e3.jpg','2025-09-17 12:52:12'),(4,1,'/balatodalar/Artist Antik 1/1e4.jpg','2025-09-17 12:52:12'),(5,1,'/balatodalar/Artist Antik 1/1e5.jpg','2025-09-17 12:52:12'),(6,1,'/balatodalar/Artist Antik 1/1e6.jpg','2025-09-17 12:52:12'),(7,1,'/balatodalar/Artist Antik 1/1e7.jpg','2025-09-17 12:52:12'),(8,1,'/balatodalar/Artist Antik 1/1e8.jpg','2025-09-17 12:52:12'),(9,1,'/balatodalar/Artist Antik 1/1e9.jpg','2025-09-17 12:52:12'),(10,1,'/balatodalar/Artist Antik 1/aortak1.jpg','2025-09-17 12:52:12'),(11,1,'/balatodalar/Artist Antik 1/aortak2.jpg','2025-09-17 12:52:12'),(12,1,'/balatodalar/Artist Antik 1/aortak3.jpg','2025-09-17 12:52:12'),(13,1,'/balatodalar/Artist Antik 1/aortak4.jpg','2025-09-17 12:52:12'),(14,1,'/balatodalar/Artist Antik 1/aortak5.jpg','2025-09-17 12:52:12'),(15,1,'/balatodalar/Artist Antik 1/aortak6.jpg','2025-09-17 12:52:12'),(16,1,'/balatodalar/Artist Antik 1/aortak7.jpg','2025-09-17 12:52:12'),(17,1,'/balatodalar/Artist Antik 1/aortak9.jpg','2025-09-17 12:52:12'),(18,1,'/balatodalar/Artist Antik 1/aortak10.jpg','2025-09-17 12:52:12'),(19,2,'/balatodalar/Artist Antik 2/2ye1.jpg','2025-09-17 12:53:32'),(20,2,'/balatodalar/Artist Antik 2/2ye2.jpg','2025-09-17 12:53:32'),(21,2,'/balatodalar/Artist Antik 2/2ye3.jpg','2025-09-17 12:53:32'),(22,2,'/balatodalar/Artist Antik 2/2ye4.jpg','2025-09-17 12:53:32'),(23,2,'/balatodalar/Artist Antik 2/2ye5.jpg','2025-09-17 12:53:32'),(24,2,'/balatodalar/Artist Antik 2/2ye6.jpg','2025-09-17 12:53:32'),(25,2,'/balatodalar/Artist Antik 2/2ye7.jpg','2025-09-17 12:53:32'),(26,2,'/balatodalar/Artist Antik 2/2ye8.jpg','2025-09-17 12:53:32'),(27,2,'/balatodalar/Artist Antik 2/2ye9.jpg','2025-09-17 12:53:32'),(28,2,'/balatodalar/Artist Antik 2/2ye10.jpg','2025-09-17 12:53:32'),(29,2,'/balatodalar/Artist Antik 2/aortak2.jpg','2025-09-17 12:53:32'),(30,2,'/balatodalar/Artist Antik 2/aortak3.jpg','2025-09-17 12:53:32'),(31,2,'/balatodalar/Artist Antik 2/aortak4.jpg','2025-09-17 12:53:32'),(32,2,'/balatodalar/Artist Antik 2/aortak5.jpg','2025-09-17 12:53:32'),(33,2,'/balatodalar/Artist Antik 2/aortak6.jpg','2025-09-17 12:53:32'),(34,2,'/balatodalar/Artist Antik 2/aortak7.jpg','2025-09-17 12:53:32'),(35,2,'/balatodalar/Artist Antik 2/aortak9.jpg','2025-09-17 12:53:32'),(36,2,'/balatodalar/Artist Antik 2/aortak10.jpg','2025-09-17 12:53:32'),(37,3,'/balatodalar/Artist Antik 3/3e1.jpg','2025-09-17 13:02:30'),(38,3,'/balatodalar/Artist Antik 3/3e2.jpg','2025-09-17 13:02:30'),(39,3,'/balatodalar/Artist Antik 3/3e3.jpg','2025-09-17 13:02:30'),(40,3,'/balatodalar/Artist Antik 3/3e4.jpg','2025-09-17 13:02:30'),(41,3,'/balatodalar/Artist Antik 3/aortak1.jpg','2025-09-17 13:02:30'),(42,3,'/balatodalar/Artist Antik 3/aortak2.jpg','2025-09-17 13:02:30'),(43,3,'/balatodalar/Artist Antik 3/aortak3.jpg','2025-09-17 13:02:30'),(44,3,'/balatodalar/Artist Antik 3/aortak4.jpg','2025-09-17 13:02:30'),(45,3,'/balatodalar/Artist Antik 3/aortak5.jpg','2025-09-17 13:02:30'),(46,3,'/balatodalar/Artist Antik 3/aortak6.jpg','2025-09-17 13:02:30'),(47,3,'/balatodalar/Artist Antik 3/aortak7.jpg','2025-09-17 13:02:30'),(48,3,'/balatodalar/Artist Antik 3/aortak9.jpg','2025-09-17 13:02:30'),(49,3,'/balatodalar/Artist Antik 3/aortak10.jpg','2025-09-17 13:02:30'),(50,4,'/balatodalar/Pinkom 1/pinkom1.jpg','2025-09-17 13:05:55'),(51,4,'/balatodalar/Pinkom 1/pinkom2.jpg','2025-09-17 13:05:55'),(52,4,'/balatodalar/Pinkom 1/pinkom4.jpg','2025-09-17 13:05:55'),(53,4,'/balatodalar/Pinkom 1/pinkom5.jpg','2025-09-17 13:05:55'),(54,4,'/balatodalar/Pinkom 1/pinkom6.jpg','2025-09-17 13:05:55'),(55,4,'/balatodalar/Pinkom 1/pinkom7.jpg','2025-09-17 13:05:55'),(56,4,'/balatodalar/Pinkom 1/pinkom8.jpg','2025-09-17 13:05:55'),(57,4,'/balatodalar/Pinkom 1/pinkom9.jpg','2025-09-17 13:05:55'),(58,4,'/balatodalar/Pinkom 1/pinkom10.jpg','2025-09-17 13:05:55'),(59,5,'/balatodalar/Pinkom 2/pinkom2ye1.jpg','2025-09-17 13:08:23'),(60,5,'/balatodalar/Pinkom 2/pinkom2ye2.jpg','2025-09-17 13:08:23'),(61,5,'/balatodalar/Pinkom 2/pinkom2ye3.jpg','2025-09-17 13:08:23'),(62,5,'/balatodalar/Pinkom 2/pinkom2ye4.jpg','2025-09-17 13:08:23'),(63,5,'/balatodalar/Pinkom 2/pinkom2ye5.jpg','2025-09-17 13:08:23'),(64,5,'/balatodalar/Pinkom 2/pinkom24.jpg','2025-09-17 13:08:23'),(65,5,'/balatodalar/Pinkom 2/pinkom242.jpg','2025-09-17 13:08:23'),(66,6,'/balatodalar/Pinkom 3/pinkom3e1.jpg','2025-09-17 13:12:13'),(67,6,'/balatodalar/Pinkom 3/pinkom3e2.jpg','2025-09-17 13:12:13'),(68,6,'/balatodalar/Pinkom 3/pinkom3e3.jpg','2025-09-17 13:12:13'),(69,6,'/balatodalar/Pinkom 3/pinkom3e4.jpg','2025-09-17 13:12:13'),(70,6,'/balatodalar/Pinkom 3/pinkom3e5.jpg','2025-09-17 13:12:13'),(71,6,'/balatodalar/Pinkom 3/pinkom3e6.jpg','2025-09-17 13:12:13'),(72,6,'/balatodalar/Pinkom 3/pinkom3e7.jpg','2025-09-17 13:12:13'),(73,6,'/balatodalar/Pinkom 3/pinkom35.jpg','2025-09-17 13:12:13'),(74,6,'/balatodalar/Pinkom 3/pinkom352.jpg','2025-09-17 13:12:13'),(75,6,'/balatodalar/Pinkom 3/pinkom353.jpg','2025-09-17 13:12:13'),(76,7,'/balatodalar/Pinkom 4/pinkom4e1.jpg','2025-09-17 13:18:47'),(77,7,'/balatodalar/Pinkom 4/pinkom4e2.jpg','2025-09-17 13:18:47'),(78,7,'/balatodalar/Pinkom 4/pinkom4e3.jpg','2025-09-17 13:18:47'),(79,7,'/balatodalar/Pinkom 4/pinkom4e4.jpg','2025-09-17 13:18:47'),(80,7,'/balatodalar/Pinkom 4/pinkom4e5.jpg','2025-09-17 13:18:47'),(81,7,'/balatodalar/Pinkom 4/pinkom24.jpg','2025-09-17 13:18:47'),(82,7,'/balatodalar/Pinkom 4/pinkom242.jpg','2025-09-17 13:18:47'),(83,8,'/balatodalar/Pinkom 5/pinkom5e1.jpg','2025-09-17 13:21:12'),(84,8,'/balatodalar/Pinkom 5/pinkom5e2.jpg','2025-09-17 13:21:12'),(85,8,'/balatodalar/Pinkom 5/pinkom5e3.jpg','2025-09-17 13:21:12'),(86,8,'/balatodalar/Pinkom 5/pinkom5e4.jpg','2025-09-17 13:21:12'),(87,8,'/balatodalar/Pinkom 5/pinkom35.jpg','2025-09-17 13:21:12'),(88,8,'/balatodalar/Pinkom 5/pinkom352.jpg','2025-09-17 13:21:12'),(89,8,'/balatodalar/Pinkom 5/pinkom353.jpg','2025-09-17 13:21:12');
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-19 21:48:57
