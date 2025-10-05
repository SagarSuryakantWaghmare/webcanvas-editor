import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ScrollVelocity from '../components/ScrollVelocity';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      
      <section className="py-12 bg-gray-900 overflow-hidden">
        <ScrollVelocity
          texts={[
            "PROFESSIONAL DESIGN TOOLS • NO SIGN-IN REQUIRED • UNLIMITED CREATIVITY •",
            "DRAW • SKETCH • PAINT • DESIGN • CREATE • INNOVATE • BUILD • CRAFT •"
          ]}
          velocity={50}
          className="text-orange-600 font-bold"
          parallaxClassName="py-4"
          scrollerClassName="text-2xl md:text-4xl"
          numCopies={4}
          velocityMapping={{ input: [0, 500], output: [0, 3] }}
        />
      </section>

      
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Creative Minds
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to bring your ideas to life with professional-grade tools.
            </p>
          </div>

          
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="lg:w-1/2 space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Professional Drawing Tools</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Create stunning artwork with our comprehensive suite of brushes, pencils, and vector tools. 
                      Advanced pressure sensitivity and customizable settings give you complete creative control.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center"><div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div> Customizable brushes & textures</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div> Vector & raster support</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div> Pressure-sensitive drawing</li>
                    </ul>
                  </div>
                  <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                    <div className="w-48 h-48 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-6xl animate-pulse">🎨</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col lg:flex-row-reverse items-center">
                  <div className="lg:w-1/2 space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Smart Layer Management</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Organize complex projects with intelligent layer systems. Group, blend, and manage your artwork 
                      with advanced layer effects and non-destructive editing capabilities.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center"><div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div> Unlimited layers & groups</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div> Blend modes & effects</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div> Non-destructive editing</li>
                    </ul>
                  </div>
                  <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                    <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-6xl animate-pulse">📚</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col lg:flex-row items-center">
                  <div className="lg:w-1/2 space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">No Sign-in Required</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Start creating immediately without any registration or account setup. Jump straight into your 
                      creative flow with instant access to all professional tools and features.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div> Instant access, no registration</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div> Privacy-focused approach</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div> Start creating in seconds</li>
                    </ul>
                  </div>
                  <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                    <div className="w-48 h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-6xl animate-pulse">🚀</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col lg:flex-row-reverse items-center">
                  <div className="lg:w-1/2 space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Cloud Storage & Auto-Save</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Never lose your work with automatic cloud synchronization and intelligent backup systems. 
                      Access your projects from any device, anywhere in the world.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center"><div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div> Automatic cloud sync</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div> Cross-device access</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div> 99.9% uptime guarantee</li>
                    </ul>
                  </div>
                  <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                    <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <div className="text-6xl animate-pulse">☁️</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-3xl p-12 text-center">
            <div className="absolute inset-0 bg-black/5 rounded-3xl"></div>
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">And So Much More</h3>
              <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                Discover unlimited possibilities with our comprehensive suite of design tools, 
                export options, and integrations.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
                <div className="flex flex-col items-center group">
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">📱</div>
                  <span className="text-sm font-medium">Mobile Ready</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">⚡</div>
                  <span className="text-sm font-medium">Lightning Fast</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">🔒</div>
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
                <div className="flex flex-col items-center group">
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">🎯</div>
                  <span className="text-sm font-medium">Pixel Perfect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">
                © 2025 WebCanvas Editor
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-gray-400">
                Made by <span className="text-orange-400 font-semibold">Sagar Suryakant Waghmare</span>
              </p>
              <a 
                href="https://github.com/SagarSuryakantWaghmare" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
