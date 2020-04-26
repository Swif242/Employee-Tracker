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
                    }
                    else if (add.add == "Roles") {
                        console.log("Added Roles");
                    }
                    else {
                        console.log("Added employees")
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
                    }
                    else {

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
    connection.query("SELECT employee.first_name, employee.last_name, roles.title,roles.salary, department.name \
                     FROM employee \
                     INNER JOIN roles ON employee.role_id = roles.id \
                     INNER JOIN department ON roles.department_id = department.id ", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("=====================================================================================")

    });
    start()
}
displayRoles = () => {
    connection.query("SELECT roles.title FROM roles", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("=====================================================================================")
    });
}
displayDepartments = () => {
    connection.query("SELECT department.name FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("=====================================================================================")
    });
}

// ==============================================================================================
// functions for adding 
addEmployee = () => {
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
            type: "input",
            name: "depart",
            message: "What is the employee's department? "
        },
        // uses prompt answers to insert new item into auctions
    ]).then(response => {
        connection.query("INSERT INTO auctions SET ?",
            {
                // left siede is the auction columns, right side is the prompt answers
                item_name: response.part,
                category: "automotive",
                starting_bid: response.starting_bid,
                highest_bid: response.starting_bid,
            },
            function (err, res) {
                if (err) throw err;
                console.log("=====================================================================================")
                readAuction();
            }
        )
        // goAgain()
    })


}