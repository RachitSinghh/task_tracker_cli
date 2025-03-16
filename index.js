#! /usr/bin/env  node 
// "shebang." It informs the system to execute the script using the Node.js interpreter. This enables us to run the script directly from the command line without explicitly typing node before the script filename.


// Importing the required functions for each command
import addTask from "./commands/addTask.js";
import deleteTask from "./commands/deleteTask.js";
import readTask from "./commands/readTask.js";
import updateTask from "./commands/updateTask.js";

// Importing the command class from commander.js library
import { Command } from "commander";

// creating an instance of the command class
const program = new Command();

// Setting the name and description of the CLI tools
program
  .name("todo")
  .description("Your terminal task manager!")
  .version("1.0.0");

// defining a commmand called 'add'
program.command("add").description("Create a new todo.").action(addTask); 
// defining a commmand called 'read'
program.command("read").description("Reads all the todos.").action(readTask); 
// defining a commmand called 'update'
program.command("update").description("Updates a todo.").action(updateTask); 
// defining a commmand called 'delete'
program.command("delete").description("Deleted a todo.").action(deleteTask);


// paring the command-line arguments and executing the corresponsing actions
program.parse()


//The "bin" property in the package.json file enables you to specify commands that become globally accessible once your package is installed. In simpler terms, it lets you create shortcuts for running specific scripts or functions from the command line.