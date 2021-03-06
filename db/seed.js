const { client  } = require('./client')
const { getUsers, createInitialUsers} = require('./users')
const {  getAllActivities, createInitialActivities, updateActivity } = require('./activities')
const {  getAllRoutines, getAllRoutinesByUser, updateRoutine, createInitialRoutines, getPublicRoutines, getPublicRoutinesByUser, getPublicRoutinesByActivity, destroyRoutine} = require('./routines')
const { addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity } = require ('./routine_activities')

const chalk = require('chalk')


async function dropTables(){
    try{
        console.log('Starting to drop the tables!');
        await client.query(`
        DROP TABLE IF EXISTS routine_activities; 
        DROP TABLE IF EXISTS routines; 
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;
        `);
    }catch(error){
        console.log(chalk.red('Error dropping the tables.'))
        throw error
    }
};

async function createTables(){
    try{
        console.log('Starting to build the tables!')
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL, 
            password VARCHAR(255) NOT NULL
        );

        CREATE TABLE activities(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255)UNIQUE NOT NULL,
            description TEXT NOT NULL
        );

        CREATE TABLE routines(
            id SERIAL PRIMARY KEY,
            "creatorId" INTEGER REFERENCES users,
            public BOOLEAN DEFAULT false,
            name VARCHAR(255) UNIQUE NOT NULL,
            goal TEXT NOT NULL
        );

        CREATE TABLE routine_activities(
            id SERIAL PRIMARY KEY,
            "routineId" INTEGER REFERENCES routines UNIQUE,
            "activityId" INTEGER REFERENCES activities UNIQUE,
            duration INTEGER,
            count INTEGER
        );
        `)
    }catch(error){
        console.log(chalk.red('Error creating tables :('))
        throw(error);
    }
};


async function buildDB(){
    try{
        client.connect();
        await dropTables();
        await createTables();
        
    } catch(error){
        console.log(chalk.red('Uh-Oh!'))
        throw error;
    }
};


async function testDB(){
    try{
        console.log('Testing the database now!');

        console.log(chalk.green('Creating initial users'))
        await createInitialUsers();

        console.log(chalk.yellow('Calling getUsers...'));
        allUsers = await getUsers()
        console.log('Here are the users!', allUsers);

        console.log(chalk.green('Creating initial activities.'))
        await createInitialActivities();

        console.log(chalk.yellow('Calling getAllActivities...'))
        allActivities = await getAllActivities();
        console.log('Here are the activities!', allActivities)

        console.log(chalk.green('Creating Initial Routines.'))
        await createInitialRoutines()

        console.log(chalk.yellow('Calling getAllRoutines...'))
        allRoutines = await getAllRoutines()
        console.log("Here are the routines!", allRoutines)

        console.log(chalk.yellow('Calling getPublicRoutines...'))
        publicRoutines = await getPublicRoutines()
        console.log('Here are the public routines!', publicRoutines)
        
        console.log(chalk.yellow('Calling getAllRoutinesByUser...'))
        routinesByUser = await getAllRoutinesByUser( { username: "PatrickStar"} );
        console.log('Here are the users routines!', routinesByUser)

        console.log(chalk.yellow('Calling getPublicRoutinesByUser...'))
        pubRoutinesByUser = await getPublicRoutinesByUser({ creatorId:2})
        console.log('Here are the public routines by that user!', pubRoutinesByUser)

        console.log(chalk.yellow('Calling getPublicRoutinesByActivity...'))
        pubRoutinesByActivity = await getPublicRoutinesByActivity({activityId:2})
        console.log('Here are the public routines with that activity!', pubRoutinesByActivity)

        console.log(chalk.yellow('Calling addActivityToRoutine...'))
        addedActivity=await addActivityToRoutine({ routineId:1, activityId:1, count:3, duration:3 })
        console.log('Here is the activity you added!', addedActivity)

        console.log(chalk.yellow('Calling updateRoutineActivty...'))
        updatedRoutine = await updateRoutineActivity({id:1, count:2, duration:2})
        console.log('Here is your updated routine!', updatedRoutine)

        console.log(chalk.yellow('Calling updateActivity'))
        updatedActivity = await updateActivity({id:2, name: 'Skating', description:'Fine, we can just cruise.'})
        console.log('Here is your updated activity!', updatedActivity)

        console.log(chalk.yellow('Calling updateRoutine'))
        updatedRoutine = await updateRoutine({id:1, public:true, name:'Basketball', goal: 'Once is enough'})
        console.log('Here is the updated routine!', updatedRoutine )

        console.log(chalk.yellow('Calling destroyRoutine!'))
        await destroyRoutine(2)
        routines = await getAllRoutines()
        console.log('Here are the routines now.', routines)

        console.log(chalk.yellow('Calling destroyRoutineActivity'))
        await destroyRoutineActivity(2)
        routines = await getAllRoutines()
        console.log('Here are the routines now.', routines)

       

        
        console.log('Done testing the database :)');
    } catch(error){
        console.log('Error testing your database!')
        throw error
    }
};

buildDB()
.then(testDB)
.catch(console.error)
.finally(()=>process.exit());
