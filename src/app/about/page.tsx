export default function About() {
  return (
    <div className="container mx-auto p-6 bg-light rounded-lg shadow-md space-y-12">
      
      {/* Main Intro */}
      <section>
        <h1 className="text-4xl font-extrabold mb-6 text-primary">About Altara Homes</h1>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://images.pexels.com/photos/32705806/pexels-photo-32705806.jpeg" 
            alt="Modern Home"
            className="w-full md:w-1/2 rounded-lg shadow-lg"
          />
          <div className="prose max-w-prose text-dark">
            <p>
              Welcome to <span className="font-semibold text-accent">Altara Homes</span>, your trusted partner in navigating the property market with confidence and ease. Whether you&apos;re searching for your dream home, a lucrative investment, or a cozy rental, we are dedicated to making your real estate journey smooth and enjoyable.
            </p>
            <p>
              With an extensive database of carefully curated listings and a network of experienced agents, we strive to connect buyers, sellers, and renters in a transparent and efficient marketplace. Our commitment is to empower you with the right tools and personalized support, so you can make informed decisions that best suit your lifestyle and financial goals.
            </p>
            <p>
              At Altara Homes, we believe that finding the perfect property is more than just a transaction — it’s the foundation of your future. That’s why we emphasize clear communication, integrity, and responsiveness throughout every step of the process.
            </p>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision */}
      <section className="bg-muted p-8 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold mb-6 text-primary">Our Mission & Vision</h2>
        <p className="max-w-prose text-dark mb-4">
          Our mission is simple yet powerful: to deliver a seamless, user-friendly platform where property seekers and owners come together to create lasting success stories.
        </p>
        <p className="max-w-prose text-dark">
          We envision a future where everyone can access the perfect property with confidence, supported by cutting-edge technology and passionate professionals who care.
        </p>
      </section>

      {/* Team Section */}
      {/* <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          <div className="text-center">
            <img
              src="/images/team/jane-doe.jpg" 
              alt="Jane Doe"
              className="mx-auto w-40 h-40 rounded-full object-cover shadow-lg"
            />
            <h3 className="text-xl font-semibold mt-4 text-dark">Jane Doe</h3>
            <p className="text-accent">Senior Agent</p>
            <p className="text-muted mt-2">
              Jane has 10+ years of experience helping families find their dream homes.
            </p>
          </div>

         
          <div className="text-center">
            <img
              src="/images/team/john-smith.jpg" 
              alt="John Smith"
              className="mx-auto w-40 h-40 rounded-full object-cover shadow-lg"
            />
            <h3 className="text-xl font-semibold mt-4 text-dark">John Smith</h3>
            <p className="text-accent">Investment Specialist</p>
            <p className="text-muted mt-2">
              John specializes in investment properties and maximizing ROI for clients.
            </p>
          </div>

          
          <div className="text-center">
            <img
              src="/images/team/emily-chen.jpg"
              alt="Emily Chen"
              className="mx-auto w-40 h-40 rounded-full object-cover shadow-lg"
            />
            <h3 className="text-xl font-semibold mt-4 text-dark">Emily Chen</h3>
            <p className="text-accent">Customer Support</p>
            <p className="text-muted mt-2">
              Emily ensures every client’s questions are answered promptly and clearly.
            </p>
          </div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="bg-secondary p-8 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold mb-6 text-primary text-center">What Our Clients Say</h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          <blockquote className="bg-light p-6 rounded-lg shadow-md text-dark italic border-l-4 border-accent">
            <p>
              {"RealEstate made buying our first home a wonderful experience. The agents were patient and knowledgeable — highly recommended!"}
            </p>
            <footer className="mt-4 font-semibold text-accent">— Sarah & Michael</footer>
          </blockquote>

          <blockquote className="bg-light p-6 rounded-lg shadow-md text-dark italic border-l-4 border-accent">
            <p>
              {"Thanks to RealEstate, I found a perfect investment property with great potential. The team really knows the market."}
            </p>
            <footer className="mt-4 font-semibold text-accent">— David L.</footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
