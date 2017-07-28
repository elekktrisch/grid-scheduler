import { GridSchedulerPage } from './app.po';

describe('grid-scheduler App', () => {
  let page: GridSchedulerPage;

  beforeEach(() => {
    page = new GridSchedulerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
