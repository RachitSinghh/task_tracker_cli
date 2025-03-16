// Updating a todo is a bit more involved compared to the previous operations. The process unfolds as follows:

// 1.Prompt the user to input the code of the todo to be updated.
// 2.Connect to the database.
// 3.Find the task whose code property matches the user's input.
// 4.If the task doesn't exist, display a message indicating the failure to find a matching todo.
// 5.If the task exists, prompt the user to update the name, description and status of the task.
// 6.If the user sets the status property of a task to "completed," then that task is deleted. If set to "pending," the task's name and description are updated in the database.
// 7.Display a success message in the console after the update operation.

import {connectDB, disconnectDB} from '../db/connectDB.js'
import { getTaskCode } from './deleteTask.js'
import inquirer from 'inquirer'
import Todos from '../schema/TodoSchema.js'
import ora from 'ora'
import chalk from 'chalk'

async function askUpdateQ(todo) {
    //The role of this function is to prompt the user to enter the updated values of the task like the task name, description, and status. At the end, this function will return the response object.
    try{
        // Prompting the user to update the todo data 
        const update = await inquirer.prompt([
            {name:'name', message:'Update the name?', type:'input',default:todo.name},
            {name: 'detail',message: 'Update the description?', type:'input', default: todo.detail},
            {name: 'status', message: 'Update the status', type: 'list', choices: ['pending','completed'], default: todo.status}
        ])
        return update
    }catch(error){
        console.log('Something went wrong...\n',error);
    }

    //Obtain the code of the task which the user wants to update. For this, we are utilizing the getTaskCode() function
}

export default async function updateTask() {
    try{
        // obtaining the task code entered by user by calling getTaskCode() method
        const userCode = await getTaskCode()

        // connecting to the database
        await connectDB()

        // starting the spinner 
        const spinner = ora('Finding the todo...').start()

        // finding the todo which the user wants to update 
        const todo = await Todos.findOne({code: userCode.code})

        // stopping the spinner 
        spinner.stop()

        // checking if the todo exisits  or not
        if(!todo){
            console.log(chalk.redBright('Could not find a Todo with the code you provided.'));
        }else{
            console.log(chalk.blueBright('Type the updated properties. Press Enter if you don\'t want to update the data.'));
            
            // get the user's response as completed,we deleted the todo else we update the data
            const update = await askUpdateQ(todo)

            // If user marked status as completed, we deleted the todo else we update the data
            if(update.status === 'completed'){
                // changing spinner text and starting it again 
                spinner.text = 'Deleting the todo...'
                spinner.start()

                // deleting the todo 

                await Todos.deleteOne({_id: todo._id})
                
                // stopping the spinner and display the success message
                spinner.stop()
                console.log(chalk.greenBright('Deleted the todo.'))
            }else{
                // Update the todo
                spinner.text = 'Updating the todo'
                spinner.start()
                await Todos.updateOne({_id: todo._id}, update, {runValidators: true})
                spinner.stop()
                console.log(chalk.greenBright('Updated the todo.'));
            }
        }
        // disconnecting from the database
        await disconnectDB()
    }catch(error){
        // Error handling 
        console.log('Something went wrong, Error: ',error);
        process.exit(1)
    }
}