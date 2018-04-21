const { describe, test } = require('../src');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const delay = process.env.DEMO_DELAY || 300;

module.exports = describe('tests', async () => {
  await describe('build client', async () => {
    await sleep(delay);
    console.log('');
    console.log('=> OK');
    console.log(`
=========================================================================================>
=========================================================================================>
=========================================================================================>
=========================================================================================>
=========================================================================================>
=========================================================================================>
=========================================================================================>
========================================================================================>
`);
    await test('test', async () => {

    });

    // HERE, THIS IS DOES NOT WORK
    console.log('=========================================================================================>');
  });
  await describe('start server', async () => {
    await test('test 1', async () => {
    })
    await test('test 2 (nested)', async () => {
      await sleep(delay);
      console.log('[1] Hello World');
      await test('1 => nested test', async () => {
        await sleep(delay);
        console.log('[1] Hi, this is a console.log test')
        await test('2 => nested again', async () => {
          console.error('aaaa')
          await sleep(delay);
        });
      })
    })

    await test('test 3', sleep(delay)) // test() can take a promise instead of an async function
    await sleep(delay);

    await test('test 4 (nested with error)', async () => {
      await sleep(delay);
      console.log('[2] Hello World');
      await test('1 => nested test', async () => {
        await sleep(delay);
        console.log('[2] Hi, this is a console.log test')
        await test('2 => nested again', async () => {
          await sleep(delay);
          // BLINK HERE
          console.error('<=======================>')
        });
        await sleep(delay)
      })
    })
  });
  await describe('additional test I')
  await describe('additional test II', async () => {
    await test('test3', async () => {
    })
  })
  await describe('run functional tests', async () => {
    await sleep(delay);
    await test('test4', async () => {
    })
    await test('test4', async () => {
    })
  });
  await test('more test')
  await test('more test', async () => {
    throw new Error('This is an Error')
  })
  await test('more test')
});
