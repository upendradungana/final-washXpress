"use server";
import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import { Prisma, ServiceType, BookingStatus } from "@prisma/client";

export async function createBooking(bookingData: {
  serviceType: ServiceType;
  vehicleId: string;
  date: string;
  timeSlot: string;
  specialRequests?: string;
  userId: string;
}) {
  try {
    // Validate the vehicle exists and belongs to the user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: bookingData.vehicleId,
        ownerId: bookingData.userId,
      },
    });

    if (!vehicle) {
      throw new Error("Vehicle not found or doesn't belong to the user");
    }

    // Check for overlapping bookings
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: new Date(bookingData.date),
        timeSlot: bookingData.timeSlot,
        NOT: {
          status: "CANCELLED"
        }
      },
    });

    if (existingBooking) {
      throw new Error("This time slot is already booked");
    }

    const booking = await prisma.booking.create({
      data: {
        serviceType: bookingData.serviceType,
        vehicleId: bookingData.vehicleId,
        userId: bookingData.userId,
        date: new Date(bookingData.date),
        timeSlot: bookingData.timeSlot,
        specialRequests: bookingData.specialRequests || null,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/bookings");
    return booking;
  } catch (error) {
    console.error('Booking creation error:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      switch (error.code) {
        case 'P2002':
          throw new Error("A booking with these details already exists");
        case 'P2003':
          throw new Error("The vehicle or user referenced doesn't exist");
        case 'P2025':
          throw new Error("The vehicle or user wasn't found");
        default:
          throw new Error(`Database error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      throw error; // Re-throw our custom errors
    } else {
      throw new Error("An unexpected error occurred while creating the booking");
    }
  }
}

export async function getMyBookings(userId: string) {
  if (!userId) return []
  
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      }
    })
    
    return bookings
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
}

export async function getBookings(filter: 'pending' | 'completed' | 'all') {
  try {
    const bookings = await prisma.booking.findMany({
      where: filter === 'all' 
        ? {} 
        : filter === 'pending' 
          ? { status: { in: ['PENDING', 'CONFIRMED'] } }
          : { status: { in: ['COMPLETED', 'CANCELLED'] } },
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
      orderBy: {
        date: 'asc',
      },
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    const data: any = { status };
    if (status === "COMPLETED") {
      data.completedAt = new Date();
    }
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data,
    });

    revalidatePath("/control-center");
    return booking;
  } catch (error) {
    console.error('Error updating booking status:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new Error("Booking not found");
        default:
          throw new Error(`Database error: ${error.message}`);
      }
    }
    throw new Error("Failed to update booking status");
  }
}