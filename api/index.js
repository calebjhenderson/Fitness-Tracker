const express = require('express');
const apiRouter = express.Router();
const { getUserById } = require('../db/users.js')
const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');


apiRouter.use(async (req,res,next)=>{
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { 
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});


apiRouter.use(async (req,res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});



const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const routinesRouter = require('./routines');
apiRouter.use('/routines', routinesRouter);

const activitiesRouter = require('./activities');
apiRouter.use('/activities', activitiesRouter);

const routineActivitiesRouter = require('./routine_activities');
apiRouter.use('/routine_activities',routineActivitiesRouter);


apiRouter.use((error, req, res, next ) => {
    res.send(error);
  });

module.exports = apiRouter;