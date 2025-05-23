import { db } from "@/db/drizzle";
import { inngest } from "./client";
import { eq } from "drizzle-orm";
import { USER_TABLE } from "@/db/schema";

export const createUser = inngest.createFunction({ id: "create-user" }, { event: "user/create" }, async ({ event, step }) => {
  await step.run("Check user and create new if absent", async () => {
    // Extract user data from event
    const { user } = event.data;

    if (!user?.primaryEmailAddress?.emailAddress) {
      throw new Error("User email is missing.");
    }

    // Check if the user already exists
    const existingUser = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user.primaryEmailAddress.emailAddress));

    // Create new user if not found
    if (existingUser.length === 0) {
      await db
        .insert(USER_TABLE)
        .values({
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
        })
        .returning({ id: USER_TABLE.id });
    }

    return "Done";
  });

  return "Success";
});
