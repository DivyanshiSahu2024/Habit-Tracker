// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const fakeUserId = "507f1f77bcf86cd799439011";
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [colorCode, setColorCode] = useState('#3b82f6'); 

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/habits/${fakeUserId}`);
        setHabits(response.data); 
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };
    fetchHabits(); 
  }, []);

  const handleToggle = async (habitId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/habits/${habitId}/toggle`, {
        date: today
      });
      const updatedHabit = response.data;
      setHabits(habits.map((habit) => 
        habit._id === habitId ? updatedHabit : habit
      ));
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post('http://localhost:5000/api/habits', {
        userId: fakeUserId,
        name: name,
        description: description,
        frequency: frequency,
        colorCode: colorCode
      });
      setHabits([...habits, response.data]);
      setName('');
      setDescription('');
      setFrequency('Daily');
      setColorCode('#3b82f6');
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  // NEW DELETE: The function to delete a habit
  const handleDelete = async (habitId) => {
    // Add a quick confirmation pop-up so you don't delete by accident!
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        // 1. Tell the backend to delete it from the database
        await axios.delete(`http://localhost:5000/api/habits/${habitId}`);
        
        // 2. Remove it from React's memory so it disappears from the screen
        setHabits(habits.filter((habit) => habit._id !== habitId));
      } catch (error) {
        console.error("Error deleting habit:", error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>My Habit Tracker</h1>
      <p style={{ color: 'gray', textAlign: 'center' }}>Today is: {today}</p>
      
      <form onSubmit={handleAddHabit} style={{
        display: 'flex', flexDirection: 'column', gap: '10px', 
        padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '20px'
      }}>
        <h3>Create a New Habit</h3>
        <input type="text" placeholder="Habit Name (e.g., Drink Water)" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '8px' }}/>
        <input type="text" placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ padding: '8px' }}/>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={{ padding: '8px', flex: 1 }}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <input type="color" value={colorCode} onChange={(e) => setColorCode(e.target.value)} style={{ height: '35px', width: '50px', cursor: 'pointer' }}/>
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Habit
        </button>
      </form>

      {habits.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No habits yet. Create one above!</p>
      ) : (
        <div>
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(today);
            return (
              <div key={habit._id} style={{ borderLeft: `6px solid ${habit.colorCode}`, padding: '15px', margin: '10px 0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isCompletedToday ? '#f0fdf4' : 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div>
                  <h2 style={{ margin: '0 0 5px 0' }}>{habit.name}</h2>
                  <p style={{ margin: '0', fontSize: '14px', color: '#4b5563' }}>{habit.description}</p>
                </div>
                
                {/* NEW DELETE: Added a container for the buttons so they sit next to each other */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleToggle(habit._id)} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: isCompletedToday ? '#22c55e' : '#f3f4f6', color: isCompletedToday ? 'white' : 'black', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                    {isCompletedToday ? '✅ Done' : '⬜ Mark Done'}
                  </button>
                  
                  {/* NEW DELETE: The Trash Can Button */}
                  <button onClick={() => handleDelete(habit._id)} style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }} title="Delete Habit">
                    🗑️
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;