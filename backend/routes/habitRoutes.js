// backend/routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit'); 

// POST route to create a new habit
router.post('/', async (req, res) => {
  try {
    console.log("This is what Express received:",req.body);
    // 1. Grab the data sent from React (this lives inside req.body)
    const { name, description, colorCode, frequency, userId } = req.body;

    // 2. Build the new habit using our model
    const newHabit = new Habit({
       name: name,
       description: description,
       colorCode: colorCode,
       frequency: frequency,
       userId: userId,
       completedDates: []
    });

    // 3. Save it to MongoDB
    const savedHabit = await newHabit.save();
    
    // 4. Send the saved habit back to React so it can update the screen
    res.status(201).json(savedHabit); 

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch all habits for a specific user
router.get('/:userId', async (req, res) => {
  try {
    // 1. Grab the userId from the URL string
    const { userId } = req.params;

    // 2. Ask MongoDB to find all habits where the userId matches
    const habits = await Habit.find({ userId: userId });

    // 3. Send that list back to the frontend
    res.status(200).json(habits);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT route to toggle a specific date for a habit
router.put('/:id/toggle', async (req, res) => {
  try {
    // 1. Grab the habit ID from the URL
    const { id } = req.params;
    // 2. Grab the specific date React sends us
    const { date } = req.body; 

    // 3. Find the exact habit in the database
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // 4. Check if the date is already in the array
    const dateIndex = habit.completedDates.indexOf(date);

    if (dateIndex === -1) {
      // If it's NOT in the array, add it (Check it off)
      habit.completedDates.push(date);
    } else {
      // If it IS in the array, remove it (Uncheck it)
      habit.completedDates.splice(dateIndex, 1);
    }

    // 5. Save the updated habit and send it back
    const updatedHabit = await habit.save();
    res.status(200).json(updatedHabit);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to permanently remove a habit
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Grab the specific habit ID from the URL

    // Ask MongoDB to find it and destroy it
    await Habit.findByIdAndDelete(id);

    // Send a success message back to React
    res.status(200).json({ message: 'Habit deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;