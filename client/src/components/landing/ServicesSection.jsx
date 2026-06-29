import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export default function ServicesSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section
            ref={ref}
            className="bg-black py-28 md:py-40 px-6 overflow-hidden relative"
        >
            {/* Subtle radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="flex justify-between items-end mb-12 md:mb-16"
                >
                    <h2 className="text-3xl md:text-5xl text-white tracking-tight font-medium">
                        What we solve
                    </h2>
                    <span className="text-white/40 text-sm hidden md:inline font-semibold">
                        Our focus areas
                    </span>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="liquid-glass rounded-3xl overflow-hidden group flex flex-col w-full cursor-pointer"
                    >
                        <div className="aspect-video w-full overflow-hidden relative">
                            <video
                                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
                                muted
                                autoPlay
                                loop
                                playsInline
                                preload="auto"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-white/40 text-xs tracking-widest uppercase font-semibold">
                                        INTELLIGENCE
                                    </span>
                                    <div className="liquid-glass rounded-full p-2 text-white hover:bg-white/10 transition-colors">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                                <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-bold">
                                    AI-Powered Issue Detection
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    Upload a photo and our Gemini AI instantly reads it — identifying
                                    the issue type, severity, and category so you never have to fill
                                    a single form.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="liquid-glass rounded-3xl overflow-hidden group flex flex-col w-full cursor-pointer"
                    >
                        <div className="aspect-video w-full overflow-hidden relative">
                            <video
                                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"
                                muted
                                autoPlay
                                loop
                                playsInline
                                preload="auto"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-white/40 text-xs tracking-widest uppercase font-semibold">
                                        COMMUNITY
                                    </span>
                                    <div className="liquid-glass rounded-full p-2 text-white hover:bg-white/10 transition-colors">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                                <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-bold">
                                    Verified by Your Neighbors
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    When people nearby confirm the same issue, it gets escalated
                                    automatically. Three verifications trigger authority action —
                                    democracy one tap at a time.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
