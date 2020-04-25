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
                choices: ["Add", "View", "Update"]
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
                    if(add.add == "Departments"){
                        console.log("Added department");
                    }
                    else if(add.add == "Roles"){
                        console.log("Added Roles");
                    }
                    else{
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
                    if(view.view == "Departments"){
                        console.log("Viewing department");
                    }
                    else if(view.view == "Roles"){
                        console.log("Viewing Roles");
                    }
                    else{
                        console.log("Viewing employees")
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
            console.log(`you have chosen to ${answer.option}`)
            inquirer.prompt([
                {
                    type: "confirm",
                    message: "Would you like to update an employee role? ",
                    name: "update",
                }
            ])
                .then(update => {
                    if(update.update == true){
                        console.log("Lets update an employee")
                    }
                    else{
                        console.log("Good bye!!")
                        connection.end()
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
    })
}
