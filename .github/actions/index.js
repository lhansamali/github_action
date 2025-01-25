const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('github-token');
    const octokit = github.getOctokit(token);

    const { context } = github;
    const { pull_request } = context.payload;

    if (!pull_request) {
      core.setFailed('This action can only run on pull_request events.');
      return;
    }

    const assignee = pull_request.user.login; // PR author
    const { owner, repo } = context.repo;
    const issue_number = pull_request.number;

    await octokit.rest.issues.addAssignees({
      owner,
      repo,
      issue_number,
      assignees: [assignee],
    });

    console.log(`Assigned PR author (${assignee}) to PR #${issue_number}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
