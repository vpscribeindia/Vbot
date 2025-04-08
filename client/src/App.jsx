import Dashboard from "./pages/Dashboard";
import { motion } from "framer-motion";
import './App.css'
 
function App() {
  return (
    <motion.div className="container mx-auto px-6 py-8 h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Dashboard />
      </motion.div>
  );
}

export default App;
