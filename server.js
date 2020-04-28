// require dependencies
const inquirer = require("inquirer");
const mysql = require("mysql")

// ==============================================================================
// MYSQL CONFIGURATION
// This sets up the basic properties for our mysql connection
// ==============================================================================
// Create a connection to the DB
// =========================================================================
const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "rider242",
    database: "employee_DB"
});


// Initiates the connection to the DB
// =============================================================
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

// ==============================================================================================
// start prompt
start = () => {
    inquirer.prompt(
        [
            {
                type: "list",
                message: "What would you like to do? ",
                name: "option",
                choices: ["Add", "View", "Update", "exit"]
            }
        ]
    ).then(answer => {
        if (answer.option == "Add") {
            console.log(`you have chosen to ${answer.option}`)
            inquirer.prompt([

                {
                    type: "list",
                    message: "What would you like to add? ",
                    name: "add",
                    choices: ["Departments", "Roles", "Employees"]
                }

            ])
                .then(add => {
                    if (add.add == "Departments") {
                        console.log("Added department");
                        addDepartment();
                    }
                    else if (add.add == "Roles") {
                        console.log("Added Roles");
                        addRole();
                    }
                    else {
                        console.log("Adding an employee")
                        addEmployee();

                    }
                })
                .catch(error => {
                    if (error.isTtyError) {
                        // Prompt couldn't be rendered in the current environment
                    } else {
                        // Something else when wrong
                    }
                });

        }
        else if (answer.option == "View") {
            console.log(`you have chosen to ${answer.option}`)
            inquirer.prompt([
                {

                    type: "list",
                    message: "What would you like to view? ",
                    name: "view",
                    choices: ["Departments", "Roles", "Employees"]

                }
            ])
                .then(view => {
                    if (view.view == "Departments") {
                        console.log("Viewing department");
                        displayDepartments();
                    }
                    else if (view.view == "Roles") {
                        console.log("Viewing Roles");
                        displayRoles();
                    }
                    else {
                        console.log("Viewing employees")
                        displayEmployee();
                    }
                })
                .catch(error => {
                    if (error.isTtyError) {
                        // Prompt couldn't be rendered in the current environment
                    } else {
                        // Something else when wrong
                    }
                });
        }
        else if (answer.option == "Update") {
            console.log(`you have chosen to ${answer.option}`)
            inquirer.prompt([
                {
                    type: "confirm",
                    message: "Would you like to update an employee role? ",
                    name: "update",
                }
            ])
                .then(update => {
                    if (update.update == true) {
                        console.log("Lets update an employee")
                        updateEmployee();
                    }
                    else {
                        start();

                    }
                })
                .catch(error => {
                    if (error.isTtyError) {
                        // Prompt couldn't be rendered in the current environment
                    } else {
                        // Something else when wrong
                    }
                });
        }
        else {
            console.log("Good bye!!")
            connection.end()
        }
    })
}

// ==============================================================================================
// functions for viewing 
displayEmployee = () => {
    connection.query(
        "SELECT employee.first_name, employee.last_name, employee.role_id, roles.title, roles.salary, department.department \
        FROM employee \
        INNER JOIN roles ON employee.role_id = roles.id \
        INNER JOIN department ON roles.department_id = department.id "
        , function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("=====================================================================================")
        });
    start()
}
displayRoles = () => {
    connection.query(
        "SELECT roles.title, roles.salary, department.Department \
        FROM roles \
        INNER JOIN department ON roles.department_id = department.id"
        , function (err, res) {
            if (err) throw err;
            console.table(res);
            console.log("=====================================================================================")
        });
    start()
}
displayDepartments = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("=====================================================================================")
    });
    start()
}

// ==============================================================================================
// functions for adding 
addEmployee = () => {
    connection.query("SELECT * FROM roles", function (errOne, resOne) {
        if (errOne) throw errOne;
        inquirer.prompt([
            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name? "
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name? "
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role? ",
                // lists the current roles for user selection
                // and returns the corresponding ID number
                choices: resOne.map(roles => {
                    return {
                        name: roles.title,
                        value: roles.id,
                    }
                })

            }
            // uses prompt answers to insert new item into auctions
        ]).then(response => {
            // adding employee's name
            connection.query("INSERT INTO employee SET ?",
                {
                    // left side is the table columns, right side is the prompt answers
                    first_name: response.firstname,
                    last_name: response.lastname,
                    role_id: response.role,

                }, function (err, res) {
                    if (err) throw err;
                    console.log("=====================================================================================")
                    displayEmployee();
                })
        })
    })
}
// adding a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the department name? "
        },

        // uses prompt answers to insert new item into auctions
    ]).then(response => {
        connection.query("INSERT INTO department SET ?",
            {
                // left side is the table columns, right side is the prompt answers
                department: response.department,

            }, function (err, res) {
                if (err) throw err;
                console.log("=====================================================================================")
                displayDepartments()
            })
        start()
    })
}

// adding a new Role
addRole = () => {
    connection.query("SELECT * FROM department", function (errOne, resOne) {
        if (errOne) throw errOne;
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the role's title? "
            },
            {
                type: "input",
                name: "salary",
                message: "What is the role's salary? "
            },
            {
                type: "list",
                name: "department",
                message: "What is the role's department? ",
                choices: resOne.map(department => {
                    return {
                        name: department.Department,
                        value: department.id
                    }
                })
            },

            // uses prompt answers to insert new item into auctions
        ]).then(response => {
            connection.query("INSERT INTO roles SET ?",
                {
                    // left side is the table columns, right side is the prompt answers
                    title: response.title,
                    salary: response.salary,
                    department_id: response.department,

                }, function (err, res) {
                    if (err) throw err;
                    console.log("=====================================================================================")
                    displayRoles()
                })
            start()
        })
    })
}

// ==============================================================================================
// functions for updating employee role
updateEmployee = () => {
    connection.query("SELECT * FROM employee", function (errOne, resOne) {
        if (errOne) throw errOne;
        // console.log(resOne)
        inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Who's role would you like to update? ",
                choices: resOne.map(employee => {
                    return {
                        name: employee.first_name,
                        value: employee.id,
                    }
                })
            },

        ]).then(next => {
            console.log(next)
            connection.query("SELECT * FROM roles", function (errOne, resOne) {
                if (errOne) throw errOne;
                inquirer.prompt([
                    {
                        type: "list",
                        name: "new_role",
                        message: "what is the employee's new role?",
                        choices: resOne.map(roles => {
                            return {
                                name: roles.title,
                                value: roles.id,
                            }
                        })
                    },
                ]).then(updatePrompt => {
                    console.log(updatePrompt)
                    connection.query(
                        `UPDATE employee \
                         SET  role_id = ${updatePrompt.new_role}\
                         WHERE employee.id = ${next.employee}`,

                        function (errTwo, resTwo) {
                            if (errTwo) throw errTwo;
                            displayEmployee();
                        }
                    );
                    console.log("success!!")
                })
            })
        })
    })
}





