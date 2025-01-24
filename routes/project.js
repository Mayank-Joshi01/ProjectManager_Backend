const express = require('express');
const router = express.Router();
const token_middleware = require("../middleware/token_middleware")
const { fetchProjects, updateProject, deleteProject,addProject } = require('../controller/project_controller');

router.get('/fetchProjects', token_middleware,fetchProjects);/// To Fetch the Projects
router.put('/updateProject', token_middleware,updateProject);/// To Update the Project
router.delete('/deleteProject/:id',token_middleware, deleteProject);/// To Delete the Project
router.post('/addProject', token_middleware,addProject);/// To Add the Project

module.exports = router
