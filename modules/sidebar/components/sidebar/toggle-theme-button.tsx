import { IconMoon, IconSun } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useSidebar } from "../../context/sidebar-context"

export const ToggleThemeButton = () => {
const { theme, setTheme } = useTheme()
const toggleTheme = () => {
    setTheme(theme === "dark" ? "system" : "dark")
}
const {isOpen} = useSidebar();
  const isDark = theme === "dark"
    return (
        <button
      onClick={toggleTheme}
      className={`relative ${isOpen ? "w-13" : "w-6"} h-6 rounded-full transition-all duration-200 hover:shadow-lg cursor-pointer ${isDark ? "bg-white" : "bg-neutral-900"}`}
      aria-label={`Switch to ${isDark ? "system" : "dark"} mode`}
    >
      {/* Toggle track */}
      <div className={`absolute inset-0 rounded-full ${isDark ? "bg-white" : "bg-neutral-600"}`} />

      {/* Sliding circle */}
      <motion.div
        className={`relative z-10 ${isOpen ? "w-5 h-5" : "w-5 h-5"}   rounded-full shadow-lg flex items-center justify-center ${isDark ? isOpen ? "bg-neutral-600" : "bg-white": isOpen ? "bg-white" : "bg-neutral-600"}`}
        animate={{
          x: isDark ? isOpen ? 28 : 2 : isOpen ? 4: 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Icon container with rotation animation */}
        <motion.div
          animate={{
            rotate: isDark ? 90 : 0,
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center "
        >
          {isDark ?  <IconSun className={`w-3 h-3 ${isOpen ? "text-white" : "text-neutral-700"}`} /> : <IconMoon className={`w-3 h-3 ${isOpen ? "text-neutral-700" : "text-white"}`} />}
        </motion.div>
      </motion.div>
    </button>
    )
}