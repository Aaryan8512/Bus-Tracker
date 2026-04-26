import { motion } from 'framer-motion';
import { Bus, Users, Globe, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 to-green-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 bg-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bus className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-5xl font-black mb-5">About Busly</h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              We're on a mission to make public transportation smarter, more reliable, and more accessible for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-green-600 text-sm font-semibold uppercase tracking-wider">Our Mission</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Transforming urban mobility</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Busly was founded in 2022 with a simple idea: commuters deserve to know exactly where their bus is, in real time, without guessing. We built a platform that turns complex GPS data into a beautiful, intuitive experience.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, Busly serves over 50,000 daily commuters across 15 cities, partnering with transit authorities to bring real-time data to everyone's pocket.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: '50K+', label: 'Daily Users', color: 'bg-green-50 text-green-600' },
                { icon: Globe, value: '15', label: 'Cities', color: 'bg-blue-50 text-blue-600' },
                { icon: Bus, value: '500+', label: 'Buses Tracked', color: 'bg-amber-50 text-amber-600' },
                { icon: Award, value: '98.5%', label: 'Accuracy', color: 'bg-rose-50 text-rose-600' },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-black text-gray-900">{item.value}</p>
                  <p className="text-gray-500 text-sm">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Our Team</h2>
            <p className="text-gray-500">The passionate people behind Busly</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Alex Rivera', role: 'CEO & Co-Founder', init: 'AR', bg: 'bg-green-100 text-green-700' },
              { name: 'Priya Patel', role: 'CTO & Co-Founder', init: 'PP', bg: 'bg-blue-100 text-blue-700' },
              { name: 'Tom Wright', role: 'Head of Design', init: 'TW', bg: 'bg-amber-100 text-amber-700' },
              { name: 'Mia Zhang', role: 'Head of Data', init: 'MZ', bg: 'bg-rose-100 text-rose-700' },
              { name: 'Carlos Santos', role: 'Lead Engineer', init: 'CS', bg: 'bg-teal-100 text-teal-700' },
              { name: 'Nina Kim', role: 'Growth & Marketing', init: 'NK', bg: 'bg-violet-100 text-violet-700' },
            ].map((person, i) => (
              <motion.div key={person.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${person.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-xl font-black">{person.init}</span>
                </div>
                <h3 className="font-bold text-gray-900">{person.name}</h3>
                <p className="text-gray-500 text-sm">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600 text-white text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">Join the Busly community</h2>
          <p className="text-green-100 mb-6">Start tracking your bus today — completely free.</p>
          <Link to="/auth?mode=signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-2xl hover:bg-green-50 transition-colors shadow-xl">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
