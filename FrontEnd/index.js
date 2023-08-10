var msg=document.getElementById('msgField');
var senBtn=document.getElementById('sendbtn');
var msgarea=document.getElementById('msgarea');

senBtn.addEventListener('click',sendMessage);
msg.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      sendMessage(event);
      event.preventDefault();
    }
  });
async function sendMessage(e){
    e.preventDefault();
    console.log(msg.value)
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3000/addmsg',{msg:msg.value},{headers:{"Authorization":token}});
    msg.value='';
    
    display();
}
display()
let lastMessageId=undefined;
async function display(){

    const token = localStorage.getItem('token');

    async function fetchMessages() {
        const isScrolledToBottom = msgarea.scrollHeight - msgarea.scrollTop === msgarea.clientHeight;
        const res = await axios.get(`http://localhost:3000/getmsg?lastMsgId=${lastMessageId}`,{headers:{"Authorization":token}});
        if(res.data.chat.length>0){
            let existingMessages = JSON.parse(localStorage.getItem('msg')) || [];
            console.log("existing data",existingMessages)
            if(existingMessages.chat.length>0){
                console.log("existing data inside if",existingMessages.chat)
                existingMessages.chat.push(...res.data.chat);
                console.log("new Data",existingMessages.chat)

            }else{
                existingMessages=res.data
            }
            console.log("outside if",existingMessages.chat)

            // Add new messages to the existing array
            
            localStorage.setItem('msg',JSON.stringify(existingMessages));
            lastMessageId=res.data.chat[res.data.chat.length-1].id;
            loadFromLS();
        }
        if (isScrolledToBottom) {
            msgarea.scrollTop = msgarea.scrollHeight;
        }

    }

    // Call the fetchMessages function every 1 second
    const intervalId = setInterval(fetchMessages, 1000);
    
}
function showchat(obj){
    for(let i=0;i<obj.chat.length;i++){
        if(obj.chat[i].userId==obj.cid){
            var para2 = document.createElement("div");
            para2.style.backgroundColor= "blue";
            para2.style.padding ="10px";
            para2.style.float ="right";
            para2.style.clear = "both";
            para2.style.margin = "5px";
            para2.appendChild(document.createTextNode(`${obj.chat[i].userName} : ${obj.chat[i].message}`));
            msgarea.appendChild(para2)
        }else{
            var para1 = document.createElement("div");
            para1.style.backgroundColor= "gold";
            para1.style.padding ="10px";
            para1.style.float ="left";
            para1.style.clear = "both";
            para1.style.margin = "5px";
            para1.appendChild(document.createTextNode(`${obj.chat[i].userName} : ${obj.chat[i].message}`));
            msgarea.appendChild(para1)

        }
    }

}
function loadFromLS(){

    const obj= JSON.parse(localStorage.getItem('msg'))
    msgarea.innerText='';
    console.log(obj)
    showchat(obj)
}

