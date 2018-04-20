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
    })
    await test('test 3', sleep(1)) // test() can take a promise instead of an async function
    await sleep(100);
  });
  await describe('additional test I')
  await describe('additional test II', async () => {
    await test('test3', async () => {
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
