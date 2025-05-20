/* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// // GET single booking
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//       include: {
//         user: {
//           select: {
//             name: true,
//             email: true,
//             phone: true,
//           },
//         },
//         vehicle: true,
//       },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     // Check if user has access to this booking
//     if (
//       session.user.role !== "PROVIDER" &&
//       booking.userId !== session.user.id
//     ) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     return NextResponse.json(booking);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch booking" },
//       { status: 500 }
//     );
//   }
// }

// // PATCH update booking
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const json = await request.json();
//     const { status, date, timeSlot, specialRequests } = json;

//     // Check if booking exists and user has access
//     const existingBooking = await prisma.booking.findUnique({
//       where: { id: params.id },
//     });

//     if (!existingBooking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     // Only allow providers to update status
//     if (status && session.user.role !== "PROVIDER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Only allow booking owner to update other fields
//     if (
//       (date || timeSlot || specialRequests) &&
//       existingBooking.userId !== session.user.id
//     ) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const booking = await prisma.booking.update({
//       where: { id: params.id },
//       data: {
//         ...(status && { status }),
//         ...(date && { date: new Date(date) }),
//         ...(timeSlot && { timeSlot }),
//         ...(specialRequests && { specialRequests }),
//       },
//     });

//     return NextResponse.json(booking);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update booking" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE booking
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Check if booking exists and user has access
//     const booking = await prisma.booking.findUnique({
//       where: { id: params.id },
//     });

//     if (!booking) {
//       return NextResponse.json({ error: "Booking not found" }, { status: 404 });
//     }

//     if (booking.userId !== session.user.id && session.user.role !== "PROVIDER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await prisma.booking.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({ message: "Booking deleted successfully" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete booking" },
//       { status: 500 }
//     );
//   }
// } 

//........................................

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET a single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

    if (
      session.user.role !== "PROVIDER" &&
      booking.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// UPDATE a booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

    if (
      session.user.role !== "PROVIDER" &&
      existingBooking.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
//........................................


// // src/app/api/bookings/[id]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { connectDB } from '../../../lib/mongodb';
// import Booking from '@/models/booking';

// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = context.params;

//     const booking = await Booking.findById(id);

//     if (!booking) {
//       return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
//     }

//     return NextResponse.json(booking, { status: 200 });
//   } catch (error) {
//     console.error('[GET BOOKING ERROR]', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
// export async function PATCH(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const { id } = context.params;
//     const data = await req.json();

//     const booking = await Booking.findByIdAndUpdate(id, data, {
//       new: true,
//       runValidators: true,
//     });

//     if (!booking) {
//       return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
//     }

//     return NextResponse.json(booking, { status: 200 });
//   } catch (error) {
//     console.error('[UPDATE BOOKING ERROR]', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }