import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

// GET a single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        vehicle: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (session.user.role !== "PROVIDER" && booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// UPDATE a booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (
      session.user.role !== "PROVIDER" &&
      existingBooking.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Define the type with BookingStatus
    type AllowedBookingUpdateData = {
      status?: BookingStatus;
    };

    const updateData: AllowedBookingUpdateData = {};

    // Validate and cast the status from the request body
    if (body.status && typeof body.status === "string") {
      const validStatuses = Object.values(BookingStatus);
      if (validStatuses.includes(body.status as BookingStatus)) {
        updateData.status = body.status as BookingStatus;
      } else {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
    }

    // Handle completedAt update
    const completedAtUpdate: { completedAt?: Date } = {};
    if (updateData.status === BookingStatus.COMPLETED) {
      completedAtUpdate.completedAt = new Date();
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...updateData,
        ...completedAtUpdate,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Failed to update booking:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
// DELETE a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (
      session.user.role !== "PROVIDER" &&
      existingBooking.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
