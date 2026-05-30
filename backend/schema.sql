-- Online Kitaplık & Yorum Platformu (MySQL 8+)

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS `online_kitaplik`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Eğer .env ile farklı DB_NAME kullanacaksan bu USE satırını güncelleyebilirsin.
USE `online_kitaplik`;

-- Güvenli yeniden kurulum için sırayla drop (FK bağımlılıklarına göre)
DROP TABLE IF EXISTS `okuma_listesi`;
DROP TABLE IF EXISTS `yorumlar`;
DROP TABLE IF EXISTS `sorular`;
DROP TABLE IF EXISTS `galeri`;
DROP TABLE IF EXISTS `haberler`;
DROP TABLE IF EXISTS `kitaplar`;
DROP TABLE IF EXISTS `kategoriler`;
DROP TABLE IF EXISTS `yazarlar`;
DROP TABLE IF EXISTS `kullanicilar`;
DROP TABLE IF EXISTS `ziyaretci`;

CREATE TABLE `kullanicilar` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kullanici_adi` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `sifre` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin','kullanici') NOT NULL DEFAULT 'kullanici',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kullanicilar_email` (`email`),
  UNIQUE KEY `uq_kullanicilar_kullanici_adi` (`kullanici_adi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `yazarlar` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ad` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `biyografi` TEXT NULL,
  `foto` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_yazarlar_slug` (`slug`),
  KEY `idx_yazarlar_ad` (`ad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kategoriler` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ad` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kategoriler_slug` (`slug`),
  KEY `idx_kategoriler_ad` (`ad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kitaplar` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `baslik` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(300) NOT NULL,
  `yazar_id` INT UNSIGNED NOT NULL,
  `kategori_id` INT UNSIGNED NOT NULL,
  `aciklama` TEXT NULL,
  `kapak` VARCHAR(255) NULL,
  `sayfa_sayisi` INT UNSIGNED NULL,
  `yayin_yili` SMALLINT UNSIGNED NULL,
  `goruntuleme` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_kitaplar_slug` (`slug`),
  KEY `idx_kitaplar_baslik` (`baslik`),
  KEY `idx_kitaplar_yazar_id` (`yazar_id`),
  KEY `idx_kitaplar_kategori_id` (`kategori_id`),
  KEY `idx_kitaplar_goruntuleme` (`goruntuleme`),
  CONSTRAINT `fk_kitaplar_yazarlar` FOREIGN KEY (`yazar_id`) REFERENCES `yazarlar` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_kitaplar_kategoriler` FOREIGN KEY (`kategori_id`) REFERENCES `kategoriler` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `yorumlar` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kitap_id` INT UNSIGNED NOT NULL,
  `kullanici_id` INT UNSIGNED NOT NULL,
  `yorum` TEXT NOT NULL,
  `puan` TINYINT UNSIGNED NOT NULL,
  `onaylandi` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_yorumlar_kitap_id` (`kitap_id`),
  KEY `idx_yorumlar_kullanici_id` (`kullanici_id`),
  KEY `idx_yorumlar_onaylandi` (`onaylandi`),
  KEY `idx_yorumlar_created_at` (`created_at`),
  CONSTRAINT `chk_yorumlar_puan` CHECK (`puan` BETWEEN 1 AND 5),
  CONSTRAINT `fk_yorumlar_kitaplar` FOREIGN KEY (`kitap_id`) REFERENCES `kitaplar` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_yorumlar_kullanicilar` FOREIGN KEY (`kullanici_id`) REFERENCES `kullanicilar` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `okuma_listesi` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kullanici_id` INT UNSIGNED NOT NULL,
  `kitap_id` INT UNSIGNED NOT NULL,
  `durum` ENUM('okuyorum','okudum','okuyacagim') NOT NULL DEFAULT 'okuyacagim',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_okuma_listesi_user_book` (`kullanici_id`, `kitap_id`),
  KEY `idx_okuma_listesi_kitap_id` (`kitap_id`),
  KEY `idx_okuma_listesi_durum` (`durum`),
  CONSTRAINT `fk_okuma_listesi_kullanicilar` FOREIGN KEY (`kullanici_id`) REFERENCES `kullanicilar` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_okuma_listesi_kitaplar` FOREIGN KEY (`kitap_id`) REFERENCES `kitaplar` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `haberler` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `baslik` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(300) NOT NULL,
  `icerik` LONGTEXT NOT NULL,
  `resim` VARCHAR(255) NULL,
  `kategori` ENUM('haber','duyuru') NOT NULL DEFAULT 'haber',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_haberler_slug` (`slug`),
  KEY `idx_haberler_kategori` (`kategori`),
  KEY `idx_haberler_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `galeri` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `baslik` VARCHAR(255) NOT NULL,
  `resim_yolu` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_galeri_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sorular` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `kullanici_id` INT UNSIGNED NOT NULL,
  `soru` TEXT NOT NULL,
  `cevap` TEXT NULL,
  `cevaplandi` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sorular_kullanici_id` (`kullanici_id`),
  KEY `idx_sorular_cevaplandi` (`cevaplandi`),
  KEY `idx_sorular_created_at` (`created_at`),
  CONSTRAINT `fk_sorular_kullanicilar` FOREIGN KEY (`kullanici_id`) REFERENCES `kullanicilar` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ziyaretci` (
  `id` TINYINT UNSIGNED NOT NULL,
  `toplam` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ziyaretci` (`id`, `toplam`) VALUES (1, 0)
  ON DUPLICATE KEY UPDATE `toplam` = `toplam`;
