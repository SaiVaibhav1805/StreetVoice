import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function PhilosophySection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <section
            ref={ref}
            className="bg-black py-28 md:py-40 px-6 overflow-hidden"
        >
            <div className="max-w-6xl mx-auto">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
                >
                    Community{" "}
                    <span className="font-serif italic text-white/40">x</span>{" "}
                    Action
                </motion.h2>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left Column — Video */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="rounded-3xl overflow-hidden aspect-[4/3] w-full"
                    >
                        <video
                            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
                            muted
                            autoPlay
                            loop
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Right Column — Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-8 md:gap-12"
                    >
                        {/* Block 1 */}
                        <div>
                            <p className="text-white/40 text-xs tracking-widest uppercase mb-4 font-semibold">
                                REPORT IN SECONDS
                            </p>
                            <p className="text-white/70 text-base md:text-lg leading-relaxed">
                                Every meaningful change in a city begins with one citizen deciding
                                enough is enough. StreetVoice gives that citizen a voice that's
                                impossible to ignore — backed by AI analysis, neighbor
                                verification, and a public dashboard that holds authorities
                                accountable.
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/10" />

                        {/* Block 2 */}
                        <div>
                            <p className="text-white/40 text-xs tracking-widest uppercase mb-4 font-semibold">
                                TRACK UNTIL FIXED
                            </p>
                            <p className="text-white/70 text-base md:text-lg leading-relaxed">
                                We believe the best cities aren't built by governments alone — they're
                                built by the people who live in them. Our platform turns everyday
                                frustration into organized, data-driven civic action that gets results.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
