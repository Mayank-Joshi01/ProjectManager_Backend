const Project = require("../model/Project");
const User = require("../model/User");


////////// To Fetch the Projects
const fetchProjects = async (req, res) => {
    const { user_id } = req.body;
    try {
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found",status:false });
        }

        const projects = await Project.find({ owner: user_id });
        res.status(200).json({ projects,status:true });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" ,status:false});
    }
};

///////// To Add the Project
const addProject = async (req, res) => {
    const { user_id, link, Pending_Task} = req.body;

    try{
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found",status:false });
        }
        
        const project = await Project.create({
            owner:user_id,
            link:link,
            Pending_Task:Pending_Task,
            Completed_Task:[]
        })

        if(!project){
            return res.status(400).json({message:"Project not created",status:false})
        }

        res.status(200).json({message:"Project created",project,status:true});

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" ,status:false});
    }
};

////////// To Update the Project
const updateProject = async (req, res) => {};

////////// To Delete the Project
const deleteProject = async (req, res) => {
    const {user_id,project_id} = req.body;

    try{

    if(!user_id || !project_id){
        return res.status(400).json({message:"Invalid Request",status:false})
    }

    const user = await User.findById(user_id);

    if(!user){
        return res.status(404).json({message:"User not found",status:false})
    }

    const project = await Project.findById(project_id);

    if(!project){
        return res.status(404).json({message:"Project not found",status:false})
    }

    if(project.owner.toString() !== user_id.toString()){
        return res.status(401).json({message:"Unauthorized Access",status:false})
    }

    const deleted = await Project.findByIdAndDelete(project_id);

    if(!deleted){
        return res.status(400).json({message:"Project not deleted",status:false})
    }

    res.status(200).json({message:"Project deleted",status:true})
}
catch(error){
    res.status(500).json({message:"Internal Server Error",status:false})
}
};

module.exports = { fetchProjects, updateProject, deleteProject,addProject };