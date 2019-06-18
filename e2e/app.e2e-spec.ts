import { Apmis4Page } from './app.po';

describe('apmis4 App', () => {
  let page: Apmis4Page;

  beforeEach(() => {
    page = new Apmis4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
