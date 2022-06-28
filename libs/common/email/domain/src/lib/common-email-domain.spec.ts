import { commonEmailDomain } from './common-email-domain';

describe('commonEmailDomain', () => {
  it('should work', () => {
    expect(commonEmailDomain()).toEqual('common-email-domain');
  });
});
