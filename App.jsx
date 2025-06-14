import Calendar from './components/Calendar';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Calendar App</h1>
      <Calendar />
    </div>
  );
}

export default App;