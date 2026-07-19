import { auth } from "./src/lib/auth";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function testAuth() {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: "admin@siwono.local",
        password: "password123"
      }
    });
    console.log("Login success:", res);
  } catch (error: any) {
    console.error("Login failed:", error.message || error);
  }
}

testAuth();
