"use server";

import * as z from "zod";
import { formSchema } from "./page";

/**
 * Calls the BE to register the user
 * @param data passed from form.handleSubmit()
 * @returns
 */
export async function login(
  data: z.infer<typeof formSchema>,
): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/verifyUserLogin`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.warn(
        `verifyUserLogin failed due to: ${await JSON.stringify(res.json())}`,
      );
      return false;
    }
    const res_data = (await res.json()) as { match: boolean };
    console.log(res_data);
    return res_data.match;
  } catch {
    console.warn("verifyUserLogin fetch call failed");
    return false;
  }
}
