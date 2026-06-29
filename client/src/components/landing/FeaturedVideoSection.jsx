import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function FeaturedVideoSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const navigate = useNavigate()

    return (
        <section
            ref={ref}
            className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9 }}
                    className="relative rounded-3xl overflow-hidden aspect-video w-full"
                >
                    {/* Background Video */}
                    <video
                        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload="auto"
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Bottom overlay content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        {/* Left Card */}
                        <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md w-full">
                            <p className="text-white/50 text-xs tracking-widest uppercase mb-3 font-semibold">
                                OUR APPROACH
                            </p>
                            <p className="text-white text-sm md:text-base leading-relaxed">
                                We believe civic change starts at street level. Every issue reported
                                is a citizen raising their hand. We make sure that hand is never
                                ignored — by using AI, community verification, and real-time
                                accountability to turn complaints into action.
                            </p>
                        </div>

                        {/* Right Button */}
                        <motion.button
                            onClick={() => navigate('/login?portal=citizen')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium cursor-pointer self-start md:self-auto hover:bg-white/5 transition-colors"
                        >
                            Explore the Platform →
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
