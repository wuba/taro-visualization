#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const path = require('path');
const shell = require('shelljs');
const { readJson } = require('fs-extra');

const cwd = process.cwd();
const init = () => {
  console.log(
    chalk.green(
      figlet.textSync('TARO VISUALIZATION', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
};
const checkGit = () => {
  const gitSt = shell.exec('git status', { silent: true });
  if (gitSt.code !== 0 || !gitSt.stdout.includes('nothing to commit, working tree clean')) {
    console.log(chalk.red(`请先提交代码`));
    shell.exit(1);
  }
};
const getPackagesNameList = () => {
  const packagesDir = path.join(cwd, 'packages');
  return shell.ls(packagesDir);
};
const askQuestions = () => {
  const questions = [
    {
      type: 'list',
      name: 'packageName',
      message: '发布哪个包？',
      choices: getPackagesNameList(),
      filter: function (val) {
        return `${val}`;
      }
    }
  ];
  return inquirer.prompt(questions);
};

const buildPackage = ({ packageName }) => {
  const packagePath = path.join(cwd, 'packages', packageName);
  shell.cd(`${packagePath}`);
  shell.exec(`rm -rf build`, { silent: true });
  console.log(chalk.green(`${packageName}编译中，请耐心等待...`));
  const buildRes = shell.exec(`pnpm -F ${packageName} run build`, { silent: true });
  if (buildRes.code !== 0) {
    console.log(buildRes.stdout, chalk.red(`${packageName}编译失败!`));
    shell.exit(1);
  }
  console.log(chalk.green(`${packageName}编译成功 !`));
};

const publishPackage = async ({ packageName }) => {
  const version = await readJson(path.join(cwd, 'packages', packageName, 'package.json'));
  /** ================ npm 发包 =================== */
  console.log(chalk.green(`${packageName}@${version} ~~npm~~ 包发布中，请耐心等待...`));
  //    const npmPublishRes = shell.exec(`pnpm -F ${packageName} publish`,{silent:true})
  const npmPublishRes = shell.exec(`pnpm -F ${packageName} publish`);

  //    if(npmPublishRes.code !== 0 || npmPublishRes.stdout !== `+ ${packageName}@${version}\n`){
  //      console.log(npmPublishRes.stderr, chalk.red(`${packageName}@${version} ~~npm~~ 包发布失败，请联系管理员!`))
  //      console.log(chalk.red(`npm发布指令: pnpm -F ${packageName} publish`))
  //      shell.exit(1)
  //    } else {
  //      console.log(chalk.green(`${packageName}@${version} ~~npm~~ 包发布成功 !`))
  //    }
};
const run = async () => {
  init();
  //   checkGit();
  const answers = await askQuestions();
  buildPackage(answers);
  await publishPackage(answers);
  //   shell.exit(0);
};

run();
