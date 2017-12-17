const { describe, test } = require('../src');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('tests', async () => {
  await describe('build client', async () => {
    await test('test');
  });
  await describe('start server', async () => {
    await test('test 1', async () => {
    })
    await test('test 2', async () => {
      console.warn('console.warn');
    })
    await sleep(100);
  });
  await describe('additional test I')
  await describe('additional test II', async () => {
    await test('test3', async () => {
      console.log('console.log');
    })
  })
  await describe('run functional tests', async () => {
    await sleep(100);
    await test('test4', async () => {
      throw new Error('1')
    })
    await test('test4', async () => {
      throw new Error('2')
    })
  });
  await describe('more test', async () => {
    throw new Error('Fatal')
  })
  await describe('more test')
  await describe('more test')
});
