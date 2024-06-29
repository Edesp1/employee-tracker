DROP DATABASE IF EXISTS employees_DB;
CREATE DATABASE employees_DB;

USE employees_DB; -- Switch to 'employees_DB'
SHOW TABLES;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(20, 3) NULL,
    departments_id INT NOT NULL,
    FOREIGN KEY (departments_id)
        REFERENCES departments(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (roles_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES employees(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);