const { Client } = require('pg'); // imports the pg module
const connectionString = 'postgres://localhost:5432/fitness-dev';
const client = new Client(connectionString)

module.exports = {
  client,
  ...require('./users'), // adds key/values from users.js
  ...require('./activities'), // adds key/values from activites.js
  ...require('./routines'), // etc
  ...require('./routine_activities') // etc
}

async function createUser({ 
    username, 
    password
  }) {
    try {
      const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [username, password]);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function getUser({ username, password }) {
    try {
        const { rows: [user] } = await client.query(`
          SELECT *
          FROM users
          WHERE username=$1, password=$2
        `, [username, password]);
    
        return user;
      } catch (error) {
        throw error;
      }
    }

  async function createActivity({
    name,
    description= []
  }) {
    try {
      const { rows: [ activity ] } = await client.query(`
        INSERT INTO activities(name, description) 
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `, [name, description]);
  
      return activity;
    } catch (error) {
      throw error;
    }
  }


  async function updateActivity({ id, name, description })

  const setString = Object.keys(name, description).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

    try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(name, description));
   }
    } catch (error) {
        throw error;
  }
  
  async function getAllActivities() {
        try {
          const { rows: activities } = await client.query(`
            SELECT *
            FROM activities;
          `);
      
          
      
          return activities;
        } catch (error) {
          throw error;
        }
      }

      
      

      module.exports = {  
        client,
        createUser,
        createActivity,
        getUser,
        updateActivity,
        getAllActivities,
   
        
    
      }