'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaSpinner, FaReply } from 'react-icons/fa';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      redirect('/');
    }
  }, [status, session]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchMessages();
    }
  }, [session]);

  const handleRowClick = (messageId: string) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setExpandedMessageId(null);
    }
  };

  const handleRespond = (e: React.MouseEvent, email: string, subject: string) => {
    e.stopPropagation(); // Prevent row click event
    const mailtoLink = `mailto:${email}?subject=Re: ${subject}`;
    window.location.href = mailtoLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <div className="flex items-center text-gray-400">
            <FaEnvelope className="mr-2" />
            <span>{messages.length} messages</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Respond
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    onClick={() => handleRowClick(message.id)}
                    className="hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{message.name}</div>
                      <div className="text-sm text-gray-400">{message.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => handleRespond(e, message.email, message.subject)}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                        title="Reply via email"
                      >
                        <FaReply />
                        <span className="text-sm">Reply</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {expandedMessageId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleClickOutside}
          >
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
              {messages.find((m) => m.id === expandedMessageId) && (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {messages.find((m) => m.id === expandedMessageId)?.subject}
                      </h3>
                      <p className="text-gray-400">
                        From: {messages.find((m) => m.id === expandedMessageId)?.name} (
                        {messages.find((m) => m.id === expandedMessageId)?.email})
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedMessageId(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">
                      {messages.find((m) => m.id === expandedMessageId)?.message}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 