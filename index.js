
class Comment {
    constructor(text) {
        this.user = loggedInUser;
        this.body = text;
        this.date = new Date().toLocaleString();
        this.reply = [];
    }
}


let comments = JSON.parse(localStorage.getItem('comments'));
if (comments == null) {
    comments = [
        {
            "user": "Pavol",
            "body": "This is first comment. If you click on AddReply button, you can reply on my comment.",
            "date": '7. 3. 2023 20:51:29',
            "reply": [
                {
                    "user": "Michal",
                    "body": "I replied on first comment.",
                    "date": '8. 3. 2023 10:56:49',
                    "reply": []
                }
            ]
        },
        {
            "user": "Juraj",
            "body": "This is my comment number 2. You can reply on it.",
            "date": '3. 3. 2023 11:58:28',
            "reply": [
                {
                    "user": "Marek",
                    "body": "This is my reply on comment 2",
                    "date": '5. 3. 2023 18:03:28',
                    "reply": []
                }
            ]
        },
        {
            "user": "Filip",
            "body": "This is comment 3. You can reply on every comment. Or you can add your own comment. But you must be signed in to your account. If you dont have account, you can register.",
            "date": '28. 2. 2023 11:03:39',
            "reply": []
        }
    ];
}

loadComments(comments);

let inappropriateWords = ['Putin', 'Ukraine', 'Russia', 'War'];

let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

let alertDiv = document.getElementById("alert");

let headText = document.getElementById("headText");
headText.innerHTML = "You are logged in to your account | " + loggedInUser + " | Now you can add comments or replies ";

function loadComments(commenty, comBox) {
    commenty.forEach(comment => {

        let allComments;
        let replyBox;

        if (comBox == null) {
            allComments = document.getElementById("allComments");
            replyBox = document.createElement("div");
            replyBox.className = "commentBox";
            allComments.appendChild(replyBox);
        } else {
            allComments = comBox;
            replyBox = document.createElement("div");
            replyBox.className = "replyBox";
            replyBox.style.marginLeft = "20px";
            allComments.appendChild(replyBox);
        }

        const user = document.createElement("div");
        user.className = "user";
        user.innerText = comment.user;
        replyBox.appendChild(user);

        const date = document.createElement("div");
        date.className = "date";
        date.innerHTML = comment.date.toLocaleString();
        replyBox.appendChild(date);

        const body = document.createElement("div");
        body.className = "body";
        body.innerText = comment.body;
        replyBox.appendChild(body);

        const addReply = document.createElement("div");
        addReply.className = "addRep";
        const addReplyInput = document.createElement("input");
        addReplyInput.className = "addReplyInput";
        addReply.appendChild(addReplyInput);

        const addReplyButton = document.createElement("button");
        addReplyButton.innerText = "Add Reply";
        addReplyButton.className = "addReplyButton";
        addReply.appendChild(addReplyButton);


        replyBox.appendChild(addReply);


        if (comment.reply.length != 0) {

            const addHideButton = document.createElement("button");
            addHideButton.innerText = "⇧";
            addHideButton.className = "addHideButton";
            addReply.appendChild(addHideButton);

            addHideButton.addEventListener("click", function () {

                let div = replyBox.lastElementChild;   
                
                hidy(div);
    
                function hidy(div){
                    if (div.style.display === "none") {
                    addHideButton.innerText = "⇧";
                    addHideButton.style.backgroundColor = "#00561a";
                    div.style.display = "block";
                } else {
                    div.style.display = "none";
                    addHideButton.innerText = "⇩";
                    addHideButton.style.backgroundColor = "#710000";
                }

                if(div.previousSibling.className == "replyBox"){
                    hidy(div.previousSibling);
                }
                }
    
            });

            let r = comment.reply;
            loadComments(r, replyBox);
        }

        addReplyButton.addEventListener("click", function () {
            let text = addReplyInput.value;

            if (text.length == 0) {
                alert('Please fill in comment input');
            } else {
                checkWords(text, comment);
            }
        });

        
    })
}


var w;

function checkWords(text, comment) {

    if (typeof (Worker) !== "undefined") {
        if (typeof (w) == "undefined") {
            w = new Worker("worker.js");
        }
        w.postMessage(text);
        w.onmessage = function (e) {
            if (e.data == true) {
                showAlert();
            } else {
                const newComment = new Comment(text);

                if (comment == null) {
                    comments.unshift(newComment);
                } else {
                    comment.reply.unshift(newComment);
                }

                localStorage.setItem("comments", JSON.stringify(comments));
                location.reload();
            }
        };
    }
}


function addComment() {
    let text = document.getElementById("addComment").value;

    if (text.length == 0) {
        alert('Please fill in comment input');
    } else {
        checkWords(text);
    }
}


function userExists(name, users) {
    let x = false;
    for (user of users) {
        if (user.name === name) {
            x = true;
            break;
        }
    } return x;
}

function register() {
    let users = JSON.parse(localStorage.getItem('listOfUsers'));

    if (users == null) {
        users = [];
    }

    let name = document.getElementById('name').value;
    let password = document.getElementById('password').value;
    let exists = userExists(name, users);
    document.getElementById("register").style.display = "block";

    if (name.length == 0) {
        alert('Please fill in name');

    } else if (password.length == 0) {
        alert('Please fill in password');

    } else if (name.length == 0 && password.value.length == 0) {
        alert('Please fill in name and password');

    } else if (password.length < 4) {
        alert('Minimum 4 letters please');

    } else if (exists === true) {
        alert('Username ' + name + " already exists. Please try another name!");

    } else {
        const newUser = {};
        newUser.name = name;
        newUser.password = password;
        users.push(newUser);

        localStorage.setItem("listOfUsers", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(name));
        window.alert('Your account has been created');
        location.reload();
    }
}

function showRegister() {
    document.getElementById("register").style.display = "block";
    document.getElementById("sign").style.display = "none";
}

function showLogin() {
    document.getElementById("sign").style.display = "block";
    document.getElementById("register").style.display = "none";
}

function signIn() {

    let users = JSON.parse(localStorage.getItem('listOfUsers'));

    if (users == null) {
        users = [];
    }

    let userName = document.getElementById('userName');
    let userPassword = document.getElementById('userPassword');

    if (userName.value.length == 0 || userPassword.value.length == 0) {
        alert('Please fill in name and password');
    } else {
        let text = "wrong user name or password"
        for (user of users) {

            if (userName.value == user.name && userPassword.value == user.password) {

                text = "welcome " + user.name;

                localStorage.setItem("loggedInUser", JSON.stringify(user.name));



                break;

            }

        }
        alert(text);

    } location.reload()
}

function signOut() {
    localStorage.removeItem("loggedInUser");
    location.reload()
}

function showAlert() {
    alertDiv.style.display = "block";
}

function closeAlert() {
    alertDiv.style.display = "none";
}

if (loggedInUser == null) {

    const boxes = document.getElementsByClassName('addRep');

    for (const box of boxes) {
        box.style.display = 'none';
    }

    document.getElementById('signOutButton').style.display = "none";
    document.getElementById('addCom').style.display = "none";
    headText.innerHTML = "If you want to add comments or replies, you have to sign into your account first. If you don't have account you can create it.";
} else {
    document.getElementById("register").style.display = "none";
    document.getElementById("sign").style.display = "none";
}


