import express from 'express';
import { addTeam, removeTeam, updateTeamName } from '../controller/teamController.mjs';

const router = express.Router();

// Add a new team (admin-only)
router.post('/add', addTeam);

// Remove a team (admin-only)
router.post('/remove', removeTeam);

// Update team info (admin-only)
router.post('/update', updateTeamName);

export default router;