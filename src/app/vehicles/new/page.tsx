'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FaCar, FaSpinner, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string()
    .min(1, 'Year is required')
    .regex(/^\d{4}$/, 'Must be a valid year')
    .refine((val) => {
      const year = parseInt(val);
      return year >= 1900 && year <= new Date().getFullYear();
    }, {
      message: `Year must be between 1900 and ${new Date().getFullYear()}`,
    }),
  license: z.string().min(1, 'License plate number is required'),
  type: z.enum(['CAR', 'SUV_TRUCK', 'MOTORCYCLE', 'BICYCLE', 'OTHER'], {
    required_error: 'Vehicle type is required',
  }),
})

type VehicleFormData = {
  make: string;
  model: string;
  year: string;
  license: string;
  type: 'CAR' | 'SUV_TRUCK' | 'MOTORCYCLE' | 'BICYCLE' | 'OTHER';
}

export default function NewVehiclePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callbackUrl=/vehicles/new')
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  })

  const onSubmit = async (data: VehicleFormData) => {
    if (!session?.user?.id) {
      setSubmitError('You must be logged in to add a vehicle')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          ownerId: session.user.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add vehicle')
      }

      setSuccess(true)
    } catch (error) {
      console.error('Error adding vehicle:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to add vehicle')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full mx-4">
          <div className="text-green-400 text-5xl mb-4">
            <FaCar />
          </div>
          <h2 className="text-2xl font-bold mb-2">Vehicle Added Successfully!</h2>
          <p className="text-gray-400 mb-6">
            Your vehicle has been registered. You can now use it to make bookings.
          </p>
          <Link
            href="/booking"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block transition-colors"
          >
            Make a Booking
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/booking"
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Add New Vehicle</h1>
            <p className="text-gray-400">Register your vehicle for our services</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Make</label>
              <input
                type="text"
                {...register('make')}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="e.g. Toyota"
              />
              {errors.make && (
                <p className="mt-1 text-sm text-red-500">{errors.make.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <input
                type="text"
                {...register('model')}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="e.g. Camry"
              />
              {errors.model && (
                <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="text"
                {...register('year')}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="e.g. 2020"
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">License Plate</label>
              <input
                type="text"
                {...register('license')}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                placeholder="e.g. BP-1234"
              />
              {errors.license && (
                <p className="mt-1 text-sm text-red-500">{errors.license.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vehicle Type</label>
            <select
              {...register('type')}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            >
              <option value="">Select vehicle type</option>
              <option value="CAR">Car</option>
              <option value="SUV_TRUCK">SUV/Truck</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="BICYCLE">Bicycle</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Adding Vehicle...
                </>
              ) : (
                'Add Vehicle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 