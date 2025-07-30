import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;

    const notifications = await prisma.notification.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Fetched notifications:", notifications);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notification:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;
    const { isRead } = await req.json();

    const updatedNotification = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = await params;

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
};
