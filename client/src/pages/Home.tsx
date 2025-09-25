import AiTools from '../components/AiTools'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Plan from '../components/Plan'
import Testimonial from '../components/Testimonial'

// this is the landing page 
const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <AiTools/>
      <Testimonial/>
      <Plan/>
      <Footer />
    </div>
  )
}

export default Home
