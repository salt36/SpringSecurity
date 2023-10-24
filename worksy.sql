-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: worksy
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calificacion` double DEFAULT NULL,
  `descripcion` text,
  `fecha` text,
  `header` text,
  `ubicacion` text,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `publicaciones`
--

LOCK TABLES `publicaciones` WRITE;
/*!40000 ALTER TABLE `publicaciones` DISABLE KEYS */;
INSERT INTO `publicaciones` VALUES (1,0,'Esta es la primera descripcion','2023-08-27','Primera Publicacion','Medellín',1),(2,0,'Esta es la Segunda descripcion','2023-08-27','Segunda Publicacion','Medellín',1),(3,0,'Esta es la Tercera descripcion','2023-08-27','Tercera Publicacion','Medellín',1),(4,0,'Esta es la Cuarta descripcion','2023-08-27','Cuarta Publicacion','Medellín',1),(5,0,'Esta es la Quinta descripcion','2023-08-27','Quinta Publicacion','Medellín',1),(6,0,'Esta es la Sexta descripcion','2023-08-27','Sexta Publicacion','Medellín',1),(7,0,'Esta es la Septima descripcion','2023-08-27','Septima Publicacion','Medellín',1),(8,0,'Esta es la Octava descripcion','2023-08-27','Octava Publicacion','Medellín',1),(9,0,'Esta es la Novena descripcion','2023-08-27','Novena Publicacion','Medellín',1);
/*!40000 ALTER TABLE `publicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'USER'),(3,'INVITED'),(7,'COLABORATOR\r\n'),(8,'USER'),(9,'USER'),(10,'ADMIN'),(11,'ROLE_ADMIN'),(12,'USER'),(13,'USER'),(14,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (13,1),(3,3),(8,8),(9,9),(10,10),(11,12),(12,13);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(80) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(30) DEFAULT NULL,
  `nombres` varchar(40) NOT NULL,
  `apellidos` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'juancardona06@gmail.com','$2a$10$ThjT8jZ33DsBaOqh5MhnkuukPPJ3Ite.iSkd4Cp1c2zcAhIwbs6Ti','juanka690','Juan Camilo','Cardona'),(8,'JuanGuarin@gmail.com','$2a$10$EEY01VajFwPLViFHeg8IIeh7YhGjptWE2BRJ4mUkdueE.U5u9OUTa','guaro123','Juan David','Guarin Agudelo'),(9,'salome@gmail.com','$2a$10$9I3aaiBes22g21BN1.WxUePDmzDgg23nXmOvQiqMvWjgVdRBsc5b.','salome123','Salome','Roldan'),(10,'admin@worksy.com','$2a$10$S./aXTl4GdXqE9JbBHNOOOB8dG4SROMfb5UmORXgvIGwh3yn2kvtC','admin','Admin','Admin'),(11,'user@worksy.com','$2a$10$1n.vKUnbiTtjFZVNIqUZCOJz1QbACWzCi/RRgc42TGWkaE.H5BL9e','user','User','User'),(12,'marcela@gmail.com','$2a$10$insw2yIeVciWtwBNAlVaF.iPM8jzaCyviCgfi.vCBpX.qjHo8PLOS','sharmcaster','Marcela','Cardona'),(13,'juancardona0606@gmail.com','$2a$10$QarAtc.127MJupnlCjoQZuzvq1VOQf/vtlqq78tELohRI3OO07V0W','juanka690gg','Juan Camilo','Cardona Sánchez');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-27 17:31:05
