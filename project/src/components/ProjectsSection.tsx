import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "3D Interactive Experience",
    description: "A fully immersive 3D web experience built with Three.js and React Three Fiber.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    title: "Cosmic Animation",
    description: "Space-themed animation showcase using GSAP and custom WebGL shaders.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    link: "#"
  }
];

export default function ProjectsSection() {
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    projectRefs.current.forEach((el, i) => {
      if (el) {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top center+=100",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: i * 0.2
        });
      }
    });
  }, []);

  return (
    <section className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-16 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <div
              key={i}
              ref={el => projectRefs.current[i] = el}
              className="group relative overflow-hidden rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <a
                  href={project.link}
                  className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors"
                >
                  View Project <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}