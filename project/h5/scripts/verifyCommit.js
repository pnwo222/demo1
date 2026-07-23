const msg = require('fs').readFileSync('.git/COMMIT_EDITMSG', 'utf-8').trim()
const commitRE = /^(revert: )?(wip|release|feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build|merge|revert)(\(.+\))?: .{1,50}/
const mergeRe = /^(Merge pull request|Merge branch)/

if (!commitRE.test(msg)) {
  if (!mergeRe.test(msg)) {
    console.log('git commit unpass')
    console.error('git commit error, needs title(scope): desc')
    process.exit(1)
  }
} else {
  console.log('git commit pass')
}
