const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {MongoClient} = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const mongoUrl = process.env.MONGODB_URI;
var objectId = require('mongodb').ObjectId;

let client;

async function connectClient(){
    if(!client){
        client = new MongoClient(mongoUrl,{useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect();
    }
}

const signup = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        await connectClient();
        const db = client.db('bitbucketlist');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({username});

        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,   
            password: hashedPassword,   
            email,
            repositories : [],
            followedUsers : [],
            starRepos : []
    }

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign({id: result.insertedId}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.status(201).json({token , userId : result.insertedId});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        await connectClient();
        const db = client.db('bitbucketlist');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({token , userId: user._id});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};

const getAllUsers = async (req, res) => {
    try {
        await connectClient();
        const db = client.db('bitbucketlist');
        const usersCollection = db.collection('users');

        const users = await usersCollection.find().toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



const getUserProfile = async (req, res) => {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db('bitbucketlist');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({_id: new objectId(currentID)});

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};


const updateUserProfile = async (req, res) => {
    const currentID = req.params.id;
    const { email, password } = req.body;

    try {
        await connectClient();
        const db = client.db('bitbucketlist');
        const usersCollection = db.collection('users');

        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);  
            const hashedPassword = await bcrypt.hash(password, salt);  
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate(
            { _id: new objectId(currentID) },
            { $set: updateFields },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: result.value });
    } catch (err) {
        console.error('Error during user update:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const deleteUserProfile = async (req, res) => {
    const currentID = req.params.id;
    try {
        await connectClient();
        const db = client.db('bitbucketlist');
        const usersCollection = db.collection('users');

        const result = await usersCollection.findOneAndDelete({ _id: new objectId(currentID) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
}