import express from 'express';
import { GitHubService } from '../services/githubService';

const router = express.Router();
const githubService = new GitHubService();

// Get user info
router.get('/user', async (req, res) => {
  try {
    const userInfo = await githubService.getUserInfo();
    res.json(userInfo);
  } catch (error) {
    console.error('Failed to get GitHub user info:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Get repositories
router.get('/repositories', async (req, res) => {
  try {
    const repos = await githubService.getRepositories();
    res.json(repos);
  } catch (error) {
    console.error('Failed to get repositories:', error);
    res.status(500).json({ error: 'Failed to get repositories' });
  }
});

// Create repository
router.post('/repositories', async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const repo = await githubService.createRepository(name, description, isPrivate);
    res.json(repo);
  } catch (error) {
    console.error('Failed to create repository:', error);
    res.status(500).json({ error: 'Failed to create repository' });
  }
});

// Sync project to repository
router.post('/sync', async (req, res) => {
  try {
    const { owner, repo } = req.body;
    
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required' });
    }

    const result = await githubService.syncToRepository(owner, repo);
    res.json(result);
  } catch (error) {
    console.error('Failed to sync to GitHub:', error);
    res.status(500).json({ 
      error: 'Failed to sync to GitHub',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;