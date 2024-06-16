import { CREATE_ACCOUNT_MUTATION, CreateAccount } from '../create-account';
import { ApolloProvider } from '@apollo/client';
import { MockApolloClient, createMockClient } from 'mock-apollo-client';
// custom render import
import { render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../gql/graphql';

/* describe 안의 it에서 사용하기 위해 변수 선언 */
const mockPush = jest.fn();

// react-router-dom의 useNaviage mock함수 만들기
jest.mock('react-router-dom', () => {
  // 실제 react-router-dom의 실제 파일을 ruquir하고 그 파일에서 필요한 함수만 mock으로 변환시키는 역할
  const realModule = jest.requireActual('react-router-dom');

  return {
    ...realModule,
    useNavigate: () => mockPush,
  };
});

describe('<CreateAccount />', () => {
  let mockedClient: MockApolloClient;
  mockedClient = createMockClient();

  it('renders OK', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Create Account | NuberEats');
    });
  });

  it('renders validation errors', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>,
    );
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole('button', { name: 'submit-button' });
    /* waitFor: state가 바뀌는걸 기다리기 위한 역할 */
    await waitFor(async () => {
      await userEvent.type(email, 'this@wont');
      /* error에 대한 알림이 바로 적용되지 않으므로 해당 클릭을 한번 실행 */
      await userEvent.click(document.body);
    });
    let errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    await waitFor(async () => {
      await userEvent.clear(email);
      await userEvent.click(document.body);
    });
    errorMessage = screen.getByRole('alert');
    expect(errorMessage).toHaveTextContent(/email is required/i);
    await waitFor(async () => {
      await userEvent.type(email, 'working@email.com');
      await userEvent.click(submitBtn);
    });
    await waitFor(async () => {
      errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
  });
  it('submits mutation with form values', async () => {
    render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>,
    );
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByRole('button', { name: 'submit-button' });
    const formData = {
      email: 'working@email.com',
      password: '123',
      role: UserRole.Client,
    };

    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: 'mutation-error',
        },
      },
    });

    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse,
    );

    /* window.alert을 null 로 처리 */
    jest.spyOn(window, 'alert').mockImplementation(() => null);

    await waitFor(async () => {
      await userEvent.type(email, formData.email);
      await userEvent.type(password, formData.password);
      await userEvent.click(submitBtn);
    });

    expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    /* 계정 생성 후 알맞은 alert 확인하는 test */
    expect(window.alert).toHaveBeenCalledWith('Account Created! Log in now!');
    await waitFor(() => {
      const mutationError = screen.getByRole('alert');
      expect(mutationError).toHaveTextContent('mutation-error');
    });
    expect(mockPush).toHaveBeenCalledWith('/', { replace: true });
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
