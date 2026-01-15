-- Banco de dados para Lista de Presentes - 15 Anos

-- Cria banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS lista_presentes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lista_presentes;

-- Tabela de presentes
CREATE TABLE IF NOT EXISTS gifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    product_link VARCHAR(500) NULL,
    image_url VARCHAR(500) NULL,
    status ENUM('available', 'reserved') DEFAULT 'available',
    reserved_by VARCHAR(100) NULL,
    reserved_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dados de exemplo (opcional - pode ser removido)
INSERT INTO gifts (name, category, description, product_link) VALUES
('Perfume Chanel', 'Beleza', 'Perfume Chanel Coco Mademoiselle 50ml', 'https://example.com/perfume'),
('Bolsa Michael Kors', 'Acessórios', 'Bolsa feminina Michael Kors em couro', 'https://example.com/bolsa'),
('Relógio Apple Watch', 'Eletrônicos', 'Apple Watch Series 9 GPS 45mm', 'https://example.com/watch'),
('Livro "A Seleção"', 'Livros', 'Coleção completa da série A Seleção', 'https://example.com/livro'),
('Vestido de Festa', 'Roupas', 'Vestido longo para festa de 15 anos', 'https://example.com/vestido');
