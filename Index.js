require('dotenv').config();
const mysql = require('mysql');
const db = require("./db/db");
const logo = require('asciiart-logo');
const { createConnection } = require('mysql');

(async () => {
    const { default: inquirer } = await import('inquirer');

init();

const connection = createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

function init() {
   const logoText = logo({ name: "Employee Manager" }).render();
   console.log(logoText);

   loadPrompts();
}

function loadPrompts() {
    const startQuestions = [{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: 
        ["View all employees", 
        "View all roles", 
        "View all departments", 
        "Add an employee", 
        "Add a role", 
        "Add a department", 
        "Update role for an employee",
        "Delete a department", 
        "Delete a role", 
        "Delete an employee", 
        "Quit"]
    }];

inquirer.prompt(startQuestions)
.then(response => {
  switch (response.action) {
    case "View all employees":
      viewEmployees();
      break;
    case "View all roles":
      viewRoles();
      break;
    case "View all departments":
      viewDepartments();
      break;
    case "Add a department":
      addDepartment();
      break;
    case "Add a role":
      addRole();
      break;
    case "Add an employee":
      addEmployee();
      break;
    case "Update role for an employee":
      updateRole();
      break;
    case "View employees by manager":
      viewEmployeeByManager();
      break;
    case "Update employee's manager":
      updateManager();
      break;
    case "Delete a department":
      deleteDepartment();
      break;
    case "Delete a role":
      deleteRole();
      break;
    case "Delete an employee":
      deleteEmployee();
      break;
    case "View the total utilized budget of a department":
      viewBudget();
      break;
    default:
      quit();
  }
}).catch(err => {
  console.error(err);
});
};

//view departments
function viewDepartments() {
    const sql = `SELECT departments.id, departments.name AS Department FROM departments;`;
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        loadPrompts();
    });
};

//view roles
function viewRoles() {
    const sql = `SELECT roles.id, roles.title AS role, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON (departments.id = roles.departments_id);`;
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        loadPrompts();
    });
};

//viewing employees
function viewEmployees() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN employees manager on manager.id = employees.manager_id INNER JOIN roles ON (roles.id = employees.roles_id) INNER JOIN departments ON (departments.id = roles.departments_id) ORDER BY employees.id;`
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res);
        loadPrompts();
    });
};

//adding departments
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        }
    ]).then((answer) => {
        const sql = `INSERT INTO departments(name) VALUES('${answer.department}');`;
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Added " + answer.department + " to the database");
            loadPrompts();
        });
    });
};

//adding roles
function addRole() {
    const sql2 = `SELECT * FROM departments`;
    db.query(sql2, (error, response) => {
        departmentList = response.map(departments => ({
            name: departments.name,
            value: departments.id
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departmentList
            }
        ]).then((answers) => {
            const sql = `INSERT INTO roles SET title='${answers.title}', salary= ${answers.salary}, departments_id= ${answers.department};`;
            db.query(sql, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Added " + answers.title + " to the database")
                loadPrompts();
            });
        });
    });
};

//adding employees
function addEmployee() {
    const sql2 = `SELECT * FROM employees`;
    db.query(sql2, (error, response) => {
        employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));

    const sql3 = `SELECT * FROM roles`;
    db.query(sql3, (error, response) => {
       const roleList = response.map(roles => ({
            name: roles.title,
            value: roles.id
        }));
        inquirer.prompt([
                {
                    type: 'input',
                    name: 'first',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: employeeList
                }
            ]).then((answers) => {
                const sql = `INSERT INTO employees SET first_name='${answers.first}', last_name= '${answers.last}', roles_id= ${answers.role}, manager_id=${answers.manager};`
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Added " + answers.first + " " + answers.last + " to the database")
                    loadPrompts();
                });
            });
        });
    });
};

//deleting employees
function deleteEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the ID of the employee you want to delete:'
        }
    ]).then((answer) => {
        const sql = `DELETE FROM employees WHERE id = ${answer.employeeId};`;
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`Employee with ID ${answer.employeeId} deleted successfully`);
            loadPrompts();
        });
    });
};

//deleting roles
function deleteRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "roleId",
            message: "Enter ID of the role you want to delete:"
        }
    ]).then((answer) => {
        const sql = `DELETE FROM roles WHERE id = ${answer.roleId};`;
        db.query(sql, (err, res) => {
            if(err) {
                console.log(err);
                return;
            }
            if (res.affectedRows > 0) {
                console.log(`Department with ID ${answer.roleId} deleted successfully`);
            } else {
                console.log(`Department with ID ${answer.roleId} not found`);
            }
            loadPrompts()
        });
    });
};

//deleting departments
function deleteDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "departmentId",
            message: "Enter ID of the department you want to delete:"
        }
    ]).then((answer) => {
        const sql = `DELETE FROM departments WHERE id = ${answer.departmentId};`;
        db.query(sql, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            if (res.affectedRows > 0) {
                console.log(`Department with ID ${answer.departmentId} deleted successfully`);
            } else {
                console.log(`Department with ID ${answer.departmentId} not found`);
            }
            loadPrompts();
        });
    });
}

//updating roles
function updateRole() {
    const sql2 = `SELECT * FROM employees`;
    db.query(sql2, (error, response) => {
        employeeList = response.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id
        }));
        const sql3 = `SELECT * FROM roles`;
        db.query(sql3, (error, response) => {
            roleList = response.map(roles => ({
                name: roles.title,
                value: roles.id
            }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's role do you want to update?",
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleList
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who will be this employee's manager?",
                    choices: employeeList
                },
                
            ]).then((answers) => {
                const sql = `UPDATE employees SET roles_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`;
                db.query(sql, (err, res) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Employee role updated")
                    loadPrompts();
                });
            });
        });
    });
};

//exiting the application
function quit() {
    console.log("See you later!");
    process.exit();
}
})();