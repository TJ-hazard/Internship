



function requestOtp() {
    const email = document.getElementById('email').value;
    fetch('/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(res => res.json()).then(data => {
        console.log(data);
        alert(data.message);
    }).catch(err => {
        console.error(err);
    })

    console.log('Button Clicked');
}
