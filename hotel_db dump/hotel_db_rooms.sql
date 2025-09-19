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
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `size` int DEFAULT NULL,
  `maxPerson` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_lg` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Artist Antik Oda 1','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',30,1,68867.00,'/balatodalar/Artist Antik 1/1e4.jpg','/balatodalar/Artist Antik 1/1e4.jpg','2025-09-17 12:52:12'),(2,'Artist Antik Oda 2','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',70,2,8000.00,'/balatodalar/Artist Antik 2/2ye2.jpg','/balatodalar/Artist Antik 2/2ye2.jpg','2025-09-17 12:53:32'),(3,'Artist Antik Oda 3','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',50,3,265.00,'/balatodalar/Artist Antik 3/3e4.jpg','/balatodalar/Artist Antik 3/3e4.jpg','2025-09-17 13:02:30'),(4,'Pink Home Oda 1','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',90,5,45555.00,'/balatodalar/Pinkom 1/pinkom1.jpg','/balatodalar/Pinkom 1/pinkom1.jpg','2025-09-17 13:05:55'),(5,'Pink Home Oda 2','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',90,5,320.00,'/balatodalar/Pinkom 2/pinkom2ye1.jpg','/balatodalar/Pinkom 2/pinkom2ye1.jpg','2025-09-17 13:08:23'),(6,'Pink Home Oda 3','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',45,6,344.00,'/balatodalar/Pinkom 3/pinkom3e1.jpg','/balatodalar/Pinkom 3/pinkom3e1.jpg','2025-09-17 13:12:13'),(7,'Pink Home Oda 4','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',84,7,389.00,'/balatodalar/Pinkom 4/pinkom4e2.jpg','/balatodalar/Pinkom 4/pinkom4e2.jpg','2025-09-17 13:18:47'),(8,'Pink Home Oda 5','Konforlu ve şık dekore edilmiş odamızda unutulmaz bir konaklama deneyimi yaşayın. Merkezi konumu ve modern olanaklarıyla ideal bir tatil için tercih edebilirsiniz.',48,8,500.00,'/balatodalar/Pinkom 5/pinkom5e1.jpg','/balatodalar/Pinkom 5/pinkom5e1.jpg','2025-09-17 13:21:12');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
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
