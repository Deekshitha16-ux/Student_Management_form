const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/studentDB");

const Student = mongoose.model("Student",{
  name:String,
  usn:String,
  email:String,
  department:String,
  marks:Number
});


// ADD
app.post("/add", async(req,res)=>{
  await Student.create(req.body);
  updateJSON();
  res.send("Added");
});

// GET
app.get("/students", async(req,res)=>{
  const data = await Student.find();
  res.json(data);
});

// DELETE
app.delete("/delete/:id", async(req,res)=>{
  await Student.findByIdAndDelete(req.params.id);
  updateJSON();
  res.send("Deleted");
});

// UPDATE
app.put("/update/:id", async(req,res)=>{
  await Student.findByIdAndUpdate(req.params.id,req.body);
  updateJSON();
  res.send("Updated");
});

// EXPORT EXCEL
app.get("/export", async(req,res)=>{
  const data = await Student.find();
  const csv = data.map(s =>
    `${s.name},${s.usn},${s.email},${s.department},${s.marks}`
  ).join("\n");

  fs.writeFileSync("students.csv",csv);
  res.download("students.csv");
});


// helper
async function updateJSON(){
  const data = await Student.find();
  fs.writeFileSync("students.json",JSON.stringify(data,null,2));
}


app.listen(5000,()=>console.log("Server running on 5000"));
