import inquirer from "inquirer";
import { connectDB, disconnectDB } from "../db/connectDB.js";
import Todos from "../schema/TodoSchema.js";
import ora from "ora";
import chalk from "chalk";

async function input() {
  const answers = await inquirer.prompt([
    { name: "name", message: "Enter name of the task:", type: "input" },
    {
      name: "detail",
      message: "Enter the details fo the task:",
      type: "input",
    },
  ]);
  return answers;
}

// Function that asks user for tasks and returns array of tasks
const askQuestions = async () => {
  // Initialize empty array to store tasks
  const todoArray = [];
  // Variable to control the loop
  let loop = false;
  do {
    // Get task input from user using input() function
    const userRes = await input();
    // Add the task to array
    todoArray.push(userRes);
    // Ask user if they want to add more tasks
    const confirmQ = await inquirer.prompt([
      {
        name: "confirm",
        message: "Do you want to add more tasks?",
        type: "confirm",
      },
    ]);
    // If user confirms, continue loop
    if (confirmQ.confirm) {
      loop = true;
    } else {
      // If user doesn't confirm, end loop
      loop = false;
    }
  } while (loop); // Continue loop while loop is true
  // Return array of all tasks
  return todoArray;
};

export default async function addTask() {
  try {
    // calling askQuestions() to get array of todo's
    const userResponse = await askQuestions();

    // connecting to the database
    await connectDB();

    // displaying a spinner with the following text message using ora;
    let spinner = ora("Creating the todo...").start();

    // looping over every todo in the userResponse array
    // and saving each todo in the database.
    for (let i = 0; i < userResponse.length; i++) {
      const response = userResponse[i];
      await Todos.create(response);
    }
    // stopping the spinner and displaying the success message
    spinner.stop();
    console.log(chalk.greenBright("Created the todos!"));

    // disconnecting the database
    await disconnectDB();
  } catch (error) {
    console.log("Something went wrong,Error: ", error);
    process.exit(1);
  }
}

//The addTask() function starts by calling the askQuestions() function to gather the array of tasks and assigning it to the userResponse variable. Then, it connects to the database using connectDB(), displays a spinner using ora to show the task creation process, loops through each task in the array, and saves it to the database using Todos.create(response).

// Once all tasks are saved, the spinner stops, a success message is shown, and then it disconnects from the database using disconnectDB().

// The entire code is wrapped in a try...catch block to handle any potential errors gracefully.
