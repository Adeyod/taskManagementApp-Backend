import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // startDate: {
  //   type: Date,
  //   required: true,
  // validate: {
  //   validator: (value) => value instanceof Date && !isNaN(value),
  //   message: 'Invalid date format for startDate',
  // },
  // },
  startTime: {
    type: Date,
    required: true,
    // validate: {
    //   validator: (value) => value instanceof Date && !isNaN(value),
    //   message: 'Invalid date format for startTime',
    // },
  },
  // dueDate: {
  //   type: Date,
  //   required: true,
  // validate: {
  //   validator: (value) => value instanceof Date && !isNaN(value),
  //   message: 'Invalid date format for startDate',
  // },
  // },
  dueTime: {
    type: Date,
    required: true,
    // validate: {
    //   validator: (value) => value instanceof Date && !isNaN(value),
    //   message: 'Invalid date format for startTime',
    // },
  },
  user: { type: Schema.Types.ObjectId, required: true },
});

// Custom validator for validating time format using moment
const validateTime = (time) => moment(time, ['h:mmA', 'HH:mm'], true).isValid();

taskSchema.path('startTime').validate({
  validator: validateTime,
  message: 'Invalid time format for startTime',
});

taskSchema.path('dueTime').validate({
  validator: validateTime,
  message: 'Invalid time format for dueTime',
});

// // Custom validator for validating date format using moment
// const validateDate = (date) => moment(date, 'YYYY-MM-DD', true).isValid();

// taskSchema.path('startDate').validate({
//   validator: validateDate,
//   message: 'Invalid date format for startDate',
// });

// taskSchema.path('dueDate').validate({
//   validator: validateDate,
//   message: 'Invalid date format for dueDate',
// });

const Task = mongoose.model('Task', taskSchema);
export default Task;
