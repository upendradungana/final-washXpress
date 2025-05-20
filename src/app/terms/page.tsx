'use client'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function TermsPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const router = useRouter()

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By using our services, you confirm that you have read, understood, and agreed to these Terms. If you do not agree, please do not use WashXpress. We reserve the right to update or modify these Terms at any time without prior notice. Continued use of the Platform signifies your acceptance of any revised Terms.'
    },
    {
      title: '2. Services Provided',
      content: `WashXpress offers an online platform where:

• Car Owners can book car wash appointments at available service centers.
• Car Washers can manage their bookings and schedules.
• Admins oversee the system, manage users, and maintain operational integrity.

We strive to ensure quality service, but WashXpress acts only as a mediator between car owners and washers. We are not responsible for any direct service failures unless explicitly stated.`
    },
    {
      title: '3. User Roles & Responsibilities',
      content: `3.1. Car Owners:
• Provide accurate booking details.
• Arrive on time for appointments.
• Make timely payments if applicable.
• Respect wash center rules and staff.

3.2. Car Washers:
• Provide services in a professional manner.
• Keep availability schedules updated.
• Maintain hygiene and customer service standards.

3.3. Admins:
• Monitor user activity for fraud, abuse, or misuse.
• Can suspend or delete accounts that violate policies.`
    },
    {
      title: '4. Account Registration',
      content: `To access certain features, you may be required to register an account. You agree to:

• Provide accurate, complete information.
• Maintain confidentiality of your login credentials.
• Notify us immediately if you suspect unauthorized access.

WashXpress is not liable for losses arising from unauthorized access to your account.`
    },
    {
      title: '5. Payment and Refund Policy',
      content: `Some features or services may require payment. All payments are:

• Processed securely through authorized payment gateways.
• Non-refundable once the service has been fulfilled.
• Subject to cancellation charges if bookings are canceled without prior notice (typically within 12–24 hours of booking time).

WashXpress reserves the right to modify pricing at any time.`
    },
    {
      title: '6. Booking and Cancellation',
      content: `• Users can book car wash slots based on washer availability.
• Cancellations should be made in advance to avoid penalties.
• Repeated no-shows or late cancellations may result in account suspension.`
    },
    {
      title: '7. User Conduct',
      content: `You agree not to:

• Violate laws or regulations in your jurisdiction.
• Post or transmit unlawful, defamatory, or harmful content.
• Misuse the platform for spam, abuse, or fraudulent activity.

Any violation may result in termination of your account without prior notice.`
    },
    {
      title: '8. Intellectual Property',
      content: 'All content on WashXpress including logos, text, graphics, and software is the property of WashXpress and protected under applicable copyright and intellectual property laws. You may not reproduce, redistribute, or use any content without express written consent.'
    },
    {
      title: '9. Privacy',
      content: 'Your use of the platform is also governed by our Privacy Policy. We collect and process user data in accordance with data protection laws to provide and improve our services. We do not sell or share your data without your consent.'
    },
    {
      title: '10. Disclaimers',
      content: `• WashXpress does not guarantee 100% uptime of the Platform.
• We are not responsible for service delays caused by natural disasters, technical issues, or third-party disruptions.
• Service quality is subject to the washer's capability; however, we strive to onboard verified and trained individuals only.`
    },
    {
      title: '11. Limitation of Liability',
      content: `WashXpress, its developers, and partners shall not be held liable for:

• Loss of data or revenue.
• Damages arising from service use or misuse.
• Issues arising from third-party service providers.

Our liability, in any case, is limited to the amount paid for the service.`
    },
    {
      title: '12. Termination',
      content: 'We reserve the right to terminate or suspend your access to the platform for violating these Terms or for any reason deemed necessary to protect our community and integrity.'
    },
    {
      title: '13. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of Royal Government of Bhuan. Any disputes shall be resolved under the jurisdiction of the  courts.'
    },
    {
      title: '14. Contact Us',
      content: `If you have questions or concerns about these Terms, please contact us at:

📧 supportTeam@washXpress.com
📞 [(+175) 77884488]`
    }
  ]

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Registration</span>
            </button>

            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms and Conditions</h1>
              <p className="text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300">
                Welcome to WashXpress! These Terms and Conditions (&quot;Terms&quot;) govern your use of our platform, services, and website. 
                By accessing or using WashXpress, you agree to be bound by these Terms. Please read them carefully before using our services.
              </p>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-lg overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/70 transition-colors"
                  >
                    <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                    {expandedSection === index ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </button>
                  {expandedSection === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-300 whitespace-pre-line">{section.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 