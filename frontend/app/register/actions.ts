"use server";

import * as z from "zod";
import { formSchema } from "./page";

/**
 * Calls the BE to register the user
 * @param data passed from form.handleSubmit()
 * @returns
 */
export async function register(
  data: z.infer<typeof formSchema>,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/createUserByUsernameAndEmail`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!res.ok) {
      console.warn(
        `createUserByUsernameAndEmail failed due to: ${await JSON.stringify(res.json())}`,
      );
    }
    return res.ok;
  } catch {
    console.warn("createUserByUsernameAndEmail fetch call failed");
    return false;
  }
}

export async function checkUsername(username: string): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/checkUsername`, {
      method: "POST",
      body: JSON.stringify({ username: username }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      return false;
    }
    const data = (await res.json()) as { isUnique: boolean };
    return data.isUnique;
  } catch {
    // If fetch fails
    console.warn("checkUsername fetch call failed");
    return false;
  }
}

export async function checkEmail(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/checkEmail`, {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      return false;
    }
    const data = (await res.json()) as { isUnique: boolean };
    return data.isUnique;
  } catch {
    // If fetch fails
    console.warn("checkEmail fetch call failed");
    return false;
  }
}
