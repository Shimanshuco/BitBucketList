const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

const createRepository = async (req,res)=>{
    const {owner , name, issue , content, description, visibility} = req.body;

    try{
        if(!name){
            return res.status(400).json({error: "Repository name is required"});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({error: "Invalid owner ID"});
        }

        if(issue && !mongoose.Types.ObjectId.isValid(issue)){
            return res.status(400).json({error: "Invalid issue ID"});
        }

        const newRepository = new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues: issue ? [issue] : []
        });


        const result = await newRepository.save();
        return res.status(201).json({
            message : "Repository created successfully",
            result
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }

};

const getAllRepositories = async (req,res)=>{
    try{
        const repositories = await Repository.find({}).populate('owner').populate('issues');

        return res.status(200).json({
            message: "All repositories fetched successfully",
            repositories
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
};

const fetchRepositoryById = async (req,res)=>{
    const repoID = req.params.id;
    try{
        if(!mongoose.Types.ObjectId.isValid(repoID)){
            return res.status(400).json({error: "Invalid repository ID"});
        }
        const repository = await Repository.find({_id: repoID}).populate('owner').populate('issues');
        if(!repository){
            return res.status(404).json({error: "Repository not found"});
        }
        return res.status(200).json({
            message: "Repository fetched successfully",
            repository
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
};

const fetchRepositoryByName = async (req,res)=>{
    const repoName = req.params.name;
    try{
        const repository = await Repository.findOne({name: repoName}).populate('owner').populate('issues');
        if(!repository){
            return res.status(404).json({error: "Repository not found"});
        }
        return res.status(200).json({
            message: "Repository fetched successfully",
            repository
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
}

const fetchRepositoriesForCurrentUser = async (req,res)=>{
    const userId = req.user;
    try{
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({error: "Invalid user ID"});
        }
        const repositories = await Repository.find({owner: userId}).populate('owner').populate('issues');
        if(!repositories){
            return res.status(404).json({error: "No repositories found for this user"});
        }  
        return res.status(200).json({
            message: "Repositories fetched successfully",
            repositories
        });

    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
};

const updateRepositoryById = async (req,res)=>{
    const {id}= req.params;
    const {name, description, content, visibility} = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: "Invalid repository ID"});
        }

        const updatedRepository = await Repository.findByIdAndUpdate(id, {
            name,
            description,
            content,
            visibility
        }, {new: true});

        if(!updatedRepository){
            return res.status(404).json({error: "Repository not found"});
        }

        return res.status(200).json({
            message: "Repository updated successfully",
            updatedRepository
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
};

const toggleVisibilityById = async (req,res)=>{
    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: "Invalid repository ID"});
        }

        const repository = await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error: "Repository not found"});
        }

        repository.visibility = !repository.visibility;
        await repository.save();

        return res.status(200).json({
            message: "Repository visibility toggled successfully",
            repository
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
};

const deleteRepositoryById = async (req,res)=>{
    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: "Invalid repository ID"});
        }

        const deletedRepository = await Repository.findByIdAndDelete(id);
        if(!deletedRepository){
            return res.status(404).json({error: "Repository not found"});
        }

        return res.status(200).json({
            message: "Repository deleted successfully",
            deletedRepository
        });
    }catch(err){
        return res.status(500).json({error: "Server Error"});
    }
};

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById
};