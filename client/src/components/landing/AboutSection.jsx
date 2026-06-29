import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function AboutSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section
            ref={ref}
            className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden relative"
        >
            {/* Subtle radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-white/40 text-sm tracking-widest uppercase mb-4"
                >
                    ABOUT US
                </motion.p>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight max-w-5xl"
                >
                    Giving communities{" "}
                    <span className="font-serif italic text-white/60">the power</span> to fix
                    <br className="hidden md:inline" /> what matters{" "}
                    <span className="font-serif italic text-white/60">most.</span>
                </motion.h2>
            </div>
        </section>
    )
}
