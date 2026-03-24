// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';
import AuthForm from './components/AuthForm';

function App() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(null); // NEW: Tracks the logged-in user!
  const today = new Date().toISOString().split('T')[0];

  // NEW: Check if we are already logged in when the page loads
  useEffect(() => {
    const savedUser = localStorage.getItem('habitUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // UPDATE: Fetch habits using the REAL userId instead of the fake one
  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in

    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/habits/${user.userId}`);
        setHabits(response.data); 
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };
    fetchHabits(); 
  }, [user]); // Re-run this if the 'user' changes

  const handleToggle = async (habitId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/habits/${habitId}/toggle`, { date: today });
      setHabits(habits.map((habit) => habit._id === habitId ? response.data : habit));
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const handleAddHabit = async (newHabitData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/habits', {
        ...newHabitData,
        userId: user.userId, // UPDATE: Use the real user's ID
      });
      setHabits([...habits, response.data]);
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await axios.delete(`http://localhost:5000/api/habits/${habitId}`);
        setHabits(habits.filter((habit) => habit._id !== habitId));
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    }
  };

  // NEW: Handle a successful login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('habitUser', JSON.stringify(userData)); // Save to browser memory
  };

  // NEW: Handle logout
  const handleLogout = () => {
    setUser(null);
    setHabits([]); // Clear habits from screen
    localStorage.removeItem('habitUser'); // Delete from browser memory
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      
      {/* HEADER - Only show logout button if user is logged in */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">My Habit Tracker</h1>
          <p className="text-gray-500 font-medium">Today is: {today}</p>
        </div>
        
        {user && (
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors">
            Log Out
          </button>
        )}
      </div>
      
      {/* THE BIG SWITCH: Show AuthForm if not logged in, otherwise show Dashboard */}
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <>
          <HabitForm onAddHabit={handleAddHabit} />

          {habits.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
              Welcome, {user.email}! No habits yet. Create one above.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {habits.map((habit) => (
                <HabitCard 
                  key={habit._id} 
                  habit={habit} 
                  today={today}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;