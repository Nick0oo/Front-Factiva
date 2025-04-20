import axios from "axios";

export async function registerUser(data: { email: string; password: string; name: string }) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error registering user");
  }
}