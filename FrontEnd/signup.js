var form = document.getElementById('signupForm');
var loginform = document.getElementById('loginForm');
var nam = document.getElementById('name');
var email=document.getElementById('email');
var phone=document.getElementById('phone');
var password=document.getElementById('password');
var emailcheck=document.getElementById('emailcheck');

form.addEventListener('submit',submitForm);
async function submitForm(e){
    e.preventDefault();
    var myobj={
        name : nam.value,
        email: email.value,
        phone:phone.value,
        password:password.value
    }
    console.log(myobj)

}