import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Clock, Leaf } from "lucide-react";

export default function UrgencyBanner() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative py-16 bg-gradient-to-r from-green-600 via-green-500 to-green-600 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <div className="flex items-center gap-6 text-center lg:text-left">
            <div className="hidden sm:flex bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <Clock className="h-4 w-4 text-white/80" />
                <span className="font-garden text-sm text-white/80 uppercase tracking-wide">Limited Batch Release</span>
              </div>
              <h3 className="font-storybook text-2xl md:text-3xl text-white mb-1">
                First Harvest Now Available
              </h3>
              <p className="font-garden text-white/80">
                Small-batch, sun-grown craft cannabis — while supplies last
              </p>
            </div>
          </div>

          <Link href="/shop">
            <button className="group bg-white hover:bg-parchment text-green-600 px-10 py-4 rounded-xl font-garden font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 whitespace-nowrap">
              <span>Shop Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
