
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { getSubjects } from '@/services/mockData';
import { 
  BookOpen, 
  LineChart, 
  Users, 
  Clock, 
  Award, 
  ChevronRight,
  Code,
  Database,
  AlignLeft
} from 'lucide-react';

const subjects = getSubjects();

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  
  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login';
    return user?.role === 'student' ? '/student/dashboard' : '/faculty/dashboard';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-900 to-brand-700 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="mb-12 lg:mb-0">
                <h1 className="heading-xl mb-6">
                  MOCK TEST: Master Your Technical Skills
                </h1>
                <p className="text-xl text-brand-100 mb-8">
                  Practice with our timed tests in Python, Data Structures, and Database Management. Track your progress with instant feedback.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="text-lg">
                    <Link to={getDashboardLink()}>
                      Get Started
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="text-lg">
                    <Link to="/login">
                      Log In
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="rounded-xl overflow-hidden shadow-2xl transform rotate-2 transition duration-500 hover:rotate-0">
                  <img 
                    src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80" 
                    alt="Student studying" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4 text-brand-800 dark:text-brand-400">Key Features of MOCK TEST</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our platform provides comprehensive tools for students and educators
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Code />}
                title="Python Tests"
                description="Practice with our carefully crafted tests covering Python programming concepts"
              />
              <FeatureCard 
                icon={<AlignLeft />}
                title="Data Structure Tests"
                description="Master algorithms and data structures with comprehensive practice tests"
              />
              <FeatureCard 
                icon={<Database />}
                title="Database Management Tests"
                description="Test your knowledge of SQL and database concepts"
              />
              <FeatureCard 
                icon={<Clock />}
                title="Timed Practice"
                description="Build your speed and confidence with 10-minute timed tests"
              />
              <FeatureCard 
                icon={<LineChart />}
                title="Performance Analytics"
                description="Track your progress over time with detailed performance insights"
              />
              <div className="card-shadow rounded-lg p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 flex items-center justify-center">
                <Button asChild variant="outline" size="lg" className="w-full text-lg">
                  <Link to="/signup" className="flex items-center justify-center gap-2">
                    Sign Up Now <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Section */}
        <section className="py-16 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="heading-lg mb-4 text-brand-800 dark:text-brand-400">Available Test Subjects</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Start practicing in any of these technical areas
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subjects.map((subject) => (
                <div 
                  key={subject.id} 
                  className="card-shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800"
                >
                  <img  
                    src={subject.imageUrl}
                    alt={subject.name}
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="heading-sm mb-2 text-brand-700 dark:text-brand-400">{subject.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{subject.description}</p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={getDashboardLink()}>Start Practice</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-700 dark:bg-brand-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="heading-lg mb-6">Ready to Ace Your Technical Tests?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join MOCK TEST today and improve your skills in Python, Data Structures, and Database Management
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/signup">Sign Up for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="card-shadow rounded-lg p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800">
    <div className="inline-flex items-center justify-center p-3 bg-brand-100 dark:bg-brand-900 rounded-lg text-brand-700 dark:text-brand-300 mb-5">
      {icon}
    </div>
    <h3 className="heading-sm mb-2 text-brand-700 dark:text-brand-400">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default HomePage;
