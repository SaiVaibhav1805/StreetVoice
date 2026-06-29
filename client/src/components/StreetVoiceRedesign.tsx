import * as React from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { AnimatePresence, motion, useInView } from "framer-motion"

type AppView = "Landing" | "Home" | "Report Issue" | "My Reports" | "Dashboard" | "Community"

interface MyComponentProps {
    backgroundImage: string
    accentColor: string
    secondaryAccent: string
    surfaceColor: string
    textColor: string
    landingTitle: string
    landingSubtitle: string
    primaryCta: string
    secondaryCta: string
    defaultView: AppView
    showSidebar: boolean
    fontFamily: string
    headingFont: any
    bodyFont: any
}

const tabs: AppView[] = ["Landing", "Home", "Report Issue", "My Reports", "Dashboard", "Community"]
const defaultBg =
    "https://framerusercontent.com/images/EI41kPbd8LAxvxxnx5EIDGGj4.png?width=1918&height=862&kb=192"
const categories = ["All Categories", "Pothole", "Water Leakage", "Streetlight", "Garbage", "Sewage", "Road Damage", "Encroachment", "Other Issues"]
const leaderboard = [
    { name: "Ananya Reddy", points: 420, city: "Hyderabad" },
    { name: "Sai Vaibhav", points: 390, city: "Bengaluru" },
    { name: "Rahul Kumar", points: 350, city: "Delhi" },
    { name: "Priya Sharma", points: 320, city: "Mumbai" },
    { name: "Anonymous", points: 280, city: "Chennai" },
]

function useViewportWidth(): number {
    const [width, setWidth] = React.useState<number>(() => (typeof window !== "undefined" ? window.innerWidth : 1440))
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const onResize = () => React.startTransition(() => setWidth(window.innerWidth))
            window.addEventListener("resize", onResize)
            return () => window.removeEventListener("resize", onResize)
        }
    }, [])
    return width
}

function useSharedStyles(props: MyComponentProps) {
    const { textColor, fontFamily, bodyFont, headingFont, surfaceColor } = props
    const sharedShellStyle = React.useMemo<React.CSSProperties>(
        () => ({
            background: surfaceColor,
            borderRadius: 24,
            boxShadow: "10px 10px 22px rgba(15, 23, 42, 0.14), -10px -10px 22px rgba(255, 255, 255, 0.9)",
            border: "1px solid rgba(255,255,255,0.7)",
        }),
        [surfaceColor]
    )
    const textBaseStyle = React.useMemo<React.CSSProperties>(
        () => ({
            color: textColor,
            fontFamily: fontFamily || "Satoshi, Clash Display, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
            fontSize: bodyFont?.fontSize,
            lineHeight: bodyFont?.lineHeight,
            letterSpacing: bodyFont?.letterSpacing,
            fontWeight: bodyFont?.fontWeight,
            fontStyle: bodyFont?.fontStyle,
            textAlign: bodyFont?.textAlign,
        }),
        [textColor, fontFamily, bodyFont]
    )
    const headingStyle = React.useMemo<React.CSSProperties>(
        () => ({
            ...textBaseStyle,
            fontSize: headingFont?.fontSize,
            lineHeight: headingFont?.lineHeight,
            letterSpacing: headingFont?.letterSpacing,
            fontWeight: headingFont?.fontWeight,
            fontStyle: headingFont?.fontStyle,
            textAlign: headingFont?.textAlign,
            minWidth: "max-content",
        }),
        [textBaseStyle, headingFont]
    )
    return { sharedShellStyle, textBaseStyle, headingStyle }
}

function renderLandingPage(props: MyComponentProps, isMobile: boolean, shouldAnimate: boolean, headingStyle: React.CSSProperties, textBaseStyle: React.CSSProperties) {
    return (
        <section
            style={{
                position: "relative",
                width: "100%",
                minHeight: isMobile ? 560 : 700,
                borderRadius: 24,
                overflow: "hidden",
                padding: isMobile ? 24 : 48,
                backgroundImage: `linear-gradient(120deg, rgba(3, 7, 18, 0.82), rgba(15, 23, 42, 0.66)), url(${props.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <motion.div
                aria-hidden="true"
                animate={shouldAnimate ? { x: [0, 20, 0], y: [0, -14, 0] } : undefined}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", background: props.accentColor, filter: "blur(70px)", opacity: 0.28, top: -80, left: -40 }}
            />
            <motion.div
                aria-hidden="true"
                animate={shouldAnimate ? { x: [0, -24, 0], y: [0, 16, 0] } : undefined}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", background: props.secondaryAccent, filter: "blur(70px)", opacity: 0.2, bottom: -90, right: -30 }}
            />
            <div style={{ position: "relative", width: "100%", maxWidth: 980, borderRadius: 24, padding: isMobile ? 24 : 36, backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.24)", boxShadow: "0 22px 70px rgba(0,0,0,0.34)" }}>
                <h1 style={{ ...headingStyle, color: "#FFFFFF", margin: 0, whiteSpace: "normal" }}>{props.landingTitle}</h1>
                <p style={{ ...textBaseStyle, color: "rgba(255,255,255,0.92)", marginTop: 14 }}>{props.landingSubtitle}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                    <button type="button" aria-label={props.primaryCta} style={{ border: "none", borderRadius: 14, padding: "12px 18px", background: props.accentColor, color: "#FFFFFF", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.24)" }}>
                        {props.primaryCta}
                    </button>
                    <button type="button" aria-label={props.secondaryCta} style={{ border: "1px solid rgba(255,255,255,0.35)", borderRadius: 14, padding: "12px 18px", background: "rgba(255,255,255,0.08)", color: "#FFFFFF", cursor: "pointer" }}>
                        {props.secondaryCta}
                    </button>
                </div>
                <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                    {["50+ Cities", "12,000+ Issues Reported", "8,400+ Resolved", "4.8 Rating"].map((metric) => (
                        <div key={metric} style={{ borderRadius: 14, padding: 12, background: "rgba(255,255,255,0.12)" }}>
                            <div style={{ ...textBaseStyle, color: "#FFFFFF", fontWeight: 700 }}>{metric}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function renderAppPage(view: AppView, isMobile: boolean, shouldAnimate: boolean, props: MyComponentProps, sharedShellStyle: React.CSSProperties, textBaseStyle: React.CSSProperties, headingStyle: React.CSSProperties) {
    if (view === "Home") {
        return <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.25fr 1fr", gap: 16 }}><article style={{ ...sharedShellStyle, padding: 18 }}><h3 style={{ ...headingStyle, marginTop: 0 }}>Nearby Reported Issues</h3><div role="img" aria-label="Map overview of nearby issues" style={{ height: 280, borderRadius: 16, background: "linear-gradient(145deg, rgba(0,0,0,0.08), rgba(255,255,255,0.65))", boxShadow: "inset 8px 8px 18px rgba(15,23,42,0.14), inset -8px -8px 18px rgba(255,255,255,0.92)" }} /></article><article style={{ ...sharedShellStyle, padding: 18 }}><h3 style={{ ...headingStyle, marginTop: 0 }}>Issue Feed</h3>{["Pothole on Lake Road", "Streetlight out near Metro", "Garbage overflow near school"].map((item, i) => <motion.div key={item} whileHover={shouldAnimate ? { y: -4 } : undefined} style={{ marginBottom: 12, borderRadius: 14, padding: 12, background: "rgba(255,255,255,0.6)", boxShadow: "6px 6px 14px rgba(15,23,42,0.12), -6px -6px 14px rgba(255,255,255,0.96)" }}><div style={{ ...textBaseStyle, fontWeight: 650 }}>{item}</div><div style={{ ...textBaseStyle, opacity: 0.7 }}>Status: {i === 2 ? "Pending" : "In Progress"}</div></motion.div>)}</article></section>
    }
    if (view === "Report Issue") {
        return <section style={{ display: "flex", justifyContent: "center" }}><article style={{ ...sharedShellStyle, width: "100%", maxWidth: 820, padding: 22 }}><h3 style={{ ...headingStyle, marginTop: 0 }}>Report Issue</h3><label style={{ ...textBaseStyle, display: "block", marginBottom: 8 }}>Category</label><div style={{ borderRadius: 14, padding: 12, marginBottom: 14, background: "rgba(255,255,255,0.65)", boxShadow: "inset 6px 6px 12px rgba(15,23,42,0.12), inset -6px -6px 12px rgba(255,255,255,0.95)" }}><span style={textBaseStyle}>{categories.join(" • ")}</span></div><label style={{ ...textBaseStyle, display: "block", marginBottom: 8 }}>Description</label><div style={{ borderRadius: 14, minHeight: 120, padding: 12, marginBottom: 14, background: "rgba(255,255,255,0.65)", boxShadow: "inset 6px 6px 12px rgba(15,23,42,0.12), inset -6px -6px 12px rgba(255,255,255,0.95)" }} /><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><button type="button" aria-label="Upload photo evidence" style={{ borderRadius: 12, border: "none", padding: "10px 14px", background: props.secondaryAccent, color: "#FFFFFF" }}>Upload Photo</button><button type="button" aria-label="Submit issue report" style={{ borderRadius: 12, border: "none", padding: "10px 14px", background: props.accentColor, color: "#FFFFFF" }}>Submit Report</button></div></article></section>
    }
    if (view === "My Reports") {
        return <section style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "0.85fr 1.15fr", gap: 16 }}><article style={{ ...sharedShellStyle, padding: 18 }}><h3 style={{ ...headingStyle, marginTop: 0 }}>My Profile</h3><div style={{ ...textBaseStyle, fontWeight: 700 }}>Ananya Reddy</div><div style={{ ...textBaseStyle, opacity: 0.7 }}>21 reports • 14 resolved</div><div style={{ marginTop: 14, borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.5)" }}><motion.div animate={shouldAnimate ? { width: ["0%", "72%"] } : { width: "72%" }} transition={{ duration: 1.2 }} style={{ height: 10, background: props.accentColor }} /></div></article><article style={{ ...sharedShellStyle, padding: 18 }}><h3 style={{ ...headingStyle, marginTop: 0 }}>Recent Reports</h3>{["Road crack repaired", "Water leakage verification", "Streetlight pending"].map((r) => <div key={r} style={{ ...textBaseStyle, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>{r}</div>)}</article></section>
    }
    if (view === "Dashboard") {
        return <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>{[{ title: "Total Reports", value: "12,000+" }, { title: "Resolved", value: "8,400+" }, { title: "Avg. Resolution", value: "3.2 days" }, { title: "AI Verification", value: "96%" }].map((item) => <article key={item.title} style={{ ...sharedShellStyle, padding: 18 }}><div style={{ ...textBaseStyle, opacity: 0.75 }}>{item.title}</div><div style={{ ...headingStyle, marginTop: 8, whiteSpace: "normal" }}>{item.value}</div><motion.div animate={shouldAnimate ? { scaleX: [0, 1] } : { scaleX: 1 }} transition={{ duration: 0.8 }} style={{ transformOrigin: "left", height: 6, marginTop: 12, borderRadius: 999, background: props.accentColor }} /></article>)}</section>
    }
    return <section style={{ ...sharedShellStyle, padding: 18 }}><h3 style={{ ...headingStyle, marginTop: 0 }}>Community Leaderboard</h3>{leaderboard.map((person, idx) => <motion.div key={person.name} whileHover={shouldAnimate ? { y: -3 } : undefined} style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", alignItems: "center", gap: 10, borderRadius: 12, padding: 10, marginBottom: 10, background: "rgba(255,255,255,0.7)", boxShadow: "6px 6px 14px rgba(15,23,42,0.1), -6px -6px 14px rgba(255, 255, 255, 0.96)" }}><div style={{ ...textBaseStyle, fontWeight: 700 }}>#{idx + 1}</div><div><div style={{ ...textBaseStyle, fontWeight: 650 }}>{person.name}</div><div style={{ ...textBaseStyle, opacity: 0.65 }}>{person.city}</div></div><div style={{ ...textBaseStyle, color: props.accentColor, fontWeight: 700 }}>{person.points} pts</div></motion.div>)}</section>
}

interface AppScaffoldProps {
    currentView: AppView
    props: MyComponentProps
    interactive: boolean
}

function AppScaffold({ currentView, props, interactive }: AppScaffoldProps) {
    const width = useViewportWidth()
    const isMobile = width < 900
    const { sharedShellStyle, textBaseStyle, headingStyle } = useSharedStyles(props)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inView = useInView(containerRef, { amount: 0.2, once: false })
    const isStatic = useIsStaticRenderer()
    const shouldAnimate = !isStatic && inView
    const [view, setView] = React.useState<AppView>(currentView)
    React.useEffect(() => {
        React.startTransition(() => setView(currentView))
    }, [currentView])
    const onTabClick = React.useCallback((tab: AppView) => {
        if (interactive) React.startTransition(() => setView(tab))
    }, [interactive])
    const activeView = interactive ? view : currentView
    const body = activeView === "Landing" ? renderLandingPage(props, isMobile, shouldAnimate, headingStyle, textBaseStyle) : renderAppPage(activeView, isMobile, shouldAnimate, props, sharedShellStyle, textBaseStyle, headingStyle)
    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", minHeight: 1200, borderRadius: 28, background: "linear-gradient(155deg, #f7f8fb 0%, #eef1f7 100%)", padding: isMobile ? 14 : 22, boxSizing: "border-box", overflow: "hidden" }}>
            {activeView === "Landing" && !interactive ? body : <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, height: "100%" }}>{props.showSidebar && activeView !== "Landing" && <aside style={{ ...sharedShellStyle, width: isMobile ? "100%" : 240, padding: 14, flexShrink: 0 }}><div style={{ ...headingStyle, marginBottom: 12 }}>StreetVoice</div><nav aria-label="StreetVoice sections" style={{ display: "grid", gap: 8 }}>{tabs.map((tab) => <button key={tab} type="button" aria-label={`Open ${tab}`} onClick={() => onTabClick(tab)} style={{ border: "none", borderRadius: 12, padding: "10px 12px", cursor: interactive ? "pointer" : "default", textAlign: "left", color: activeView === tab ? "#FFFFFF" : props.textColor, background: activeView === tab ? props.accentColor : "rgba(255,255,255,0.52)", boxShadow: activeView === tab ? "0 8px 22px rgba(0,0,0,0.2)" : "inset 3px 3px 8px rgba(15,23,42,0.08), inset -3px -3px 8px rgba(255,255,255,0.96)" }}>{tab}</button>)}</nav></aside>}<main style={{ flex: 1, minWidth: 0, display: "grid", gap: 14 }}>{!props.showSidebar && interactive && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{tabs.map((tab) => <button key={tab} type="button" aria-label={`Open ${tab}`} onClick={() => onTabClick(tab)} style={{ border: "none", borderRadius: 999, padding: "10px 14px", cursor: "pointer", color: activeView === tab ? "#FFFFFF" : props.textColor, background: activeView === tab ? props.accentColor : "rgba(255,255,255,0.6)" }}>{tab}</button>)}</div>}<AnimatePresence mode="wait"><motion.div key={activeView} initial={shouldAnimate ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} exit={shouldAnimate ? { opacity: 0, y: -12 } : undefined} transition={{ duration: 0.35, ease: "easeOut" }}>{body}</motion.div></AnimatePresence>{activeView !== "Landing" && <section style={{ ...sharedShellStyle, padding: 16 }}><h3 style={{ ...headingStyle, marginTop: 0, marginBottom: 8, whiteSpace: "normal" }}>Your city has problems. Reporting them shouldn’t be one of them.</h3><p style={{ ...textBaseStyle, margin: 0 }}>Report potholes, broken streetlights, water leakages and more — in seconds. AI verifies it. Your community backs it. Authorities fix it. All in one place.</p></section>}</main></div>}
        </div>
    )
}

const commonProps = {
    backgroundImage: defaultBg,
    accentColor: "#000000",
    secondaryAccent: "#CCCCCC",
    surfaceColor: "#FFFFFF",
    textColor: "#000000",
    landingTitle: "Your Street Has a Voice. Now It’s Time to Use It.",
    landingSubtitle: "Report potholes, broken streetlights, water leakages and more — in seconds. AI verifies it. Your community backs it. Authorities fix it. All in one place.",
    primaryCta: "Start Reporting — It’s Free",
    secondaryCta: "See Issues Near Me",
    defaultView: "Landing" as AppView,
    showSidebar: true,
    fontFamily: "Satoshi, Clash Display, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
    headingFont: { fontSize: "32px", variant: "Semibold", letterSpacing: "-0.03em", lineHeight: "1em" },
    bodyFont: { fontSize: "15px", variant: "Medium", letterSpacing: "-0.01em", lineHeight: "1.3em" },
}

const controls: any = {
    backgroundImage: { type: ControlType.String, title: "Background", defaultValue: defaultBg },
    accentColor: { type: ControlType.Color, title: "Accent", defaultValue: "#000000" },
    secondaryAccent: { type: ControlType.Color, title: "Accent 2", defaultValue: "#CCCCCC" },
    surfaceColor: { type: ControlType.Color, title: "Surface", defaultValue: "#FFFFFF" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "#000000" },
    landingTitle: { type: ControlType.String, title: "Landing Title", defaultValue: commonProps.landingTitle },
    landingSubtitle: { type: ControlType.String, title: "Landing Subtitle", defaultValue: commonProps.landingSubtitle, displayTextArea: true },
    primaryCta: { type: ControlType.String, title: "Primary CTA", defaultValue: commonProps.primaryCta },
    secondaryCta: { type: ControlType.String, title: "Secondary CTA", defaultValue: commonProps.secondaryCta },
    defaultView: { type: ControlType.Enum, title: "Default View", options: tabs, defaultValue: "Landing" },
    showSidebar: { type: ControlType.Boolean, title: "Sidebar", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
    fontFamily: { type: ControlType.String, title: "Font Stack", defaultValue: commonProps.fontFamily },
    headingFont: { type: ControlType.Font, title: "Heading Font", defaultValue: commonProps.headingFont, controls: "extended", defaultFontType: "sans-serif" },
    bodyFont: { type: ControlType.Font, title: "Body Font", defaultValue: commonProps.bodyFont, controls: "extended", defaultFontType: "sans-serif" },
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function StreetVoiceRedesign(props: MyComponentProps) {
    return <AppScaffold currentView={props.defaultView || "Landing"} props={{ ...commonProps, ...props }} interactive={true} />
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function StreetVoiceLandingPage(props: MyComponentProps) {
    return <AppScaffold currentView="Landing" props={{ ...commonProps, ...props, showSidebar: false }} interactive={false} />
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function StreetVoiceHomePage(props: MyComponentProps) {
    return <AppScaffold currentView="Home" props={{ ...commonProps, ...props }} interactive={false} />
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function StreetVoiceReportIssuePage(props: MyComponentProps) {
    return <AppScaffold currentView="Report Issue" props={{ ...commonProps, ...props }} interactive={false} />
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function StreetVoiceMyReportsPage(props: MyComponentProps) {
    return <AppScaffold currentView="My Reports" props={{ ...commonProps, ...props }} interactive={false} />
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function StreetVoiceDashboardPage(props: MyComponentProps) {
    return <AppScaffold currentView="Dashboard" props={{ ...commonProps, ...props }} interactive={false} />
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export function StreetVoiceCommunityPage(props: MyComponentProps) {
    return <AppScaffold currentView="Community" props={{ ...commonProps, ...props }} interactive={false} />
}

addPropertyControls(StreetVoiceRedesign, controls)
addPropertyControls(StreetVoiceLandingPage, controls)
addPropertyControls(StreetVoiceHomePage, controls)
addPropertyControls(StreetVoiceReportIssuePage, controls)
addPropertyControls(StreetVoiceMyReportsPage, controls)
addPropertyControls(StreetVoiceDashboardPage, controls)
addPropertyControls(StreetVoiceCommunityPage, controls)
