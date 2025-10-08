import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

/**
 * 🗺️ BLUEPRINT API
 * Get real-time website blueprint
 * Shows exactly what's in your website!
 */

// Get current blueprint
router.get('/current', (req, res) => {
  try {
    const blueprintPath = path.resolve(process.cwd(), 'WEBSITE_BLUEPRINT.json');
    
    if (fs.existsSync(blueprintPath)) {
      const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
      res.json({
        success: true,
        blueprint,
        message: 'Blueprint loaded successfully'
      });
    } else {
      res.json({
        success: false,
        message: 'Blueprint not generated yet. Run: npm run blueprint',
        instructions: 'Generate blueprint with: npm run blueprint'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load blueprint'
    });
  }
});

// Get human-readable blueprint
router.get('/readable', (req, res) => {
  try {
    const blueprintPath = path.resolve(process.cwd(), 'WEBSITE_BLUEPRINT.md');
    
    if (fs.existsSync(blueprintPath)) {
      const content = fs.readFileSync(blueprintPath, 'utf8');
      res.type('text/markdown').send(content);
    } else {
      res.status(404).send('Blueprint not generated. Run: npm run blueprint');
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load blueprint'
    });
  }
});

// Regenerate blueprint
router.post('/regenerate', async (req, res) => {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execPromise = promisify(exec);

    await execPromise('node scripts/generate-blueprint.js');

    res.json({
      success: true,
      message: 'Blueprint regenerated successfully',
      instructions: 'Check WEBSITE_BLUEPRINT.json and WEBSITE_BLUEPRINT.md'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate blueprint',
      details: error.message
    });
  }
});

// Get blueprint summary
router.get('/summary', (req, res) => {
  try {
    const blueprintPath = path.resolve(process.cwd(), 'WEBSITE_BLUEPRINT.json');
    
    if (fs.existsSync(blueprintPath)) {
      const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));
      
      res.json({
        success: true,
        summary: {
          totalFeatures: blueprint.features.total,
          components: blueprint.components.length,
          services: blueprint.services.length,
          apis: blueprint.apis.length,
          databaseTables: blueprint.database.totalTables,
          securityLayers: blueprint.security.layers.length,
          automationSystems: blueprint.automation.systems.length,
          deploymentPlatforms: blueprint.deployment.platforms.length,
          quality: blueprint.summary.quality,
          readiness: blueprint.summary.readiness,
          score: blueprint.summary.score
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Blueprint not found. Generate with: npm run blueprint'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get summary'
    });
  }
});

export default router;
