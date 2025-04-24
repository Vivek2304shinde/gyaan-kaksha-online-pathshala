
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-lightest to-saffron-light py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-saffron">Gyaan Kaksha</span>
                <span className="block mt-2">Digital Gurukul Platform</span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-dark max-w-lg">
                Experience the wisdom of traditional gurukuls in a modern digital learning
                environment. Connect with teachers, join classes, and learn together.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-saffron hover:bg-saffron-dark text-white"
                >
                  Join as Student
                </Button>
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg"
                  variant="outline"
                  className="border-saffron text-saffron hover:bg-saffron-light"
                >
                  Join as Teacher
                </Button>
              </div>
            </div>

            <div className="relative h-72 md:h-96 animate-slide-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full max-w-md rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-saffron/20 to-purple/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 rounded-full bg-saffron mx-auto flex items-center justify-center mb-4">
                        <span className="text-white text-2xl font-bold">ज्ञान</span>
                      </div>
                      <h3 className="text-xl font-semibold">Ancient Wisdom, Modern Learning</h3>
                      <p className="mt-2 text-sm text-neutral-dark">
                        Interactive online classes with digital whiteboard teaching
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="gyaan-card">
              <div className="h-12 w-12 bg-saffron-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-saffron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Virtual Classrooms</h3>
              <p className="text-neutral-dark">
                Create or join virtual classrooms with unique access codes. Organize your learning journey.
              </p>
            </div>

            <div className="gyaan-card">
              <div className="h-12 w-12 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Teaching</h3>
              <p className="text-neutral-dark">
                Interactive video sessions with digital whiteboard capabilities for an immersive learning experience.
              </p>
            </div>

            <div className="gyaan-card">
              <div className="h-12 w-12 bg-guru-light rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-guru" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Teaching Tools</h3>
              <p className="text-neutral-dark">
                Advanced drawing tools, shapes, grids, and rulers to make teaching effective and engaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-saffron-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Learning Journey?</h2>
          <p className="text-lg text-neutral-dark max-w-xl mx-auto mb-8">
            Join our digital gurukul today and experience the perfect blend of traditional wisdom and modern technology.
          </p>
          <Button
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-saffron hover:bg-saffron-dark text-white"
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
