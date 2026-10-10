
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});

async function startServer() {
    try {
        await client.connect();
        console.log("MongoDB Connected Successfully");

        const db = client.db("collegeDB");
        const collection = db.collection("students");

        app.post("/register", async (req, res) => {
            try {
                const data = {
                    name: req.body.name,
                    password: req.body.password,
                    age: Number(req.body.age),
                    mobile: req.body.mobile,
                    email: req.body.email,
                    gender: req.body.gender,
                    state: req.body.state,
                    skills: Array.isArray(req.body.skills)
                        ? req.body.skills
                        : req.body.skills
                        ? [req.body.skills]
                        : []
                };

                await collection.insertOne(data);
                res.send("Registration Successful! <a href='/'>Go Back</a>");
            } catch (error) {
                console.error(error);
                res.status(500).send("Registration failed.");
            }
        });

        
app.get("/students", async (req, res) => {
    const students = await collection.find(
        {},
        { projection: { password: 0 } }
    ).toArray();

    let rows = "";

    students.forEach((student, index) => {
        rows += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name || ""}</td>
                <td>${student.age || ""}</td>
                <td>${student.mobile || ""}</td>
                <td>${student.email || ""}</td>
                <td>${student.gender || ""}</td>
                <td>${student.state || ""}</td>
                <td>${Array.isArray(student.skills)
                    ? student.skills.join(", ")
                    : student.skills || ""}</td>
            </tr>
        `;
    });

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Registered Students</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f2f2f2;
                    padding: 30px;
                }

                .container {
                    max-width: 1100px;
                    margin: auto;
                    background: white;
                    padding: 25px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                }

                h2 {
                    text-align: center;
                    color: black;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background: white;
                }

                th, td {
                    border: 1px solid #999;
                    padding: 12px 8px;
                    text-align: left;
                    overflow-wrap: anywhere;
                }

                th {
                    background: #222;
                    color: white;
                }

                tr:nth-child(even) {
                    background: #f2f2f2;
                }

                .empty {
                    text-align: center;
                    padding: 20px;
                }

                .back {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 18px;
                    background: #222;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Registered Students</h2>

                <table>
                    <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>State</th>
                        <th>Skills</th>
                    </tr>
                    ${students.length ? rows : `
                        <tr>
                            <td colspan="8" class="empty">
                                No students registered yet.
                            </td>
                        </tr>
                    `}
                </table>

                <a class="back" href="/">Back to Registration</a>
            </div>
        </body>
        </html>
    `);
});


        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Could not connect to MongoDB:", error);
    }
}

startServer();
