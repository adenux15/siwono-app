async function testLogin() {
    try {
        const res = await fetch("http://localhost:3000/api/auth/sign-in/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "admin@siwono.local",
                password: "password123"
            })
        });
        
        const data = await res.json().catch(() => null);
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
testLogin();
