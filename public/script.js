const form = document.getElementById("form");
const table = document.getElementById("table");
const searchInput = document.getElementById("search");

const nameInput = document.getElementById("name");
const usnInput = document.getElementById("usn");
const emailInput = document.getElementById("email");
const deptInput = document.getElementById("dept");
const marksInput = document.getElementById("marks");
const submitBtn = document.getElementById("submitBtn");

let editId = null;


// ================= ADD / UPDATE =================
form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const student = {
        name: nameInput.value,
        usn: usnInput.value,
        email: emailInput.value,
        department: deptInput.value,
        marks: marksInput.value
    };

    if(editId){
        await fetch("/update/"+editId,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(student)
        });
        editId = null;
        submitBtn.textContent="Add Student";
    }
    else{
        await fetch("/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(student)
        });
    }

    form.reset();
    loadStudents();
});


// ================= LOAD =================
async function loadStudents(){

    const res = await fetch("/students");
    const data = await res.json();

    table.innerHTML = `
    <tr>
    <th>Name</th>
    <th>USN</th>
    <th>Email</th>
    <th>Dept</th>
    <th>Marks</th>
    <th>Action</th>
    </tr>`;

    data.forEach(s=>{
        table.innerHTML += `
        <tr>
        <td>${s.name}</td>
        <td>${s.usn}</td>
        <td>${s.email}</td>
        <td>${s.department}</td>
        <td>${s.marks}</td>
        <td>
            <button onclick="edit('${s._id}','${s.name}','${s.usn}','${s.email}','${s.department}','${s.marks}')">Edit</button>
            <button onclick="del('${s._id}')">Delete</button>
        </td>
        </tr>`;
    });
}


// ================= DELETE =================
async function del(id){
    await fetch("/delete/"+id,{method:"DELETE"});
    loadStudents();
}


// ================= EDIT =================
function edit(id,name,usn,email,dept,marks){
    nameInput.value=name;
    usnInput.value=usn;
    emailInput.value=email;
    deptInput.value=dept;
    marksInput.value=marks;

    editId=id;
    submitBtn.textContent="Update Student";
}


// ================= SEARCH =================
searchInput.addEventListener("keyup",()=>{
    const value = searchInput.value.toLowerCase();
    const rows = table.getElementsByTagName("tr");

    for(let i=1;i<rows.length;i++){
        rows[i].style.display =
            rows[i].innerText.toLowerCase().includes(value) ? "" : "none";
    }
});


// ================= EXPORT EXCEL =================
function exportExcel(){
    window.location="/export";
}

loadStudents();
