const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');

const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const app = express()
const port = 5000;



app.use(bodyParser.json());
app.use(cors());
app.use(express.static('creatives'));
app.use(fileUpload());


app.use(bodyParser.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4zce5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("creativeAgent").collection("courses");
    const reviewCollection = client.db("creativeAgent").collection("reviews");
    const addServiceCollection = client.db("creativeAgent").collection("addservices");
    const addAdminCollection = client.db("creativeAgent").collection("admins");


    app.post('/addreview', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const company = req.body.company;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        reviewCollection.insertOne({ name, company, description, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //Add orders
    app.post('/addorders', (req, res) => {
        const orders = req.body;
        console.log(orders);
        collection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    //set admin
    app.post('/addUserAdmin', (req, res) => {
        const admins = req.body;
        console.log(admins);
        addAdminCollection.insertOne(admins)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

    })

    //adminAddServices

    app.post('/adminAddService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const details = req.body.details;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        addServiceCollection.insertOne({ name, details, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })


    //get admin service list
    app.get('/adminServiceList', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    //get orders service list
    app.get('/orderServiceList', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    //get orders service list
    app.get('/getService', (req, res) => {
        addServiceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    //get review

    app.get('/getReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })



    app.get('/getAdmins', (req, res) => {
        addAdminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })

    })
    console.log('db is connected')
});

//set admin
app.get('/', (req, res) => {
    res.send("Creative agency database is working")
});

app.listen(process.env.PORT || port);