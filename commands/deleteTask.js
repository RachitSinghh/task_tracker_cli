// The logic is straightforward: users enter the Todo code of the todo they want to delete, and we remove that todo from the database.
import inquirer from "inquirer";
import Todos from '../schema/TodoSchema.js'
import {connectDB, disconnectDB} from '../db/connectDB.js'
import ora from "ora";
import chalk from "chalk";

export async function getTaskCode() {
    try{
        //prompting the user to enter the todo code 
        const answers = await inquirer.prompt([
            {name: 'code', 'message': 'Enter the code of the todo: ', type:'input'},
        ])

        // Trimming user's response so that todo code doesn not contain any starting or traiing white spaces
        answers.code = answers.code.trim()
        return answers
    }catch(error){
        console.log('Something went wrong...\n',error);
    }
}

export default async function deleteTask() {
    try{
        //obtaining the code provided by user
        const userCode = await getTaskCode()

        // connecting to the database
        await connectDB()

        //starting the spinner 
        const spinner = ora('Finding and deleting the todo...').start()

        // deleting the task 
        const response = await Todos.deleteOne({code: userCode.code})

        // stopping the spinner 
        spinner.stop()

        // checking the delete operation
        if(response.deletedCount === 0){
            console.log(chalk.redBright('could not find any todo matching the provided name. Deletion failed.'))
        }else{
            console.log(chalk.greenBright('Deleted Task successfully'));
        }
        // disconnecting from the database
        await disconnectDB()
    }catch (error){
        //error handling 
        console.log('Something went wrong, Error: ',error);
        process.exit(1)
    }
}