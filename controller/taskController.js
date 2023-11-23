import mongoose from 'mongoose';
import Task from '../model/taskModel.js';
import moment from 'moment';
import cron from 'node-cron';
import { notificationEmail } from '../utils/nodemailer.js';
import User from '../model/userModel.js';

// logic to create task by an authorized user
const createTask = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }

    const { title, description, startDate, dueDate, startTime, dueTime } =
      req.body;
    if (!title || !description || !startTime || !dueTime) {
      return res.json({
        message: 'All fields are required',
        status: 401,
        success: false,
      });
    }

    // Use moment to parse and validate date and time
    const parsedStartTime = moment(
      startTime,
      ['YYYY-MM-DD, h:mmA', 'YYYY-MM-DD, HH:mm'],
      true
    );
    const parsedDueTime = moment(
      dueTime,
      ['YYYY-MM-DD, h:mmA', 'YYYY-MM-DD, HH:mm'],
      true
    );

    if (!parsedStartTime.isValid() || !parsedDueTime.isValid()) {
      return res
        .status(400)
        .json({ message: 'Invalid date or time format', success: false });
    }

    const newTask = await new Task({
      title,
      description,
      startTime: parsedStartTime.toDate(),
      dueTime: parsedDueTime.toDate(),
      user: id,
    }).save();

    return res.json({
      message: `Task with ${newTask._id} has been created successfully`,
      newTask,
      success: true,
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

// logic to update a task of authorized user
const updateTask = async (req, res) => {
  try {
    const { id } = req.user;
    const taskId = req.params.id;

    if (!id) {
      return res.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.json({
        message: 'Invalid task ID format',
        status: 400,
        success: false,
      });
    }

    const task = await Task.findOne({ _id: taskId, user: id });
    if (!task) {
      return res.json({
        message: `Task with ${taskId} can not be found`,
        status: 401,
        success: false,
      });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.startTime = req.body.startTime || task.startTime;
    task.dueTime = req.body.dueTime || task.dueTime;
    await task.save();

    return res.json({
      message: `Task with ${task._id} has been updated successfully`,
      success: true,
      task,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

// logic to get a single task of authorized user
const getUserTask = async (req, res) => {
  try {
    const { id } = req.user;
    const taskId = req.params.id;

    if (!id) {
      return res.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.json({
        message: 'Invalid task ID format',
        success: false,
        status: 400,
      });
    }

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.json({
        message: `Task with ${taskId} can not be found`,
        status: 401,
        success: false,
      });
    }

    return res.json({
      message: `Task with ${task._id} fetched successfully`,
      status: 200,
      success: true,
      task,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

// logic to get all the tasks of authorized user
const getUserTasks = async (req, res) => {
  try {
    const { id } = req.user;

    if (!id) {
      return res.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }

    const tasks = await Task.find({ user: id }).exec();
    if (tasks.length <= 0) {
      return res.json({
        message: `There are no tasks for this user with ID `,
      });
    }

    return res.json({
      message: `Tasks for user ${id} fetched successfully`,
      success: true,
      tasks,
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};

// logic to send reminder to user when startTime remains 15mins
cron.schedule(' * * * * *', async () => {
  try {
    const currentTime = new Date();
    const Tasks = await Task.find();
    Tasks.forEach(async (task) => {
      const startTime = new Date(task.startTime);
      const timeDiff = Math.floor((startTime - currentTime) / (1000 * 60));
      if (timeDiff === 15) {
        const taskDetails = await task.populate('user');
        const title = taskDetails.title.toUpperCase();

        const user = await User.findById({ _id: taskDetails.user });
        console.log('user:', user);
        if (!user) {
          console.log('No user found');
          return;
        }
        await notificationEmail(user.email, title);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// logic to delete authorized user's task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.user;
    const taskId = req.params.id;

    if (!id) {
      return res.json({
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.json({
        message: 'Invalid ID format',
        status: 400,
        success: false,
      });
    }

    const task = await Task.findByIdAndDelete({ _id: taskId });
    if (!task) {
      return res.json({
        message: `Task with ID ${taskId} can not be found`,
        status: 404,
        success: false,
      });
    }

    return res.json({
      message: `Task with ID ${task._id} has been deleted successfully`,
      success: true,
      task,
      status: 200,
    });
  } catch (error) {
    return console.log(error);
  }
};

export { createTask, deleteTask, updateTask, getUserTask, getUserTasks };
