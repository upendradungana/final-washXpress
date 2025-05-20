'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createBooking } from '@/lib/actions'
import { FaUser, FaPhone, FaEnvelope, FaCar, FaCalendarDay, FaClock, FaCheckCircle } from 'react-icons/fa'
import { FaArrowRight, FaArrowLeft, FaSpinner, FaCalendarCheck } from 'react-icons/fa'
import Link from 'next/link'

const bookingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone number is required').regex(/^\+975[0-9]{8}$/, 'Invalid Bhutanese phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  vehicleId: z.string().min(1, 'Vehicle selection is required'),
  serviceType: z.enum(['BASIC_WASH', 'PREMIUM_WASH', 'FULL_DETAILING', 'OTHER'], {
    required_error: 'Service type is required',
  }),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  specialRequests: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  license: string
  type: string
}

const services = [
  {
    type: 'BASIC_WASH',
    name: 'Basic Wash',
    price: 'Nu.150',
    description: 'Essential exterior cleaning',
    features: ['Exterior hand wash', 'Wheel cleaning', 'Quick interior vacuum'],
  },
  {
    type: 'PREMIUM_WASH',
    name: 'Premium Wash',
    price: 'Nu.600',
    description: 'Complete exterior and interior',
    features: ['Everything in Basic', 'Wax application', 'Interior wipe down'],
  },
  {
    type: 'FULL_DETAILING',
    name: 'Full Detailing',
    price: 'Nu.1200',
    description: 'Professional detailing',
    features: ['Everything in Premium', 'Clay bar treatment', 'Leather conditioning'],
  },
  {
    type: 'OTHER',
    name: 'Others',
    price: 'Price on Arrival',
    description: 'Other services Available',
    features: ['Patiently waiting for you', 'Service as per request', 'Flexible'],
  },
]

const timeSlots = [
  '8:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
]

export default function BookingPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login?callbackUrl=/booking')
    },
  })

  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true)
  const [vehicleError, setVehicleError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      vehicleId: '',
      serviceType: undefined,
      date: '',
      timeSlot: '',
      specialRequests: '',
    },
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`/api/vehicles?userId=${session?.user?.id}`)
        if (!response.ok) throw new Error('Failed to fetch vehicles')
        const data = await response.json()
        setVehicles(data)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
        setVehicleError('Failed to load your vehicles. Please try again.')
      } finally {
        setIsLoadingVehicles(false)
      }
    }

    if (session?.user?.id) {
      fetchVehicles()
    }
  }, [session?.user?.id])

  // Reset service type when going back to step 1
  useEffect(() => {
    if (step === 1) {
      setValue('serviceType', undefined)
    }
  }, [step, setValue])

  const nextStep = async () => {
    const isValid = await trigger(['fullName', 'phone', 'vehicleId'])
    if (isValid) {
      setSubmitError(null)
      setStep(2)
    }
  }

  const prevStep = () => {
    setSubmitError(null)
    setStep(1)
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!session?.user?.id) {
      setSubmitError('You must be logged in to create a booking')
      return
    }

    // Clear any previous errors
    setSubmitError(null)

    // Validate all required fields
    const validationErrors = [];
    if (!data.serviceType) validationErrors.push('Please select a service type');
    if (!data.date) validationErrors.push('Please select a date');
    if (!data.timeSlot) validationErrors.push('Please select a time slot');
    if (!data.vehicleId) validationErrors.push('Please select a vehicle');

    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(', '));
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setSubmitError('Please select a future date');
      return;
    }

    setIsSubmitting(true)
    try {
      const result = await createBooking({
        ...data,
        userId: session.user.id,
        vehicleId: data.vehicleId
      })
      
      if (result?.error) {
        setSubmitError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (error) {
      console.error('Booking error:', error)
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || isLoadingVehicles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (vehicles.length === 0 && !isLoadingVehicles) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full mx-4">
          <div className="text-yellow-400 text-5xl mb-4">
            <FaCar />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Vehicles Found</h2>
          <p className="text-gray-400 mb-6">
            You need to add a vehicle before you can make a booking.
          </p>
          <Link
            href="/vehicles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block transition-colors"
          >
            Add a Vehicle
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl text-center max-w-md w-full mx-4">
          <div className="text-green-400 text-5xl mb-4">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-6">
            We've received your booking request. We'll contact you shortly to confirm the details.
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-block transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Book Your Service
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Quick and easy booking for all your vehicle cleaning needs
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {submitError}
          </div>
        )}

        {vehicleError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {vehicleError}
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className={step === 1 ? 'text-blue-400 font-semibold' : ''}>1. Personal Info</span>
            <span className={step === 2 ? 'text-blue-400 font-semibold' : ''}>2. Service & Time</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="rounded-full h-2 bg-blue-500 transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      {...register('fullName')}
                      className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      placeholder="+97517123456"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Vehicle</label>
                <select
                  {...register('vehicleId')}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.license}
                    </option>
                  ))}
                </select>
                {errors.vehicleId && (
                  <p className="mt-1 text-sm text-red-500">{errors.vehicleId.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center transition-colors"
                >
                  Next Step
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <FaCalendarDay />
                    </span>
                    <input
                      type="date"
                      {...register('date')}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    />
                  </div>
                  {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Slot</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <FaClock />
                    </span>
                    <select
                      {...register('timeSlot')}
                      className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.timeSlot && (
                    <p className="mt-1 text-sm text-red-500">{errors.timeSlot.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-4">Select Service</label>
                <input type="hidden" {...register('serviceType')} />
                <div className="grid gap-4 md:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.type}
                      className={`p-4 rounded-lg border ${
                        watch('serviceType') === service.type
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-blue-500/50'
                      } cursor-pointer transition-colors`}
                      onClick={() => {
                        setValue('serviceType', service.type)
                        trigger('serviceType') // Trigger validation after selection
                      }}
                    >
                      <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
                      <p className="text-blue-400 font-medium mb-2">{service.price}</p>
                      <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <FaCheckCircle className="text-blue-400 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {errors.serviceType && (
                  <p className="mt-2 text-sm text-red-500">{errors.serviceType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                <textarea
                  {...register('specialRequests')}
                  className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  rows={4}
                  placeholder="Any special requests or notes..."
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  Previous Step
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <FaCalendarCheck className="mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}