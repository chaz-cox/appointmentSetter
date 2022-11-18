var date = document.querySelector("#date");
var start = document.querySelector("#start");
var finished = document.querySelector("#finished");
var nam = document.querySelector("#nam");
var description = document.querySelector("#description");
var submit = document.querySelector("#submit");
var invaid = document.querySelector("#Invaid");
var notAvailable = document.querySelector("#notAvailable");
var schedule = document.querySelector("#schedule");
var times = document.querySelector("#times");
var n = document.querySelector("#n");
var de = document.querySelector("#de");
var d = document.querySelector("#d");
var s = document.querySelector("#s");
var e = document.querySelector("#e");
var apt = document.querySelector("#apt");
var home = document.querySelector("#home");
var login = document.querySelector("#login");
var register= document.querySelector("#register");
var REGISTER= document.querySelector(".REGISTER");
var rLOGIN= document.querySelector("#rLOGIN");
var LOGIN= document.querySelector("#LOGIN");
var loginEmail = document.querySelector("#loginEmail");
var loginPassword = document.querySelector("#loginPassword");
var LOGOUT = document.querySelector("#LOGOUT");
var registerPassword= document.querySelector("#registerPassword");
var registerPassword2= document.querySelector("#registerPassword2");
var registerLastName= document.querySelector("#registerLastName");
var registerFirstName= document.querySelector("#registerFirstName");
var registerEmail = document.querySelector("#registerEmail");
var scheduleLayout = "";
var currentScheduleSTART = [];
var currentScheduleEND = [];
const URL = "https://set-appointment-with-us.herokuapp.com";
var appointments= [];
var appointment= {};
var loggedIN = false;
var registering = false;

function createUser(){
    if (registerPassword.value != registerPassword2.value){
        alert("Passwords dont match");
        return;
    }
    let rfirstname = "firstName"+"="+encodeURIComponent(registerFirstName.value);
    let rlastname = "lastName"+"="+encodeURIComponent(registerLastName.value);
    let remail = "email"+"="+encodeURIComponent(registerEmail.value);
    let rpassword= "password"+"="+encodeURIComponent(registerPassword.value);
    let data = rfirstname +"&" +rlastname + "&" + remail +"&"+ rpassword;
    fetch(`${URL}/users`,{
        method: "POST",
        credentials: 'include',
        body: data,
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response =>{
        console.log(response.status);
        if(response.status == '404'){
            alert("fill in all feilds please");
        }
        if(response.status == '422'){
            alert("user already exists, did you forget your password?");
        }
        if(response.status == '201'){
            console.log("success");
            authenticateUser(registerEmail.value, registerPassword.value);
        }
    });
}

function authenticateUser(email, password){ 
    let lemail = "email"+"="+encodeURIComponent(email); 
    let lpassword= "password"+"="+encodeURIComponent(password);
    let data = lemail + "&" + lpassword;
    fetch(`${URL}/sessions`,{
        method:"POST",
        credentials: 'include',
        body: data,
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded"
        }
    }).then(response =>{
        console.log(response.status);
        if(response.status  == '401' ){
            alert("User doesnt exist");
            console.log("Wrong Credentails");
        }else if(response.status == '201'){
            console.log("Success");
            loggedIN = true;
            
        }else if(response.status == '404'){
            alert("Credentails don't match");
            console.log("wrong email");
        }else{
            alert("Credentails don't match");
            console.log("somthing is wrong");
        }
        checkPage()
    });
}

function loadAppointmentsFromServer(){
    fetch(`${URL}/appointments`,{
        credentials:"include"
    }).then(response =>{
        response.json().then(data=>{
            console.log(data);
            appointments = data;
            if (response.status == '200'){
                loggedIN = true;
                checkPage()
            }
            else if( response.status == '401'){
                loggedIN = false;
                checkPage();
            }
            else{
                console.log("SOMTHING IS WRONG");
            }
        });
    });
}
function loadAppointmentFromServer(ID){
    fetch(`${URL}/appointments/${ID}`,{
        credentials:"include"
    }).then(response =>{
        response.json().then(data=>{
            console.log(data);
            appointment = data; 
        });
    });
}

function deleteSession(){
    fetch(`${URL}/sessions`,{
        method: "DELETE",
        credentials: "include"
    }).then(response =>{
            loggedIN = false;
            checkPage();
    });
}

function deleteAppointmentOnServer(ID){
    fetch(`${URL}/appointments/${ID}`,{
        method: "DELETE",
        credentials: "include"
    }).then(response =>{
            loadAppointmentsFromServer();
    });
}

function updateAppointmentOnServer(d,s,e,n,de,ID){
        let d1 = "date"+"="+encodeURIComponent(d);
        let s1= "start"+"="+encodeURIComponent(s);
        let e1= "finished"+"="+encodeURIComponent(e);
        let n1= "name"+"="+encodeURIComponent(n);
        let de1= "description"+"="+encodeURIComponent(de);
        let data = d1 + "&"+ s1+ "&"+ e1 + "&"+ n1 + "&"+ de1;
        console.log(data);
    fetch(`${URL}/appointments/${ID}`,
        {
            method: "PUT",
            credentials: "include",
            body:data,
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        }).then(function(response){
            loadAppointmentsFromServer();
    });
}

function createAppointmentsOnServer(){
    notAvailable.classList.add("hide");
    invaid.classList.add("hide");
    let a = validate()
    if (a == "Available"){
        let d = "date"+"="+encodeURIComponent(date.value);
        let s= "start"+"="+encodeURIComponent(start.value);
        let e= "finished"+"="+encodeURIComponent(finished.value);
        let n= "name"+"="+encodeURIComponent(nam.value);
        let de= "description"+"="+encodeURIComponent(description.value);
        let data = d + "&"+ s+ "&"+ e + "&"+ n + "&"+ de;
        console.log(data);
        fetch(`${URL}/appointments`,{
            method: "POST",
            credentials: "include",
            body:data,
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        }).then( function (response){
            loadAppointmentsFromServer();
        });
        nam.value = "";
        description.value = "";
    }
    else if( a == "Not Available"){
        notAvailable.classList.remove("hide");
    }else{
        invaid.classList.remove("hide");
    }
    start.value = "";
    finished.value = "";
}

function createScheduleLayout(){
    loadAppointmentsFromServer();
    currentScheduleSTART = [];
    currentScheduleEND= [];
    schedule.innerHTML = "";
    appointments.forEach((a) => {        
       if(a.date == date.value){
           var li = document.createElement("li");
           var txt = document.createTextNode(`${a.name} scheduled at: ${a.start} to ${a.finished} \n`);
           li.appendChild(txt);
           schedule.appendChild(li);
           li.addEventListener('click',function onClick(){ 
                console.log(a.id);
                loadAppointmentFromServer(a.id); 
                aptpage(a);
           });
           currentScheduleSTART.push(`${a.start}`);
           currentScheduleEND.push(`${a.finished}`);
       }
    });
}
function aptpage(a){
    apt.classList.remove("hide");
    var back = document.createElement("button");
    back.innerHTML = "back";
    var DELETE = document.createElement("button");
    DELETE.innerHTML = "delete";
    var update= document.createElement("button");
    update.innerHTML = "update";
    apt.appendChild(back);
    apt.appendChild(DELETE);
    apt.appendChild(update);
    home.classList.add("hide");
    n.innerHTML = a.name;
    de.innerHTML = a.description;
    d.innerHTML = a.date;
    s.innerHTML = a.start;
    e.innerHTML = a.finished;
    var updated = false;
    back.addEventListener('click',function onClick(){
        home.classList.remove("hide");
        apt.classList.add("hide");
        back.classList.add("hide");
        DELETE.classList.add("hide");
        update.classList.add("hide");
        createScheduleLayout();
    });
    DELETE.addEventListener('click',function onClick(){
        if(confirm("Are you sure you want to delete this appointment? ")){
            home.classList.remove("hide");
            apt.classList.add("hide");
            deleteAppointmentOnServer(a.id);
            back.classList.add("hide");
            DELETE.classList.add("hide");
            update.classList.add("hide");
            createScheduleLayout();
        }
    });
    // de.addEventListener('click',function onClick(){
    //     // try{input_de.classList.remove("hide");}
    //     // catch{console.log("no hide");}
    //     de.innerHTML = `<input id="input_de" value=${a.description} autofocus onfocus="this.select()">`;
    //     var input_de = document.querySelector("#input_de"); 
    //     updated = true;
    // });
    n.addEventListener('mousedown',function mouseDown(){
        // try{input_n.classList.remove("hide");}
        // catch{console.log("no hide");}
        n.innerHTML = `<input id="input_n" value=${a.name} autofocus onfocus="this.select()">`;
        var input_n = document.querySelector("#input_id"); 
        updated = true;
    });
    update.addEventListener('click',function onClick(){
        if(updated){
            updateAppointmentOnServer(a.date,a.start,a.finished,input_n.value,a.description,a.id);
        }
        updated = false;

        // input_de.classList.add("hide");
        // input_n.classList.add("hide");
    });      
}

function validate(){ 
    if(date.value=="" || start.value=="" || finished.value=="" || nam.value== ""){
        console.log("you forgot one of the feilds");
        return "Invaid";
    }
    let currentDate = new Date().toJSON().slice(0,8) + Date().slice(8,10);
    if(date.value < currentDate){
        console.log("date is in the past!")
        return "Invalid";
    }
    for(d in currentScheduleSTART){
        console.log(currentScheduleSTART[d]);
        console.log(start.value);
        console.log(currentScheduleEND[d]);
        console.log(finished.value);
        if (start.value == currentScheduleSTART[d]){
            console.log("start == some other start")
            return "Not Available";
        }
        if (start.value > finished.value){
            console.log("start > finished")
            return "Invalid";
        }
            //check if value is >< any other start and finished times
        if( currentScheduleSTART[d] <= finished.value && finished.value <= currentScheduleEND[d]){
            console.log("someother start <= finished >= someotherend");
            console.log(currentScheduleSTART[d] ,finished.value, currentScheduleEND[d]);
            return "Not Available";
        }
    }
    return "Available";
}

function changePage(page){
    apt.classList.add("hide");
    home.classList.add("hide");
    login.classList.add("hide");
    register.classList.add("hide");
    if (page == "apt"){
        apt.classList.remove("hide");
    }else if(page == "home"){
        home.classList.remove("hide");
    }else if( page == "register"){
        register.classList.remove("hide");
    }else{
        login.classList.remove("hide");
    }
}

function checkPage(){
    if (!loggedIN){
        if(!registering){
            changePage("login");
        }else{
            changePage("register");
        }
    }else{
        changePage("home");
    }
}
        
submit.addEventListener('click',function onClick(){
    console.log("Clicked!");
    createAppointmentsOnServer();
    createScheduleLayout();
});
submit.addEventListener('mouseleave',function onLeave(){
    console.log("date!");
    createScheduleLayout();
});
date.addEventListener('mouseleave',function onLeave(){
    console.log("date!");
    createScheduleLayout();
});

REGISTER.addEventListener('click',function onClick(){
    registering = true;
    checkPage();
});

LOGIN.addEventListener('click', function onClick(){
    authenticateUser(loginEmail.value, loginPassword.value);
    loginEmail.innerHTML = "";
    loginPassword.innerHTML = "";
});
rLOGIN.addEventListener('click', function onClick(){
    createUser();
    registerEmail.innerHTML = "";
    registerPassword.innerHTML="";
    registerPassword2.innerHTML ="";
    registerLastName.innerHTML="";
    registerFirstName.innerHTML="";
    registering = false;
});

LOGOUT.addEventListener('click',function onClick(){
    deleteSession();
});

checkPage();
loadAppointmentsFromServer();
