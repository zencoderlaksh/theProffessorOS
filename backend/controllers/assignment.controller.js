import { syncToVectorDB } from '../utils/vectorSync.js';
import Assignment from '../models/Assignment.model.js';

export const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;
    const query = courseId ? { courseId } : {};
    const assignments = await Assignment.find(query).populate('courseId').sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const newItem = new Assignment(req.body);
    await newItem.save();
    syncToVectorDB(newItem, 'ASSIGNMENT');
    const populatedItem = await Assignment.findById(newItem._id).populate('courseId');
    res.status(201).json({ message: 'Assignment saved successfully', item: populatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
