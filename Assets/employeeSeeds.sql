DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;
CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  Department VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT REFERENCES department(id),
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT REFERENCES roles(id),
  -- manager_id INT default NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Robert", "Nelson", 1);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jeremy", "Nelson", 2);

INSERT INTO roles(title, salary, department_id)
VALUES ("Mechanic", 80000, 1);
INSERT INTO roles(title, salary, department_id)
VALUES ("Developer", 100000, 2);
INSERT INTO roles(title, salary, department_id)
VALUES ("Painter", 55000, 1);
INSERT INTO roles(title, salary, department_id)
VALUES ("Technician", 62000, 3);
INSERT INTO roles(title, salary, department_id)
VALUES ("Bodyman", 48000, 1);
INSERT INTO roles(title, salary, department_id)
VALUES ("Electrician", 50000, 2);
INSERT INTO roles(title, salary, department_id)
VALUES ("Designer", 68000, 2);

INSERT INTO department (Department)
VALUES ("Automotive");
INSERT INTO department (Department)
VALUES ("Development");
INSERT INTO department (Department)
VALUES ("Motorcycles");


SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.Department
FROM employee
INNER JOIN roles ON employee.role_id = roles.id
INNER JOIN department ON roles.department_id = department.id