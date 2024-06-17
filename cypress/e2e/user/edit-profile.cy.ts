describe('Edit Profile', () => {
  const user = cy;
  beforeEach(() => {
    user.login('client@client.com', '123');
  });
  it('can go to /edit-profile using the header', () => {
    // 링크를 클릭을 통해 e2e test 접근하기
    user.get('a[href="/edit-profile"]').click();
    user.assertTitle('Edit Profile');
  });
  it('can change email', () => {
    user.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body?.operationName === 'editProfile') {
        // @ts-ignore
        req.body?.variables?.input?.email = 'client@client.com';
      }
    });
    user.visit('/edit-profile');
    user.findByPlaceholderText(/email/i).clear().type('user@user.com');
    user.findByRole('button').click();
  });
});
