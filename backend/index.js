const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const {Server} = require('socket.io');
const mainRouter = require('./routes/main.router');


const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const {initRepo} = require('./controllers/init');
const {addRepo} = require('./controllers/add');
const {commitRepo} = require('./controllers/commit');
const {pushRepo} = require('./controllers/push');
const {pullRepo} = require('./controllers/pull');
const {revertRepo} = require('./controllers/revert');

yargs(hideBin(process.argv))

    .command('start', 'Starts a new server',{},startServer)

    .command('init', 'Initialize the application',{},initRepo)

    .command('add <file>', 'Add a file', (yargs) => {
        yargs.positional('file', {
            describe: 'File to add to the staging area',
            type: 'string'
        });
    }, (argv)=>{
        addRepo(argv.file);
    })

    .command('commit <message>', 'Commit the staged files', (yargs) => {
        yargs.positional('message', {
            describe: 'Commit message',
            type: 'string' 
        });
    }, (argv) =>{
        commitRepo(argv.message);
    })

    .command('push',"Push commits to S3",{}, pushRepo)

    .command('pull',"Pull commits from S3",{}, pullRepo)

    .command('revert <commitId>', 'Revert to a specific commit', (yargs) => {
        yargs.positional('commitId', {
            describe: 'ID of the commit to revert to',
            type: 'string'
        });
    }, (argv)=>{
        revertRepo(argv.commitId);
    })

    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;

function startServer(){
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());
    const MONGODB_URI = process.env.MONGODB_URI;
    mongoose.connect(MONGODB_URI)
        .then(()=>{
            console.log("Db connected!");
        })
        .catch((err)=>{
            console.error("Db connection error:", err);
        })
    
    app.use(cors({origin: '*'}));

    app.use('/',mainRouter);

    let user="test";
    const httpServer = http.createServer(app);
    const io = new Server({
        httpServer,
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection',(socket)=>{
        socket.on('message',(userID)=>{
            user = userID;
            console.log("================");
            console.log(user);
            console.log("================");
            socket.join(userID);
        });
    });

    const db = mongoose.connection;
    db.once('open',async()=>{
        console.log("MongoDB connected");
    });

    httpServer.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });

}
