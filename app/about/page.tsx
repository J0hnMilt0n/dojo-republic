import { Trophy, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-[#0A0F2B] via-[#1F2A5C] to-[#0D1B3E] text-white py-24 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">About Dojo Republic</h1>
          <p className="text-base sm:text-lg text-gray-200 font-light">
            Uniting the martial arts community worldwide
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dojo Republic is more than just a platform—it's a movement to unite martial artists, 
              dojos, coaches, and enthusiasts worldwide. We're building the ultimate ecosystem for 
              combat sports, starting with Karate and expanding to all martial arts disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Trophy className="w-12 h-12 text-gray-900" />}
              title="Excellence"
              description="We strive for excellence in everything we do, from our platform to supporting athletes."
            />
            <ValueCard
              icon={<Users className="w-12 h-12 text-gray-900" />}
              title="Community"
              description="Building strong connections between dojos, athletes, and martial arts lovers."
            />
            <ValueCard
              icon={<Target className="w-12 h-12 text-gray-900" />}
              title="Growth"
              description="Empowering every martial artist to reach their full potential."
            />
            <ValueCard
              icon={<Heart className="w-12 h-12 text-gray-900" />}
              title="Passion"
              description="Driven by our love for martial arts and the spirit of combat sports."
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Dojo Directory"
              description="Find the perfect martial arts school in your area with detailed information, schedules, and pricing."
            />
            <FeatureCard
              title="Tournament Management"
              description="Host, register, and manage martial arts competitions with ease."
            />
            <FeatureCard
              title="Athlete Profiles"
              description="Showcase your achievements, build your legacy, and connect with the community."
            />
            <FeatureCard
              title="Live Scoring"
              description="Real-time match scoring and results management for competitions."
            />
            <FeatureCard
              title="Marketplace"
              description="Shop for quality martial arts equipment, gear, and merchandise."
            />
            <FeatureCard
              title="Training Tracking"
              description="Monitor attendance, engagement, and progress for students and athletes."
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 tracking-tight">Join the Revolution</h2>
          <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Whether you're a student, athlete, coach, or dojo owner, Dojo Republic has 
            something for you. Join thousands of martial artists already part of our community.
          </p>
          <a
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-12 py-5 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-2xl hover:shadow-red-500/50 hover:scale-105 transform"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group text-center bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="inline-flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-red-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
