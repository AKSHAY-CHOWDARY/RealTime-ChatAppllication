const express = require("express");

const app = express();

const PORT = 4000;

const mongoClient = require("mongodb").MongoClient;

mongoClient
	.connect("mongodb://localhost:27017")
	.then((client) => {
		const dbObj = client.db("chatdb");
		const usersCollection = dbObj.collection("usersCollection");
		const msgsCollection = dbObj.collection("msgsCollection");

		app.set("usersCollection", usersCollection);
		app.set("msgsCollection", msgsCollection);

		console.log("connection to database successful");
	})
	.catch((err) => {
		console.log(err);
	});

app.use(express.json());

const userApp = require("./apis/user-api");
const msgsApp = require("./apis/messages-api");

app.use("/user-api", userApp);
app.use("/messages-api", msgsApp);

app.get('/',(req,res)=>{
	res.send("hello world");
})

app.use((err, req, res, next) => {
	res.send({ errMessage: err });
});

app.listen(4000, () => {
	console.log(`server started at port ${PORT}`);
});
