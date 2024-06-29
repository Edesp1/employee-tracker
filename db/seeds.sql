use employees_DB;

INSERT INTO department (name)
VALUES 
("Engineering"),
("Marketing"),
("Sales");

SELECT * FROM DEPARTMENT;

INSERT INTO role (title, salary, department_id)
VALUES
("Software Engineer", 100000, 1),
("Engineer Manager", 200000, 1),
("Accountant", 80000, 2),
("Accountantn Manager", 120000, 2),
("Salesperson", 50000, 3),
("Sales Manager", 100000, 3);

SELECT * FROM ROLE;

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES 
("Berry", "Allen", 1, NULL),
("Mike", "Tyson", 1, 1),
("Bruce", "Wayne", 2, 2),
("Violet", "Hoodwinker", 2, NULL),
("John", "Doe", 3, NULL),
("Jane", "Doe", 3, 1)

SELECT * FROM employees;