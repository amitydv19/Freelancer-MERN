import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const logos = [
  'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
]

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('usertype')
    if (role === 'freelancer') navigate('/freelancer')
    else if (role === 'client') navigate('/client')
    else if (role === 'admin') navigate('/admin')
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-5">

  <h2 className="text-2xl font-bold text-blue-600 cursor-pointer">
    SB Works
  </h2>

  <div className="flex gap-4">
    <button
      onClick={() => navigate('/authenticate')}
      className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-700 
      cursor-pointer transition-all duration-300"
    >
      Log In
    </button>

    <button
      onClick={() => navigate('/authenticate')}
      className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-700 cursor-pointer
      transition-all duration-300 "
    >
      Sign Up
    </button>
  </div>

</div>

      {/* HERO */}
      <section className="text-center px-6 mt-24">
        <h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto"
        >
          Where Talent Meets <span className="text-blue-600">Real Opportunities</span>
        </h1>

        <p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg"
        >
          SB Works is built for serious freelancers and genuine clients.
          No spam. No fake projects. Just focused collaboration.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate('/authenticate')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Start as Client
          </button>
          <button
            onClick={() => navigate('/authenticate')}
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 cursor-pointer"
          >
            Start as Freelancer
          </button>
        </div>
      </section>

      {/* LOGO SLIDER */}
      <section className="mt-28 overflow-hidden">
        <h3 className="text-center text-gray-600 mb-6">
          Used by modern teams and professionals
        </h3>

        <div className="relative w-full overflow-hidden">
          <div
            animate={{ x: ['0%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex gap-16 w-max px-8"
          >
            {[...logos, ...logos].map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt="company logo"
                className="h-10 grayscale hover:grayscale-0 transition"
              />
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mt-32 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Freelancing today is broken</h2>
        <p className="text-gray-600">
          Clients face unreliable delivery and unclear proposals.
          Freelancers waste time on low-quality projects and price wars.
          SB Works fixes this with clarity and structure.
        </p>
      </section>

      {/* WHY SB WORKS */}
      <section className="mt-32 max-w-6xl mx-auto px-8 grid md:grid-cols-3 gap-8">

        <Card
          title="Verified Projects"
          text="Every project is reviewed to ensure clarity and genuine intent."
        />
        <Card
          title="Smart Communication"
          text="All discussions stay in one place with real-time chat."
        />
        <Card
          title="Structured Workflow"
          text="Clear steps from application to final delivery."
        />
      </section>

{/* HOW IT WORKS */}
<section className="mt-32 px-6">
  <div className="bg-gray-100 rounded-3xl py-20 px-10 max-w-6xl mx-auto">

    <h2 className="text-3xl font-bold text-center mb-16">
      Where your needs and our product meet
    </h2>

    <div className="grid md:grid-cols-3 gap-12 text-center">

      {/* Step 1 */}
      <div>
        <img
          src="/src/images/step1.svg"
          alt="step1"
          className="h-24 mx-auto mb-6"
        />

        <h3 className="text-xl font-semibold mb-3">
          Create & Explore
        </h3>

        <p className="text-gray-600">
          Clients post detailed projects while freelancers explore
          verified listings and apply with focused proposals.
        </p>
        <div className="w-8 h-8 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center 
          text-sm font-semibold mt-6 mb-0">
          1
        </div>
      </div>

      {/* Step 2 */}
      <div>
        <img
          src="/src/images/step2.svg"
          alt="step2"
          className="h-24 mx-auto mb-6"
        />

        <h3 className="text-xl font-semibold mb-3">
          Connect & Assign
        </h3>

        <p className="text-gray-600">
          Both sides discuss scope, timelines and expectations
          before the project is officially assigned.
        </p>
        <div className="w-8 h-8 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center 
        text-sm font-semibold mt-6 mb-0">
          2
        </div>
      </div>

      {/* Step 3 */}
      <div>
        <img
          src="/src/images/step3.svg"
          alt="step3"
          className="h-24 mx-auto mb-6"
        />

        <h3 className="text-xl font-semibold mb-3">
          Deliver & Complete
        </h3>

        <p className="text-gray-600">
          Work is submitted, reviewed and approved through a
          transparent workflow.
        </p>
        <div className="w-8 h-8 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center 
        text-sm font-semibold mt-10 mb-0">
        3
      </div>
      </div>

    </div>

  </div>
</section>
<section className="mt-32 max-w-5xl mx-auto px-6 text-center">
  <h2 className="text-3xl font-semibold mb-6">
    Why this workflow works
  </h2>

  <p className="text-gray-600 text-lg">
    SB Works removes unnecessary steps, unclear communication,
    and last-minute surprises. Every action is intentional,
    documented, and visible to both parties.
  </p>
</section>
<section className="mt-24 max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-10">

  <div className="border rounded-2xl p-8 shadow-md hover:shadow-blue-400/50 hover:shadow-2xl transition duration-300 bg-white">
    <h2 className="text-2xl font-bold mb-3">Built for serious freelancers</h2>
    <p className="text-gray-600">
      Work only on projects with clear scope and real intent. No bidding chaos,
      no fake clients, and no time wasted explaining basics repeatedly.
    </p>
  </div>

  <div className="border rounded-2xl p-8 shadow-md hover:shadow-blue-400/50 hover:shadow-2xl transition duration-300 bg-white">
    <h2 className="text-2xl font-bold mb-3">Focus on delivery, not chasing</h2>
    <p className="text-gray-600">
      Centralized communication and structured steps allow you to focus on
      quality work and long-term relationships.
    </p>
  </div>

  <div className="border rounded-2xl p-8 shadow-md hover:shadow-blue-400/50 hover:shadow-2xl transition duration-300 bg-white">
    <h2 className="text-2xl font-bold mb-3">Hire with clarity and confidence</h2>
    <p className="text-gray-600">
      Receive proposals that actually address your requirements. Assign
      projects only after expectations are aligned.
    </p>
  </div>

  <div className="border rounded-2xl p-8 shadow-md hover:shadow-blue-400/50 hover:shadow-2xl transition duration-300 bg-white">
    <h2 className="text-2xl font-bold mb-3">Transparent execution</h2>
    <p className="text-gray-600">
      Track progress, communication, and delivery without micromanagement
      or guesswork.
    </p>
  </div>
<div className="col-span-2 flex justify-center mt-8">
    <button
      onClick={() => navigate('/authenticate')}
      className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 cursor-pointer
      transition-all duration-300 ">
      Get Started with SB Works
    </button>
  </div>
</section>

{/* FOOTER */}
<footer className="bg-black text-gray-300 mt-32">
  <div className="max-w-6xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-8">

    <div>
      <h2 className="text-xl font-bold text-white">SB Works</h2>
      <p className="mt-3 text-sm">
        A platform where serious freelancers and clients collaborate
        with clarity and structured workflow.
      </p>
    </div>

    <div>
      <h3 className="text-white font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li className="hover:text-white cursor-pointer">Home</li>
        <li className="hover:text-white cursor-pointer">Projects</li>
        <li className="hover:text-white cursor-pointer">Freelancers</li>
      </ul>
    </div>

    <div>
      <h3 className="text-white font-semibold mb-3">Contact</h3>
      <p className="text-sm">support@sbworks.com</p>
      <p className="text-sm mt-2">Lucknow, India</p>
    </div>

  </div>

  <div className="border-t border-gray-700 text-center py-4 text-sm">
    © {new Date().getFullYear()} SB Works. All rights reserved.
  </div>
</footer>

</div>

  )
}



/* ---------- SMALL COMPONENTS ---------- */

const Card = ({ title, text }) => (
  <div className="bg-white p-8 rounded-2xl border-0 border-r-4 shadow text-center transition-all duration-300 hover:-translate-y-2 
                  hover:shadow-2xl hover:border-blue-600">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-600 mt-2">{text}</p>
  </div>
);

const Step = ({ step, title }) => (
  <div whileHover={{ scale: 1.05 }} className="text-center">
    <div className="w-14 h-14 mx-auto rounded-full bg-blue-600
     text-white flex items-center justify-center font-bold mb-4">
      {step}
    </div>
    <h4 className="font-semibold text-lg">{title}</h4>
  </div>
)

export default Landing
