import { newE2EPage } from '@stencil/core/testing';

describe('x-doc-log', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<x-doc-log></x-doc-log>');

    const element = await page.find('x-doc-log');
    expect(element).toHaveClass('hydrated');
  });
});
