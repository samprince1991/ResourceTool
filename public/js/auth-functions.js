'use strict'
let signupForm = document.getElementById("signupForm")
let loginForm = document.getElementById("loginForm")
let logoutButton = document.getElementById("logoutButton")
toastr.options = {
    "closeButton": true,
    "closeDuration": 0,
    "positionClass": "toast-top-right",
}
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        signupAction();
    })
}
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loginAction();
    })
}
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.replace("/");
    })
}
async function signupAction() {
    try {
        let bodyFormData = new FormData(); // Currently empty
        // bodyFormData.append("number", document.querySelector("#signupForm #number").value)
        bodyFormData.append("password", document.querySelector("#signupForm #password").value)
        bodyFormData.append("fullName", document.querySelector("#signupForm #fullName").value)
        bodyFormData.append("email", document.querySelector("#signupForm #email").value)
        let response = await axios({
            method: 'post',
            url: '/auth/signup',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: { 'Content-Type': 'application/json' }
        });
        //handle success
        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.details.token.access.token)
            localStorage.setItem('refreshToken', response.data.details.token.refresh.token)
            window.location.replace("/");
        }
    }
    catch (error) {
        toastr.error(JSON.stringify(error.response.data.details.message))
    }
}
async function loginAction() {
    try {
        let bodyFormData = new FormData(); // Currently empty
        bodyFormData.append("email", document.querySelector("#loginForm #email").value)
        bodyFormData.append("password", document.querySelector("#loginForm #password").value)
        let response = await axios({
            method: 'post',
            url: '/auth/login',
            data: JSON.stringify(Object.fromEntries(bodyFormData.entries())),
            headers: { 'Content-Type': 'application/json' }
        })
        //handle success
        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.details.token.access.token)
            localStorage.setItem('refreshToken', response.data.details.token.refresh.token)
            window.location.replace("/");
        }
    }
    catch (error) {
        toastr.error(error.response.data.details.message)
    }
}
async function authenticate() {
    try {
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');
        accessToken ? logoutElement.classList.remove("d-none") : loginSignUpElement.classList.remove("d-none")
        let response = await axios({
            url: '/auth/refresh',
            method: 'post',
            data: { refresh: refreshToken, access: accessToken },
        })
        if (response.status == 200) {
            localStorage.setItem('accessToken', response.data.details.token.access.token)
            localStorage.setItem('refreshToken', response.data.details.token.refresh.token)
            let userResponse = await axios({
                url: '/users/all',
                method: 'post',
                data: { userId: jwt_decode(accessToken)._id },
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": auth
                }
            })
            if (userResponse.status == 200) {
                document.querySelector("#logoutElement #loginName").innerHTML = userResponse.data.allUsers[0].fullName
            }
        }
        else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            (window.location.pathname === "/login" || window.location.pathname === "/signup")
                ? null
                : window.location.href = "/login"
        }
    }
    catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        (window.location.pathname === "/login" || window.location.pathname === "/signup")
            ? null
            : window.location.href = "/login"
    }
}
window.addEventListener('load', function () {
    authenticate();
    
    
})
