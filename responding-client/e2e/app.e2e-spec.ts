import { RespondingClientPage } from './app.po';

describe('responding-client App', () => {
  let page: RespondingClientPage;

  beforeEach(() => {
    page = new RespondingClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
