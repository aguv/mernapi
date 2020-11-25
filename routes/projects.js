const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/auth')
const { check } = require('express-validator'); 

//api/projects

// create project
router.post('/', 
    auth, 
    [
        check('name', 'Name your project, please').not().isEmpty()
    ], 
    projectController.createProject);

// get projects    
router.get('/', 
    auth, 
    projectController.getProjects);

// update project    
router.put('/:id',
    auth,
    [
        check('name', 'Name your project, please').not().isEmpty()
    ],
    projectController.updateProject)

// delete project
router.delete('/:id',
    auth,
    projectController.deleteProject);

module.exports = router; 