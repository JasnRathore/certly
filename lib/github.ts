import { Octokit } from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

const GITHUB_CONTENT_AUTH_TOKEN = process.env.GITHUB_CONTENT_AUTH_TOKEN || "";
const GITHUB_CONTENT_OWNER = process.env.GITHUB_CONTENT_OWNER || "";
const GITHUB_CONTENT_REPO = process.env.GITHUB_CONTENT_REPO || "";
const GITHUB_CONTENT_BRANCH = process.env.GITHUB_CONTENT_BRANCH || "main";

export const GitInfo = {
  content_owner: GITHUB_CONTENT_OWNER,
  content_repo: GITHUB_CONTENT_REPO,
  content_branch: GITHUB_CONTENT_BRANCH,
};

const contentOctokit = new Octokit({
  auth: GITHUB_CONTENT_AUTH_TOKEN,
});

function ensureGitCredentials(): void {
  if (!GitInfo.content_owner || !GitInfo.content_repo || !GITHUB_CONTENT_AUTH_TOKEN) {
    throw new Error(
      "Missing GitHub content credentials. Set GITHUB_CONTENT_OWNER, GITHUB_CONTENT_REPO, and GITHUB_CONTENT_AUTH_TOKEN.",
    );
  }
}

async function getExistingSha(
  owner: string,
  repo: string,
  filePath: string,
  branch: string,
): Promise<string | undefined> {
  try {
    const { data } = await contentOctokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });
    if (Array.isArray(data)) {
      throw new Error(`Path '${filePath}' resolves to a directory.`);
    }
    return typeof data.sha === "string" ? data.sha : undefined;
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function uploadToGitHub(
  filePath: string,
  buffer: Buffer,
  message: string = "Upload file"
): Promise<{ success: true; path: string }> {
  ensureGitCredentials();
  const sha = await getExistingSha(GitInfo.content_owner, GitInfo.content_repo, filePath, GitInfo.content_branch);
  
  const response = await contentOctokit.repos.createOrUpdateFileContents({
    owner: GitInfo.content_owner,
    repo: GitInfo.content_repo,
    path: filePath,
    message,
    content: buffer.toString("base64"),
    sha,
    branch: GitInfo.content_branch,
  });

  const nextPath = response.data.content?.path;
  if (!nextPath) {
    throw new Error("GitHub upload failed: missing uploaded path.");
  }
  return { success: true, path: nextPath };
}

export async function downloadFromGitHub(filePath: string): Promise<Buffer> {
  ensureGitCredentials();
  
  const url = `https://api.github.com/repos/${GitInfo.content_owner}/${GitInfo.content_repo}/contents/${filePath}?ref=${GitInfo.content_branch}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `token ${GITHUB_CONTENT_AUTH_TOKEN}`,
      'Accept': 'application/vnd.github.v3.raw',
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from GitHub: ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
