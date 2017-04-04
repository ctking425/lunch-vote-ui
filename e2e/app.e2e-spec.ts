import { LunchVotePage } from './app.po';

describe('lunch-vote App', () => {
  let page: LunchVotePage;

  beforeEach(() => {
    page = new LunchVotePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
