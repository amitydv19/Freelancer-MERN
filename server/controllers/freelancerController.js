import mongoose from 'mongoose';
import { Freelancer } from "../models/Schema.js";

export const fetchFreelancer = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);

    let freelancer = await Freelancer.findOne({ userId });

    // Auto-create blank profile if none exists yet
    if (!freelancer) {
      freelancer = await Freelancer.create({
        userId,
        skills: [],
        description: '',
        funds: 0,
        currentProjects: [],
        completedProjects: [],
      });
    }

    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFreelancer = async (req, res) => {
  try {
    const {
      freelancerId,
      updateSkills,
      description,
      qualification,
      experience,
      hourlyRate,
      location,
      github,
      linkedin,
      portfolio,
      languages,
      availability,
      photo,
    } = req.body;

    const userId = new mongoose.Types.ObjectId(freelancerId);
    let freelancer = await Freelancer.findOne({ userId });

    if (!freelancer) {
      freelancer = await Freelancer.create({ userId, skills: [], funds: 0 });
    }

    if (updateSkills  !== undefined) freelancer.skills        = updateSkills;
    if (description   !== undefined) freelancer.description   = description;
    if (qualification !== undefined) freelancer.qualification = qualification;
    if (experience    !== undefined) freelancer.experience    = experience;
    if (hourlyRate    !== undefined) freelancer.hourlyRate    = hourlyRate;
    if (location      !== undefined) freelancer.location      = location;
    if (github        !== undefined) freelancer.github        = github;
    if (linkedin      !== undefined) freelancer.linkedin      = linkedin;
    if (portfolio     !== undefined) freelancer.portfolio     = portfolio;
    if (languages     !== undefined) freelancer.languages     = languages;
    if (availability  !== undefined) freelancer.availability  = availability;
    if (photo         !== undefined) freelancer.photo         = photo;

    await freelancer.save();
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};