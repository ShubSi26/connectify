import { AnimatedTestimonials } from "./animated-testimonials";
import baner1 from '../../assets/banner1.png'
import banner2 from '../../assets/banner2.png'
import banner3 from '../../assets/banner3.png'

export default function AnimatedTestimonialsDemo({color1,color2}:{color1?:string; color2?:string}) {
  const testimonials = [
    {
      quote:
        "technology brings people together, making distance irrelevant in creating meaningful connections.",
      name: "Connecting moments, no matter the distance",
      designation: "",
      src: baner1,
    },
    {
      quote:
        "ensures clear and lifelike calls without compression. The experience depends on your network connection, maintaining every detail for an uncompromised conversation.",
      name: "Bringing you closer with HD quality",
      designation: "",
      src: banner2,
    },
    {
      quote:
        "ensures smooth and consistent connections across all devices and operating systems. Whether you're on mobile, desktop, or tablet, enjoy flawless communication without barriers.",
      name: "Seamless communication, no matter the platform",
      designation: "",
      src: banner3,
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} color1={color1} color2={color2} autoplay={true}/>;
}
