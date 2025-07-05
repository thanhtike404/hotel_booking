import { prisma } from "@/lib/prisma";

export const GET= async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(notifications), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return new Response("Failed to fetch notifications", { status: 500 });
  }
}