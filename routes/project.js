const express = require('express');
const router = express.Router();
const { fetchProjects, updateProject, deleteProject,addProject } = require('../controller/project_controller');

router.get('/fetchProjects', fetchProjects);/// To Fetch the Projects
router.put('/updateProject', updateProject);/// To Update the Project
router.delete('/deleteProject', deleteProject);/// To Delete the Project
router.post('/addProject', addProject);/// To Add the Project

module.exports = router
