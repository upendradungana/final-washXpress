import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { VehicleType } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: userId
      },
      orderBy: {
        make: 'asc'
      }
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { make, model, year, license, type, ownerId } = body

    // Validate required fields
    if (!make || !model || !year || !license || !type || !ownerId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate year
    const yearNum = Number(year)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'Invalid year' },
        { status: 400 }
      )
    }

    // Check if license plate is already registered
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        license: license.toUpperCase()
      }
    })

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'A vehicle with this license plate is already registered' },
        { status: 400 }
      )
    }

    // Create the vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        make: make.trim(),
        model: model.trim(),
        year: yearNum,
        license: license.toUpperCase(),
        type: type as VehicleType,
        ownerId
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
} 