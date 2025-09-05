const express = require('express');
const issueController = require('../controllers/issueController');

const issueRouter = express.Router();

issueRouter.post('/issues/create/:id', issueController.createIssue);
issueRouter.put('/issues/update/:id', issueController.updateIssueById);
issueRouter.delete('/issues/delete/:id', issueController.deleteIssueById);
issueRouter.get('/issues/all', issueController.getAllIssues);
issueRouter.get('/issues/:id', issueController.getIssueById);

module.exports = issueRouter; 