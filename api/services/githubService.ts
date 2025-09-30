import { Octokit } from '@octokit/rest'

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export class GitHubService {
  async getUserInfo() {
    const octokit = await getUncachableGitHubClient();
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  }

  async getRepositories() {
    const octokit = await getUncachableGitHubClient();
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      direction: 'desc'
    });
    return data;
  }

  async createRepository(name: string, description?: string, isPrivate = false) {
    const octokit = await getUncachableGitHubClient();
    const { data } = await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate,
      auto_init: true
    });
    return data;
  }

  async syncToRepository(owner: string, repo: string) {
    try {
      const octokit = await getUncachableGitHubClient();
      
      // Get current repository content
      const { data: repoContents } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: ''
      });

      console.log('🔄 Syncing Cyber Mart 2077 to GitHub repository:', `${owner}/${repo}`);
      
      // Get files to sync (excluding node_modules, .git, etc.)
      const filesToSync = await this.getProjectFiles();
      
      for (const file of filesToSync) {
        await this.uploadFileToRepo(octokit, owner, repo, file.path, file.content);
      }

      console.log('✅ Successfully synced project to GitHub');
      return { success: true, message: 'Project synced to GitHub successfully' };
    } catch (error) {
      console.error('❌ GitHub sync failed:', error);
      throw error;
    }
  }

  private async getProjectFiles() {
    const fs = await import('fs');
    const path = await import('path');
    
    const files: Array<{ path: string; content: string }> = [];
    const ignoredPaths = [
      'node_modules',
      '.git',
      'dist',
      '.next',
      'attached_assets',
      '.env',
      '.env.local'
    ];

    const scanDirectory = (dir: string, baseDir = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = baseDir ? `${baseDir}/${entry.name}` : entry.name;
        
        if (ignoredPaths.some(ignored => relativePath.includes(ignored))) {
          continue;
        }

        if (entry.isDirectory()) {
          scanDirectory(fullPath, relativePath);
        } else if (entry.isFile()) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            files.push({ path: relativePath, content });
          } catch (error) {
            console.log(`Skipping binary file: ${relativePath}`);
          }
        }
      }
    };

    scanDirectory('.');
    return files;
  }

  private async uploadFileToRepo(octokit: Octokit, owner: string, repo: string, filePath: string, content: string) {
    try {
      // Check if file exists
      let existingSha: string | undefined;
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath
        });
        if ('sha' in data) {
          existingSha = data.sha;
        }
      } catch (error) {
        // File doesn't exist, that's fine
      }

      // Upload or update file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: `Sync ${filePath} - Cyber Mart 2077 Update`,
        content: Buffer.from(content).toString('base64'),
        sha: existingSha
      });

      console.log(`✅ Synced: ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to sync ${filePath}:`, error);
    }
  }
}