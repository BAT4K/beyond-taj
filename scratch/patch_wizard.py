path = "/home/bat4k/beyond-taj/components/TravelWizard.tsx"

with open(path, "r") as f:
    content = f.read()

# 1. Add imports and state
content = content.replace(
    'import { useRouter } from "next/navigation";',
    'import { useRouter } from "next/navigation";\nimport { validateItinerary as performValidation } from "@/utils/travelValidator";'
)

content = content.replace(
    'const [selectedDays, setSelectedDays] = useState(14);',
    'const [selectedDays, setSelectedDays] = useState(14);\n  const [travelMonth, setTravelMonth] = useState("");'
)

content = content.replace(
    'const [isValidating, setIsValidating] = useState(false);',
    'const [isValidating, setIsValidating] = useState(false);\n  const [showValidationModal, setShowValidationModal] = useState(false);\n  const [validationMessages, setValidationMessages] = useState<string[]>([]);'
)

# 2. Update step limits
content = content.replace('if (step === 4) {\n      validateItinerary();', 'if (step === 5) {\n      validateItinerary();')
content = content.replace('setStep((s) => Math.min(s + 1, 4));', 'setStep((s) => Math.min(s + 1, 5));')
content = content.replace('animate={{ width: `${(step / 4) * 100}%` }}', 'animate={{ width: `${(step / 5) * 100}%` }}')

content = content.replace(
"""  const nextStep = () => {
    if (step === 4) {
      saveJourneyAndCheckout();
    } else {
      setDirection(1);
      setStep((s) => Math.min(s + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };""",
"""  const nextStep = () => {
    if (step === 5) {
      if (selectedDestinations.length === 0) return;
      const msgs = performValidation({
        destinations: selectedDestinations,
        durationDays: selectedDays,
        travelMonth,
      });
      if (msgs.length > 0) {
        setValidationMessages(msgs);
        setShowValidationModal(true);
        return;
      }
      saveJourneyAndCheckout();
    } else {
      if (step === 2 && !travelMonth) {
        return;
      }
      setDirection(1);
      setStep((s) => Math.min(s + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };"""
)

# 3. Update step numbers in JSX
content = content.replace('step === 2 &&', 'step === 3 &&')
content = content.replace('step === 3 &&', 'step === 4 &&', 1) # only the first one which is the landscape step
content = content.replace('step === 4 &&', 'step === 5 &&')

# Wait, `step === 2 &&` got replaced by `step === 3 &&`
# The original file had:
# {step === 2 && ( ... Aesthetic
# {step === 3 && ( ... Landscape
# {step === 4 && ( ... Destinations

# So we need to carefully replace them
import re

content = re.sub(r'\{step === 4 && \(\(\) => \{', '{step === 5 && (() => {', content)
content = re.sub(r'\{step === 3 && \(', '{step === 4 && (', content)
content = re.sub(r'\{step === 2 && \(', '{step === 3 && (', content)

# Now inject the new step 2 right after step 1's closing div
step2_ui = """
            {step === 2 && (
              <div className="text-center space-y-12">
                <h2 className="font-serif text-4xl md:text-5xl font-light text-white/90 drop-shadow-md mb-8">When are you planning to travel?</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                    <motion.button
                      key={month}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      onClick={() => setTravelMonth(month)}
                      style={{
                        borderColor: travelMonth === month ? theme.gold : theme.border,
                        backgroundColor: travelMonth === month ? theme.gold + '1A' : theme.darker,
                        color: travelMonth === month ? theme.gold : theme.cream
                      }}
                      className="p-4 border rounded-sm font-sans tracking-wide transition-all hover:border-white/20 uppercase text-xs md:text-sm cursor-pointer"
                    >
                      {month}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
"""

content = content.replace('            {step === 3 && (', step2_ui + '            {step === 3 && (')

# 4. Update footer logic
footer_old = """      <footer className="p-6 md:p-10 flex justify-end relative z-40">
        <button
          onClick={() => {
            if (step === 4 && selectedDestinations.length === 0) return;
            nextStep();
          }}
          style={{
            borderColor: step === 4 && hasGeoConflict ? 'rgba(245, 158, 11, 0.5)' : theme.gold,
            opacity: step === 4 && selectedDestinations.length === 0 ? 0.5 : 1,
            cursor: step === 4 && selectedDestinations.length === 0 ? 'not-allowed' : 'pointer'
          }}
          className={`group relative px-10 py-4 border overflow-hidden rounded-sm transition-all duration-300 ${step === 4 && hasGeoConflict ? 'text-amber-500 hover:bg-amber-500/10' :
              step === 4 && selectedDestinations.length === 0 ? 'text-white/50' :
                'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'
            }`}
        >
          <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-medium">
            {step === 4 ? "Review Journey" : "Next"} <ChevronRight size={16} />
          </span>
        </button>
      </footer>"""

footer_new = """      <footer className="p-6 md:p-10 flex justify-end relative z-40">
        <button
          onClick={() => {
            if (step === 5 && selectedDestinations.length === 0) return;
            nextStep();
          }}
          style={{
            borderColor: step === 5 && hasGeoConflict ? 'rgba(245, 158, 11, 0.5)' : theme.gold,
            opacity: (step === 5 && selectedDestinations.length === 0) || (step === 2 && !travelMonth) ? 0.5 : 1,
            cursor: (step === 5 && selectedDestinations.length === 0) || (step === 2 && !travelMonth) ? 'not-allowed' : 'pointer'
          }}
          className={`group relative px-10 py-4 border overflow-hidden rounded-sm transition-all duration-300 ${step === 5 && hasGeoConflict ? 'text-amber-500 hover:bg-amber-500/10' :
              (step === 5 && selectedDestinations.length === 0) || (step === 2 && !travelMonth) ? 'text-white/50' :
                'hover:bg-[#c9a96e] text-[#c9a96e] hover:text-[#0a0806]'
            }`}
        >
          <span className="relative font-sans tracking-widest text-sm uppercase flex items-center gap-3 font-medium">
            {step === 5 ? "Review Journey" : "Next"} <ChevronRight size={16} />
          </span>
        </button>
      </footer>"""

content = content.replace(footer_old, footer_new)

# 5. Inject validation modal
modal_ui = """      <AnimatePresence>
        {showValidationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-sm p-8 shadow-2xl flex flex-col gap-6"
            >
              <h3 className="font-serif text-3xl text-white/90">Local Insights & Route Adjustments</h3>
              <div className="w-16 h-px bg-white/20 mb-2" />
              <div className="flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {validationMessages.map((msg, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <AlertTriangle size={18} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed text-zinc-300">{msg}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="flex-1 py-3 px-4 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs text-white/80 rounded-sm cursor-pointer"
                >
                  Adjust My Plan
                </button>
                <button
                  onClick={() => {
                    setShowValidationModal(false);
                    saveJourneyAndCheckout();
                  }}
                  className="flex-1 py-3 px-4 border border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-black transition-colors uppercase tracking-widest text-xs font-medium rounded-sm cursor-pointer"
                >
                  Proceed Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

"""

content = content.replace('<style dangerouslySetInnerHTML=', modal_ui + '      <style dangerouslySetInnerHTML=')

with open(path, "w") as f:
    f.write(content)
