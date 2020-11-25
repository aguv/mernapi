const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth')
const { check } = require('express-validator'); 

//create task
//api/tasks
router.post('/',
    auth,
    [
        check('name', 'Name your task').not().isEmpty(),
        check('projectId', 'Project needed').not().isEmpty()
    ],
     taskController.createTask
);

router.get('/', auth, taskController.getTasks);

router.put('/:id', auth, taskController.updateTask);

router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;