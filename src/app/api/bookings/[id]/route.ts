// src/app/api/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Define a more general params type, though for [id] it's just 'id'
type DynamicRouteParams = { [key: string]: string | string[] | undefined };

export async function GET(
  request: NextRequest,
  context: { params: DynamicRouteParams } // Use the more general params type for context
) {
  const id = context.params.id; // Access id

  // Since 'id' comes from [id], it should be a string. Add a check for type safety.
  if (typeof id !== 'string') {
    console.error("ID parameter is not a string:", id);
    return NextResponse.json({ error: "Invalid ID parameter" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id }, // 'id' is now confirmed to be a string
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

// IMPORTANT: Apply similar changes to PATCH and DELETE functions for consistency
// For PATCH:
export async function PATCH(
  request: NextRequest,
  context: { params: DynamicRouteParams }
) {
  const id = context.params.id;
  if (typeof id !== 'string') {
    return NextResponse.json({ error: "Invalid ID parameter" }, { status: 400 });
  }
  // ... rest of your PATCH logic using the string 'id'
  const session = await getServerSession(authOptions); // Moved up for consistency
  // ... (your existing PATCH logic)
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

    if (
      session.user?.role !== "PROVIDER" &&
      existingBooking.userId !== session.user?.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    type AllowedBookingUpdateData = {
      status?: string;
    };
    const updateData: AllowedBookingUpdateData = {};
    if (body.status && typeof body.status === 'string') {
        updateData.status = body.status;
    }
    let completedAtUpdate: { completedAt?: Date } = {};
    if (body.status === "COMPLETED") {
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


// For DELETE:
export async function DELETE(
  request: NextRequest,
  context: { params: DynamicRouteParams }
) {
  const id = context.params.id;
  if (typeof id !== 'string') {
    return NextResponse.json({ error: "Invalid ID parameter" }, { status: 400 });
  }
  // ... rest of your DELETE logic using the string 'id'
  const session = await getServerSession(authOptions); // Moved up
  // ... (your existing DELETE logic)
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
