const API = "http://localhost:5000/api/patients";

/* =========================
   GET ELEMENTS
========================= */
const form = document.getElementById("patientForm");

const filter = document.getElementById("topFilter");
const tableBody = document.getElementById("tableBody");
const searchBox = document.getElementById("searchBox");

const allBtn = document.getElementById("allRequestBtn");
const clinicBtn = document.getElementById("existingClinicBtn");

const requestSection = document.getElementById("requestSection");
const clinicSection = document.getElementById("clinicSection");
const clinicTableBody = document.getElementById("clinicTableBody");

// Get user role from URL
const role =
    new URLSearchParams(
        window.location.search
    ).get("role");

/* send otp */
async function sendOTP(){
    const phone =
        document.getElementById("mobile").value;

    if(phone.length !== 10){
        alert("Enter valid mobile number");
        return;
    }

    await fetch(
        "http://localhost:5000/api/auth/send-otp",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                phone,
                role
            })
        }
    );

    alert("OTP sent");

    /* show otp box */
    document.getElementById("otpBox").style.display = "flex";

    /* focus first box */
    document.getElementById("otp1").focus();
}
/* auto focus next box */
document.querySelectorAll(".otp-box input")
.forEach((input,index,arr)=>{
    input.addEventListener("input",()=>{
        if(input.value && index < arr.length-1){
            arr[index+1].focus();
        }
    });
});

/* verify */
async function verifyOTP(){
    const phone =
        document.getElementById("mobile").value;

    const otp =
        document.getElementById("otp1").value +
        document.getElementById("otp2").value +
        document.getElementById("otp3").value +
        document.getElementById("otp4").value;

    const res = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                phone,
                otp
            })
        }
    );

    const data = await res.json();

    if(data.success){
        if(data.role === "superadmin"){
            window.location.href =
                "superadmin.html";
        }
        else if(data.role === "clinicadmin"){
            window.location.href =
                "clinicadmin.html";
        }
        else if(data.role === "clinicX"){
            window.location.href =
                "clinicX_doctor.html";
        }
        else{
        window.location.href =
                "doctor.html";}
    }
    else{
        alert("Invalid OTP");
    }
}
/* =========================
   REGISTRATION PAGE
========================= */
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            clinic: document.getElementById("clinic").value,
            city: document.getElementById("city").value,
            area: document.getElementById("area").value
        };

        try {
            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            /* save id */
            localStorage.setItem("patientId", result.patient._id);

            /* move */
            window.location.href = "subscription.html";

        } catch (err) {
            console.log(err);
        }
    });
}


/* =========================
   SUPER ADMIN PAGE
========================= */

/* filters */
if (filter) {
    filter.addEventListener("change", loadPatients);
}

if (searchBox) {
    searchBox.addEventListener("input", loadPatients);
}

/* load pending / hold / declined */
async function loadPatients() {
    if (!filter || !tableBody) return;

    try {
        const status = filter.value;
        const search = searchBox ? searchBox.value : "";

        const res = await fetch(
            `${API}?status=${status}&search=${search}`
        );

        const patients = await res.json();

        tableBody.innerHTML = "";

        patients.forEach(patient => {
            tableBody.innerHTML += `
                <tr>
                    <td>
                        <span
                            class="patient-link"
                            onclick="showPatientDetails('${patient._id}')"
                        >
                            ${patient.name}
                        </span>
                    </td>

                    <td>${patient.clinic}</td>
                    <td>${patient.city}</td>
                    <td>${patient.area}</td>
                    <td>${patient.status}</td>

                    <td>
                        <select onchange="changeStatus('${patient._id}', this.value)">
                            <option>Select</option>
                            <option>Approve</option>
                            <option>Hold</option>
                            <option>Declined</option>
                        </select>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.log(err);
    }
}

/* change request status */
async function changeStatus(id, status) {
    if (status === "Select") return;

    try {
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });

        loadPatients();

    } catch (err) {
        console.log(err);
    }
}


/* =========================
   LEFT SIDE BUTTONS
========================= */
if (allBtn && clinicBtn) {

    /* all requests */
    allBtn.addEventListener("click", () => {
        requestSection.style.display = "block";
        clinicSection.style.display = "none";

        allBtn.classList.add("active");
        clinicBtn.classList.remove("active");
    });

    /* existing clinics */
    clinicBtn.addEventListener("click", async () => {
        requestSection.style.display = "none";
        clinicSection.style.display = "block";

        clinicBtn.classList.add("active");
        allBtn.classList.remove("active");

        try {
            const res = await fetch(`${API}?status=Approve`);
            const clinics = await res.json();

            clinicTableBody.innerHTML = "";

            clinics.forEach(clinic => {
                clinicTableBody.innerHTML += `
                    <tr>
                        <td>
                            <span
                                class="patient-link"
                                onclick="showPatientDetails('${clinic._id}')"
                            >
                                ${clinic.name}
                            </span>
                        </td>

                        <td>${clinic.clinic}</td>
                        <td>${clinic.city}</td>
                        <td>${clinic.area}</td>

                        <td class="${
                            (clinic.subscriptionStatus || "Inactive") === "Inactive"
                                ? "inactive"
                                : "activeSub"
                        }">
                            ${clinic.subscriptionStatus || "Inactive"}
                        </td>

                        <td>${clinic.status}</td>
                    </tr>
                `;
            });

        } catch (err) {
            console.log(err);
        }
    });
}

/* load default admin table */
if (filter && tableBody) {
    loadPatients();
}


/* =========================
   PATIENT DETAILS MODAL
========================= */
async function showPatientDetails(id) {
    try {
        const res = await fetch(`${API}/${id}`);
        const patient = await res.json();

        if (!patient) return;

        document.getElementById("patientDetails").innerHTML = `
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Clinic Name:</strong> ${patient.clinic}</p>
            <p><strong>City:</strong> ${patient.city}</p>
            <p><strong>Area:</strong> ${patient.area}</p>
            <p><strong>Phone Number:</strong> ${patient.phone}</p>
        `;

        const subscriptionBody =
            document.getElementById("subscriptionBody");

        subscriptionBody.innerHTML = "";

        const subscriptions =
            patient.subscriptions || [];

        subscriptions.forEach(sub => {
            subscriptionBody.innerHTML += `
                <tr>
                    <td>${sub.plan}</td>
                    <td>${sub.doctors}</td>
                    <td>${sub.amount}</td>
                    <td>${sub.date}</td>
                    <td>${sub.status}</td>
                </tr>
            `;
        });

        document.getElementById("patientModal").style.display = "block";

    } catch (err) {
        console.log(err);
    }
}

function closeModal() {
    const modal = document.getElementById("patientModal");

    if (modal) {
        modal.style.display = "none";
    }
}


/* =========================
   SUBSCRIPTION PAGE
========================= */
let selectedPrice = 1;
let baseDoctors = 2;
let doctors = 2;
let extraCost = 500;

/* select plan */
function selectPlan(card, price, minDoctors) {
    document.querySelectorAll(".plan").forEach(plan => {
        plan.classList.remove("active");
    });

    card.classList.add("active");

    selectedPrice = price;
    baseDoctors = minDoctors;
    doctors = minDoctors;

    const extra = document.getElementById("extraCount");
    if (extra) {
        extra.textContent = "Extra Doctors: 0";
    }

    updateTotal();
}

/* add doctors */
function addDoctor() {
    doctors++;

    const extraDoctors = doctors - baseDoctors;

    const extra = document.getElementById("extraCount");
    if (extra) {
        extra.textContent = `Extra Doctors: ${extraDoctors}`;
    }

    updateTotal();
}

/* update total */
function updateTotal() {
    const extraDoctors = doctors - baseDoctors;

    const total =
        selectedPrice + (extraDoctors * extraCost);

    const totalText = document.getElementById("total");

    if (totalText) {
        totalText.textContent = `Total: ₹ ${total}`;
    }
}

/* payment */
async function goPayment() {
    try {
        const patientId =
            localStorage.getItem("patientId");

        const total =
            selectedPrice +
            ((doctors - baseDoctors) * extraCost);

        const plan =
            selectedPrice === 1
            ? "6 Months"
            : "1 Year";

        await fetch(
            `${API}/${patientId}/subscription`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    plan,
                    doctors,
                    total
                })
            }
        );

        /* move to payment page */
        window.location.href = "payment.html";

    } catch (err) {
        console.log(err);
    }
}
     // payment.js

let paymentMode = "Credit Card";

function luhnCheck(cardNumber){
    let sum = 0;
    let shouldDouble = false;

    for(let i = cardNumber.length - 1; i >= 0; i--){
        let digit = parseInt(cardNumber[i]);

        if(shouldDouble){
            digit *= 2;
            if(digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

function validateExpiry(expiry){
    const [month, year] = expiry.split("/");

    if(!month || !year) return false;

    const expDate = new Date(`20${year}`, month);
    const now = new Date();

    return expDate > now;
}

async function payByCard(e){
    e.stopPropagation();

    const cardNumber =
        document.getElementById("cardNumber").value.replace(/\s/g,"");

    const expiry =
        document.getElementById("expiry").value;

    const cvv =
        document.getElementById("cvv").value;

    if(cardNumber.length < 16 || !luhnCheck(cardNumber)){
        alert("Invalid card number");
        return;
    }

    if(!validateExpiry(expiry)){
        alert("Invalid expiry date");
        return;
    }

    if(cvv.length !== 3){
        alert("Invalid CVV");
        return;
    }

    await paymentSuccess();
}

//debit card payment
async function payByDebit(e){
    e.stopPropagation();

    const cardNumber =
        document.getElementById("debitNumber")
        .value.replace(/\s/g,"");

    const expiry =
        document.getElementById("debitExpiry").value;

    const cvv =
        document.getElementById("debitCvv").value;

    const bank =
        document.getElementById("bankName").value;

    if(cardNumber.length < 16 || !luhnCheck(cardNumber)){
        alert("Invalid debit card number");
        return;
    }

    if(!validateExpiry(expiry)){
        alert("Invalid expiry");
        return;
    }

    if(cvv.length !== 3){
        alert("Invalid CVV");
        return;
    }

    if(bank === ""){
        alert("Select bank");
        return;
    }

    await paymentSuccess();
}

function isMobile(){
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function selectPayment(el, mode){
    document.querySelectorAll(".pay-box")
        .forEach(p => p.classList.remove("active"));

    el.classList.add("active");

    const cardSection =
        document.getElementById("cardSection");

    const debitSection =
        document.getElementById("debitSection");

    const qrSection =
        document.getElementById("qrSection");

    if(cardSection) cardSection.style.display = "none";
    if(debitSection) debitSection.style.display = "none";
    if(qrSection) qrSection.style.display = "none";

    if(mode === "CARD"){
        cardSection.style.display = "block";
    }

    else if(mode === "DEBIT"){
        debitSection.style.display = "block";
    }

    else if(mode === "UPI"){
        if(isMobile()){
            openUPI();
        }else{
            qrSection.style.display = "block";
            generateQR();
        }
    }
}

/* build UPI link */
function getUPILink(){
    const amount = getAmount(); // your total
    const merchant = "ClinicX";
    const upiId = "6302688176@ybl"; // replace

    return `upi://pay?pa=${upiId}&pn=${merchant}&am=${amount}&cu=INR`;
}

/* mobile */
function openUPI(){
    window.location.href = getUPILink();
}

/* desktop QR */
async function generateQR() {
    try {
        const amount = getAmount();
        const canvas =
            document.getElementById("qrCanvas");

        const amountEl =
            document.getElementById("qrAmount");

        /* create backend order */
        const res = await fetch(
            `${API}/create-order`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount })
            }
        );

        const order = await res.json();

        console.log(order);

        /* create payment QR */
        QRCode.toCanvas(
            canvas,
            getUPILink(),
            { width: 220 },
            function(err){
                if(err) console.log(err);
            }
        );

        /* show amount */
        if(amountEl){
            amountEl.textContent =
                `Amount: ₹ ${amount}`;
        }

    } catch(err){
        console.log(err);
    }
}
function getAmount(){
    return selectedPrice +
        ((doctors - baseDoctors) * extraCost);
}

async function paymentSuccess(){
    try{
        const patientId =
            localStorage.getItem("patientId");

        await fetch(
            `${API}/verify-payment`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    patientId
                })
            }
        );

        alert("Payment Successful");

        localStorage.removeItem("patientId");

        window.location.href = "home.html";

    }catch(err){
        console.log(err);
    }
}
async function completePayment(){
    await paymentSuccess();
}

function goLogin(){
    localStorage.removeItem("patientId");
    window.location.href = "login.html";

}
/* logout */
const logoutBtn =
    document.getElementById("logoutBtn");

if(logoutBtn){
    logoutBtn.addEventListener("click", ()=>{
        localStorage.clear();
        window.location.href = "home.html";
    });
}