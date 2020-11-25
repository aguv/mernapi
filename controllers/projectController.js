const Project = require('../models/Project');
const { validationResult } = require('express-validator');
 
exports.createProject = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try { 
        //create new project
        const project = new Project(req.body);

        //save project creator from jwt
        project.creator = req.user.id

        // project save
        project.save();
        res.json(project);
    } catch (error) {
        res.status(500).send("Error!")
    }
};

// get all projects 
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find( { creator: req.user.id });
        res.json({projects})
    } catch (error) {
        console.log(error); 
        res.status(500).send('Error');
    }
}

// update project
exports.updateProject = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // get project info
    const { name } = req.body;
    const newProject = {};

    if(name) {
        newProject.name = name;
    }

    try {
        // check id
        let project = await Project.findById(req.params.id);

        // check if project exists
        if(!project) {
            return res.status(404).json({msg: "Project is not found"})
        }

        //check creator 
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "Permission denied"})
        }

        // update
        project = await Project.findByIdAndUpdate({_id: req.params.id}, { $set: newProject }, { new: true });

        res.json({project});

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error'); 
    }
}; 

// delete project by id
exports.deleteProject = async (req, res) => {
    try {
        //check id
        let project = await Project.findById(req.params.id);

        // check if project exists
        if(!project) {
            return res.status(404).json({msg: "Project is not found"})
        }

        //check creator 
        if(project.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: "Permission denied"})
        }
        
        //delete project
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Project deleted"});

    } catch (error) {
        console.log(error);
        send.status(500).send("Error server")
    }
};