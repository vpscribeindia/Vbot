import './App.css'
import Dashboard from './pages/Dashboard';
function App() {
  const handleUpload = (files) => {
    console.log('Files to upload:', files);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <Dashboard onUpload={handleUpload} />
    </div>
  );
}

export default App
