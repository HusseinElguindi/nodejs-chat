var usrObj = {
    name: "name",
    id: null,
    color: "color"
};

var color;
var ws;

// var obj = {
//     type: "message",
//     usr: {
//         name: "Hi",
//         id: 123,
//         color: `${color}`
//     },
//     data: `${messageInput.value}`
// };

function sendClicked() 
{
    var messageInput = document.getElementById("messageInput");
    
    if (messageInput.value.trim() !== '') {
        let obj = {
            type: "message",
            usr: usrObj,
            data: `${messageInput.value}`
        };

        if (messageInput.value[0] == '.' && messageInput.value[1] == '/') {
            obj.type = "command";
        }

        ws.send(JSON.stringify(obj));
    
        // makeTextElement(messageInput.value);
    }

    messageInput.value = "";
    messageInput.focus();   
}

// window.onload = setup();

function setup()
{
    usrObj.color = `rgb(${randInt(255)}, ${randInt(255)}, ${randInt(255)})`;
    usrObj.id = randInt(1000000);
}

function setDisplayName()
{

    var name = document.getElementById("displayName").value;
    if (name.trim() !== '') 
    {
        usrObj.name = name;
        
        var element = document.getElementById("setup");
        element.parentNode.removeChild(element);

        setup();
        startWebsocket();
    }
}

function startWebsocket()
{
    // console.log("hello");
    // var URL = "wss://hussein-chat.herokuapp.com/";
    var URL = "ws://localhost:8080";
    ws = new WebSocket(URL, null);   

    ws.onopen = function (event) {
        let obj = {
            type: "message",
            usr: usrObj,
            data: " joined the chat!"
        };

        ws.send(JSON.stringify(obj)); 
    };

    ws.onmessage = function (event) {
        console.log(event.data);
        let obj = JSON.parse(event.data);

        if (obj.type == "message") {
            makeTextElement(obj.usr.name, obj.data, obj.usr.color, (obj.usr.id==usrObj.id));
        }
    };
}

function makeTextElement(usr, txt, color, mine) 
{
    // <ul id="messageList">
    //     <li>
    //         <table>
    //             <tr>
    //                 <td class="name">
    //                     <div>
    //                         <p>Hussein</p>
    //                     </div>
    //                 </td>
    //                 <td class="message">
    //                     <p>Hi, how are you?</p>
    //                 </td>
    //             </tr>
    //         </table>
    //     </li>
    // </ul>

    var table = document.createElement("table");
    var tr = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdMessage = document.createElement("td");

    var li = document.createElement("li");
    var div = document.createElement("div");
    var pName = document.createElement("p");
    var pMessage = document.createElement("p");
    
    tdName.classList.add("name");
    tdMessage.classList.add("message")

    pName.textContent = usr;
    div.appendChild(pName);
    tdName.appendChild(div);

    pMessage.textContent = txt;
    tdMessage.appendChild(pMessage);
    
    if (mine)
    {
        tr.appendChild(tdMessage);
        tr.appendChild(tdName);

        table.classList.add("rightMessage");
        li.style.marginBottom = "7px";
    }
    else 
    {
        tr.appendChild(tdName);
        tr.appendChild(tdMessage);
    }
    
    div.style.backgroundColor = color;
    table.appendChild(tr);
    li.appendChild(table);

    let x = document.getElementById("messageList");
    x.appendChild(li);

    window.scrollTo(0, document.body.scrollHeight);
}

function randInt(max)
{
    return Math.floor(Math.random() * max);
}