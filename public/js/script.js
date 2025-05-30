function requestOtp() {
    const email = document.getElementById('email').value;
    const alertBox = document.getElementById('otp-alert');
    const btn = document.getElementById('request_otp');

    // Clear previous alerts
    if (alertBox) {
        alertBox.innerHTML = '';
        alertBox.style.display = 'none';
    }

    // Validate email
    if (!email) {
        showOtpAlert('Please enter your email address.');
        return;
    }

    btn.disabled = true;

    fetch('/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                showOtpAlert(data.message);
            } else {
                showOtpAlert('OTP sent to your email.', true);
            }
        })
        .catch(() => {
            showOtpAlert('An error occurred. Please try again.');
        })
        .finally(() => {
            btn.disabled = false;
        });
}

function showOtpAlert(message, success = false) {
    const alertBox = document.getElementById('otp-alert');
    if (alertBox) {
        alertBox.innerHTML = `
            <div class="custom-alert">
                ${message}
            </div>
        `;
        alertBox.style.display = 'block';
    }
}
