function validateEmail(email) {

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password, confirmPass){ 
    var passwordReq = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let errMsg = $('.errMsg');

    if (passwordReq.test(password)) {
        errMsg.css('display','none');        
        if(password === confirmPass) {
                errMsg.css('display','none');
                return true;
        }
        else{
            errMsg.text('PASSWORDS DO NOT MATCH').css('display','inline-block');
            return false;
        }        
    } else {
            errMsg.text('Password must be 8 characters long and include uppercase and lowercase letters, special characters, and digits.').css('display','inline-block');
            return false;
        }
    }
    
function generateUniqueId() {
    var timestamp = new Date().getTime();
    var random = Math.floor(Math.random() * 10000);
    var uniqueId = timestamp + '-' + random;
    return uniqueId;
}

document.getElementById('formSub').addEventListener('submit', function (e){
    e.preventDefault();

    let firstName= document.querySelector('#firstName').value; 
    let lastName= document.querySelector('#lastName').value;
    let email= document.querySelector('#newEmail').value;
    let password= document.querySelector('#newPassword').value;
    let confirmPassword= document.querySelector('#confirmNewPassword').value;
    let flag = true;
    let errMsg = $('.errMsg');

    if(firstName ==='' || lastName === '' || email==='' || password==='' || confirmPassword===''){
        flag = false;
        errMsg.text('ALL FIELDS ARE REQUIRED').css('display','inline-block');
    }

    if(firstName !=='' && lastName !== '' && email !=='' && password !=='' && confirmPassword !==''){
        errMsg.css('display','none');    
        var isEmailValid = validateEmail(email);
    

        if(!isEmailValid){
            errMsg.text('EMAIL IS NOT VALID').css('display','inline-block');
        }else{
            errMsg.css('display','none');
            var isPassValid = validatePassword(password, confirmPassword);
        
        }

        if(isEmailValid == true && isPassValid == true){
        errMsg.css('display','none');
        var users = JSON.parse(localStorage.getItem('user')) || [];

        if(!Array.isArray(users)){
            users = [];
        }

        var isEmailExist = users.some(user => user.email === email);
        if (isEmailExist) {
                errMsg.text('EMAIL ALREADY USED').css('display','inline-block');
            return;
        }else{
            errMsg.css('display','none');
        }
    
        var userId = generateUniqueId();
            

        var newUser = {
            id: userId,
            Name:(firstName + ' ' + lastName).toString(),
            email: email,
            password: password
        };
    
        users.push(newUser);
        localStorage.setItem("user", JSON.stringify(users));
        alert('User Created, You will be redirected in 5 secs');
        setTimeout(window.open('http://127.0.0.1:5500/login.html'), 5000);
    }
    }
}
)

