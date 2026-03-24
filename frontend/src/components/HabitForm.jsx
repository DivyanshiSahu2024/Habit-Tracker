// frontend/src/components/HabitForm.jsx
import { useState } from 'react';

export default function HabitForm({ onAddHabit }) {
  // The form keeps track of its own typing state!
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [colorCode, setColorCode] = useState('#3b82f6'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Pass the typed data back UP to App.jsx
    onAddHabit({ name, description, frequency, colorCode });
    
    // Clear the form
    setName('');
    setDescription('');
    setFrequency('Daily');
    setColorCode('#3b82f6');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-100 mb-10">
      <h3 className="text-xl font-bold text-gray-700 mb-2">Create a New Habit</h3>
      
      <input type="text" placeholder="Habit Name (e.g., Drink Water)" value={name} onChange={(e) => setName(e.target.value)} required 
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
      
      <input type="text" placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} 
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
      
      <div className="flex gap-4">
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)} 
          className="p-3 border border-gray-300 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm font-medium">Color:</label>
          <input type="color" value={colorCode} onChange={(e) => setColorCode(e.target.value)} 
            className="h-12 w-16 p-1 border border-gray-300 rounded-xl cursor-pointer bg-white"/>
        </div>
      </div>

      <button type="submit" 
        className="mt-2 p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm">
        Add Habit
      </button>
    </form>
  );
}