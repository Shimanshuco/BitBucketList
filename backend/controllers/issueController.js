const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

const createIssue = async (req, res) => {
    const { title, description} = req.body;
    const {id} = req.params;

    try {
        if (!title || !description ) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid repository ID" });
        }

        const newIssue = new Issue({
            title,
            description,
            repository: id,
        });
        
        await Repository.findByIdAndUpdate(id, { $push: { issues: newIssue._id } });


        const result = await newIssue.save();
        return res.status(201).json({
            message: "Issue created successfully",
            result
        });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

const updateIssueById = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            { title, description, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        return res.status(200).json({
            message: "Issue updated successfully",
            updatedIssue
        });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedIssue = await Issue.findByIdAndDelete(id);

        if (!deletedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        return res.status(200).json({
            message: "Issue deleted successfully",
            deletedIssue
        });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find();
        return res.status(200).json({
            message: "Issues retrieved successfully",
            issues
        });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

const getIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        return res.status(200).json({
            message: "Issue retrieved successfully",
            issue
        });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};