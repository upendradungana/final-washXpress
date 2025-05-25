// src/app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assuming this path is correct
import { prisma } from "@/lib/prisma"; // Assuming this path is correct

// GET a single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Changed: Destructure params directly
) {
  const { id } = params; // Use the destructured id
  const session = await getServerSession(authOptions);

  if (!session) {
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

    // Ensure session.user and session.user.role are defined before accessing
    if (
      session.user?.role !== "PROVIDER" &&
      booking.userId !== session.user?.id
    ) {
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
  { params }: { params: { id: string } } // Changed: Destructure params directly
) {
  const { id } = params; // Use the destructured id
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ensure session.user and session.user.role are defined before accessing
    if (
      session.user?.role !== "PROVIDER" &&
      existingBooking.userId !== session.user?.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // It's good practice to define what fields can be updated
    // and pick only those from the body to prevent accidental updates.
    // Prisma will only update fields that are part of its model schema.
    type AllowedBookingUpdateData = {
      status?: string;
      // Add other fields that you allow to be updated via PATCH
      // Example: notes?: string;
    };

    const updateData: AllowedBookingUpdateData = {};
    if (body.status && typeof body.status === 'string') {
        updateData.status = body.status;
    }
    // Add other allowed fields from body to updateData similarly

    // Specific logic for 'COMPLETED' status
    let completedAtUpdate: { completedAt?: Date } = {};
    if (body.status === "COMPLETED") {
      completedAtUpdate.completedAt = new Date();
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...updateData, // Contains validated and allowed fields from body
        ...completedAtUpdate, // Adds completedAt if status is COMPLETED
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Failed to update booking:", error);
    if (error instanceof SyntaxError) { // Handle cases where request.json() fails
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
  { params }: { params: { id: string } } // Changed: Destructure params directly
) {
  const { id } = params; // Use the destructured id
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Ensure session.user and session.user.role are defined before accessing
    if (
      session.user?.role !== "PROVIDER" &&
      existingBooking.userId !== session.user?.id
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
