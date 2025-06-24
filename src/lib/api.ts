import axios from "axios";

export async function registerUser(data: { email: string; password: string; name: string }) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    const err = error as any;
    throw new Error(err?.response?.data?.message || "Error registering user");
  }
}