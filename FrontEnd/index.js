var msg=document.getElementById('msgField');
var senBtn=document.getElementById('sendbtn');
var msgarea=document.getElementById('msgarea');
const createGroupBtn = document.getElementById('createGroupBtn');
const createGroupModal = document.getElementById('createGroupModal');
const groupNameInput = document.getElementById('groupNameInput');
const createGroupSubmit = document.getElementById('createGroupSubmit');
const createGroupCancel=document.getElementById('createGroupCancel');
const buttonListDiv = document.getElementById('GroupList');
let groupid=null;
let groupN='Public Group'

const createInvite=document.getElementById('createInvite');
const createInviteCancel=document.getElementById('createInviteCancel');
const createInviteSubmit=document.getElementById('createInviteSubmit');
const InviteEmail=document.getElementById('EmailInvite');
const EmailInviteCheck=document.getElementById('EmailInviteCheck');
const grpTitle=document.getElementById('grpName');

createInviteCancel.addEventListener('click',()=>{
    createInvite.style.display = 'none';
})
createGroupCancel.addEventListener('click',()=>{
    createGroupModal.style.display = 'none';
})

createGroupBtn.addEventListener('click', () => {
    createGroupModal.style.display = 'block';
    groupNameInput.value='';
    

});

function handleButtonClick(event) {
    const button = event.target;
    const label = button.textContent;
    const id = button.id;
    groupid=button.id;
    groupN=button.textContent;
    grpTitle.innerText=button.textContent;
    if(groupid!='null'){
        console.log("Not Null")
        const btn = document.createElement('button');
        btn.textContent = 'Invite';
        btn.id = groupid;
        btn.className='btn btn-success'
        btn.style.float='right';
        btn.addEventListener('click', sendInvite);
        grpTitle.appendChild(btn)
    }
    loadFromLS()
    console.log(`Clicked: Label = ${label}, ID = ${id}`);
}
function sendInvite(e){
    e.preventDefault();
    const button = e.target;
    const id = button.id;
    createInvite.style.display = 'block';
    console.log('Email Sent',id)
}

createGroupSubmit.addEventListener('click', async() => {
    const groupName = groupNameInput.value;

    if (groupName) {
        // Perform necessary actions with the group name
        console.log('Group name:', groupName);
        // Close the moda
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:3000/addgroup',{groupName:groupName},{headers:{"Authorization":token}});

        createGroupModal.style.display = 'none';
        groupdisplay()
        
    }
});

createInviteSubmit.addEventListener('click',async()=>{
    console.log("Email :",InviteEmail.value," Group ID :",groupid)
    const res = await axios.post('http://localhost:3000/addGroupUser',{userMail:InviteEmail.value,groupId:groupid});
    console.log(res)
    if(res.status==203){
        console.log(EmailInviteCheck.getElementsByTagName('p'))
        if(EmailInviteCheck.getElementsByTagName('p')){
            const paragraphs = EmailInviteCheck.getElementsByTagName('p');
            for (let i = paragraphs.length - 1; i >= 0; i--) {
            paragraphs[i].remove();
            }
        }
        const ep=document.createElement('p');
        ep.style.backgroundColor='red';
        ep.id='phonecheck';
        ep.style.color='white';
        ep.innerText="User Doesn't Exits";
        EmailInviteCheck.appendChild(ep)
    }else if(res.status==202){
        if(EmailInviteCheck.getElementsByTagName('p')){
            const paragraphs = EmailInviteCheck.getElementsByTagName('p');
            for (let i = paragraphs.length - 1; i >= 0; i--) {
            paragraphs[i].remove();
            }
        }
        const ep=document.createElement('p');
        ep.style.backgroundColor='red';
        ep.id='phonecheck';
        ep.style.color='white';
        ep.innerText="User already in the Group";
        EmailInviteCheck.appendChild(ep)
    }else{
        createInvite.style.display = 'none';
        InviteEmail.value='';

    }


})

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
    testmsg=msg.value;
    msg.value='';
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:3000/addmsg',{msg:testmsg,groupid:groupid},{headers:{"Authorization":token}});
    
    
    display();
}
display()
groupdisplay()
async function groupdisplay(){
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:3000/getgroups`,{headers:{"Authorization":token}});
    createGroupList(res.data)

}
function createGroupList(obj){

    const btn = document.createElement('button');
    btn.textContent = 'Public Group';
    btn.style.width='100%';
    btn.style.margin='5px'
    btn.style.backgroundColor='light green'
    btn.id = null
    btn.addEventListener('click', handleButtonClick);
    buttonListDiv.appendChild(btn);


    for(let i=0;i<obj.length;i++){
        console.log(obj[i].group)
        const btn = document.createElement('button');
        btn.textContent = obj[i].group.groupName;
        btn.style.width='100%';
        btn.style.margin='5px'
        btn.style.backgroundColor='rgb(253, 135, 0)'
        btn.id = obj[i].group.id
        btn.addEventListener('click', handleButtonClick);
        buttonListDiv.appendChild(btn);
    }

}

async function display(){

    const token = localStorage.getItem('token');

    async function fetchMessages() {
        let lastMessageId=undefined;
        const isScrolledToBottom = msgarea.scrollHeight - msgarea.scrollTop === msgarea.clientHeight;

        let existingMessages = JSON.parse(localStorage.getItem(groupN));
        console.log(existingMessages)
        if(existingMessages){
            console.log("Last Message ID",existingMessages.chat[existingMessages.chat.length-1].id)
            lastMessageId=existingMessages.chat[existingMessages.chat.length-1].id;

        }

        let grp={
            groupId:groupid
        }
        const res = await axios.get(`http://localhost:3000/getmsg?lastMsgId=${lastMessageId}`,{headers:{"Authorization":token},params:grp});
        if(res.data.chat.length>0){
            
            console.log("existing data",existingMessages)
            if(existingMessages){
                console.log("existing data inside if",existingMessages.chat)
                existingMessages.chat.push(...res.data.chat);
                console.log("new Data",existingMessages.chat)

            }else{
                existingMessages=res.data
            }
            console.log("outside if",existingMessages.chat)

            // Add new messages to the existing array
            
            localStorage.setItem(groupN,JSON.stringify(existingMessages));
            lastMessageId=res.data.chat[res.data.chat.length-1].id;
            loadFromLS();
        }
        if (isScrolledToBottom) {
            msgarea.scrollTop = msgarea.scrollHeight;
        }

    }
    //fetchMessages()
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

    const obj= JSON.parse(localStorage.getItem(groupN))
    msgarea.innerText='';
    console.log(obj)
    if(obj){
        showchat(obj)
    }
    
}

loadFromLS();