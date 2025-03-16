import dotenv from 'dotenv';
dotenv.config()

import mongoose from 'mongoose';
//mongoose is an Object Data Modeling (ODM) library for MongoDB. It provides a higher-level abstraction making it easier to do things like adding, reading, updating, and deleting stuff from the MongoDB database.
import ora from 'ora'; //Terminal spinner for showing loading states and status

import chalk from 'chalk'; //Terminal string styling utility

export async function connectDB(){
  try{
    const spinner = ora('Connecting to the database...').start()
    await mongoose.connect(process.env.MONGO_URI) //  helps us actually connect to the database using the connection string. 
    spinner.stop()
    console.log(chalk.greenBright('Successfully connected to database!!!'));   
  }catch(error){
    console.log(chalk.redBright('Error: '),error);
    process.exit(1);
  }
}

export async function disconnectDB(){
  try{
    await mongoose.disconnect();
    console.log(chalk.greenBright('Disconnected from the database.'))
  }catch(error){
    console.log(chalk.redBright('Error: '), error);
    process.exit(1)
  }
}
