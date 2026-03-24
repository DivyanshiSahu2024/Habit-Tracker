// frontend/src/components/HabitCard.jsx

export default function HabitCard({ habit, today, onToggle, onDelete }) {
  const isCompletedToday = habit.completedDates.includes(today);

  return (
    <div 
      className={`p-5 rounded-2xl shadow-sm border-l-[8px] flex justify-between items-center transition-all hover:shadow-md ${isCompletedToday ? 'bg-green-50' : 'bg-white border border-gray-100'}`}
      style={{ borderLeftColor: habit.colorCode }}
    >
      <div className="pr-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{habit.name}</h2>
        <p className="text-sm text-gray-500 mb-2">{habit.description}</p>
        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
          {habit.frequency}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => onToggle(habit._id)} 
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${isCompletedToday ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          {isCompletedToday ? '✅ Done' : '⬜ Mark'}
        </button>
        
        <button 
          onClick={() => onDelete(habit._id)} 
          title="Delete Habit"
          className="p-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}