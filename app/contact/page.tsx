import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-linear-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">Contact Us</h1>
          <p className="text-base sm:text-lg text-gray-200 font-light">
            Get in touch with the Dojo Republic team
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-linear-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                    placeholder="+44 7440 133748"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-red-600 to-red-800 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-xl hover:shadow-red-500/50 hover:scale-105 transform"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-5 bg-linear-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-linear-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Email</h3>
                    <p className="text-gray-600 font-medium">info@dojorepublic.com</p>
                    <p className="text-gray-600 font-medium">support@dojorepublic.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 bg-linear-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-linear-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Phone</h3>
                    <p className="text-gray-600 font-medium">+44 7440 133748</p>
                    <p className="text-gray-600 font-medium">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 bg-linear-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-linear-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Address</h3>
                    <p className="text-gray-600 font-medium">
                      123 Martial Arts Way<br />
                      Sports City, SC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 bg-linear-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-14 h-14 bg-linear-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Business Hours</h3>
                    <p className="text-gray-600 font-medium">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

