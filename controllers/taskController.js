const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const { translateAliases } = require('../models/Project');

// create a task
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // get project and check if exists
        
    try {
        const { projectId } = req.body;
        const projectExist = await Project.findById(projectId);
        if(!projectExist) {
            return res.status(404).json({msg: "Project isn't found"});
        }

        // check if actual project belongs to auth user 
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "Permission denied"})
        } 

        // create task
        const task = new Task(req.body);
        await task.save();
        res.json({task});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error')
    }

};

// get tasks by project
exports.getTasks = async (req, res) => {
    try {

        // get project
        const { projectId } = req.query;
        const projectExist = await Project.findById(projectId);
        if(!projectExist) {
            return res.status(404).json({msg: "Project isn't found"});
        }

        // check if actual project belongs to auth user 
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "Permission denied"})
        } 

        // get tasks for projects
        const tasks = await Task.find({ projectId });
        res.json({tasks}); 

    }  catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
};

// update task 
exports.updateTask = async (req, res) => {
    try {
        
        const { projectId, name, state } = req.body;
        // check if task exists
        let task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({msg: "Task isn't found"})
        }
        
        // get project
        const projectExist = await Project.findById(projectId);
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "Permission denied"})
        } 
 
        // Create an object with new data
        const newTask = {};
        newTask.name = name;
        newTask.state = state;
        
        // save project
        task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true });
        res.json({task})

    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
};

// delete task
exports.deleteTask = async (req, res) => {
    try {
        
        const { projectId } = req.query;
        // check if task exists
        let task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({msg: "Task isn't found"})
        }
        
        // get project
        const projectExist = await Project.findById(projectId);
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "Permission denied"})
        } 
 
        // delete
        await Task.findByIdAndDelete({_id: req.params.id });
        res.status(400).json({msg: "Task deleted"});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.msg});
    }    
};