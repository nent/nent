import { newE2EPage } from '@stencil/core/testing';

describe('n-doc-log', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<n-doc-log></n-doc-log>');

    const element = await page.find('n-doc-log');
    expect(element).toHaveClass('hydrated');
  });
});
