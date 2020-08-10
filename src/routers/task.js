const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

// endpoint for creating new tasks
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, // copy over all the properties of object
        owner: req.user._id
    })
    
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// get all my tasks
// filtering: GET /tasks?completed=false
// pagination: limit, skip (GET /tasks?limit=10&skip=0)
// sorting: GET /tasks?sortBy=createdAt:asc // asc: ascending
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

// read a specific task
router.get('/tasks/:id', auth, async (req, res) => {
    _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        // await req.user.populate('tasks').execPopulate()
        // res.send(req.user.tasks)

        if (!task) {
            return res.status(404).send()
        }

        return res.send(task)
    } catch (e) {
        res.send(500).send()
    }
})

// update a task
router.patch('/tasks/:id', auth, async (req, res) => {
    allowedUpdates = ["description", "completed"]
    updates = Object.keys(req.body)
    isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send("Invalid Updates")
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send("No task found...")
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch(e) {
        res.status(400).send(e)
    }
})

// deleting a task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router