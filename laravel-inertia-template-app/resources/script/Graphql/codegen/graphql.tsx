import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: { input: any; output: any };
};

export type AppRedis = {
  __typename?: 'AppRedis';
  store_value: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  ActionAppInputFormUpdate?: Maybe<Response>;
  ActionAppLoginFormCheck?: Maybe<Response>;
  ActionAppLoginFormLogin?: Maybe<Response>;
  ActionAppLoginFormLogout?: Maybe<Response>;
  ActionAppRedisUpdate?: Maybe<Response>;
};

export type MutationActionAppInputFormUpdateArgs = {
  input_multi?: InputMaybe<Scalars['String']['input']>;
  input_single_email?: InputMaybe<Scalars['String']['input']>;
  input_single_not_zero?: InputMaybe<Scalars['String']['input']>;
  input_single_number?: InputMaybe<Scalars['String']['input']>;
  input_single_range?: InputMaybe<Scalars['String']['input']>;
};

export type MutationActionAppLoginFormLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type MutationActionAppRedisUpdateArgs = {
  store_value?: InputMaybe<Scalars['String']['input']>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type Query = {
  __typename?: 'Query';
  AppRedis: AppRedis;
  /** Find a single user by an identifying attribute. */
  user?: Maybe<User>;
  /** List multiple users. */
  users: Array<User>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryAppRedisArgs = {
  sample_argument: Scalars['String']['input'];
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryUsersArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Response = {
  __typename?: 'Response';
  errors?: Maybe<Scalars['String']['output']>;
  status_code: Scalars['Int']['output'];
  status_message: Scalars['String']['output'];
};

/** Account of a person who utilizes this application. */
export type User = {
  __typename?: 'User';
  /** When the account was created. */
  created_at: Scalars['DateTime']['output'];
  /** Unique email address. */
  email: Scalars['String']['output'];
  /** When the email was verified. */
  email_verified_at?: Maybe<Scalars['DateTime']['output']>;
  /** Unique primary key. */
  id: Scalars['ID']['output'];
  /** Non-unique name. */
  name: Scalars['String']['output'];
  /** When the account was last updated. */
  updated_at: Scalars['DateTime']['output'];
};

export type ActionAppInputFormUpdateMutationVariables = Exact<{
  input_single_number?: InputMaybe<Scalars['String']['input']>;
  input_single_not_zero?: InputMaybe<Scalars['String']['input']>;
  input_single_range?: InputMaybe<Scalars['String']['input']>;
  input_single_email?: InputMaybe<Scalars['String']['input']>;
  input_multi?: InputMaybe<Scalars['String']['input']>;
}>;

export type ActionAppInputFormUpdateMutation = {
  __typename?: 'Mutation';
  ActionAppInputFormUpdate?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type ActionAppLoginFormLoginMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
}>;

export type ActionAppLoginFormLoginMutation = {
  __typename?: 'Mutation';
  ActionAppLoginFormLogin?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type ActionAppLoginFormLogoutMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ActionAppLoginFormLogoutMutation = {
  __typename?: 'Mutation';
  ActionAppLoginFormLogout?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type ActionAppLoginFormCheckMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ActionAppLoginFormCheckMutation = {
  __typename?: 'Mutation';
  ActionAppLoginFormCheck?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type ActionAppRedisUpdateMutationVariables = Exact<{
  store_value?: InputMaybe<Scalars['String']['input']>;
}>;

export type ActionAppRedisUpdateMutation = {
  __typename?: 'Mutation';
  ActionAppRedisUpdate?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type AppRedisQueryVariables = Exact<{
  sample_argument: Scalars['String']['input'];
}>;

export type AppRedisQuery = {
  __typename?: 'Query';
  AppRedis: { __typename?: 'AppRedis'; store_value: string };
};

export const ActionAppInputFormUpdateDocument = gql`
  mutation ActionAppInputFormUpdate(
    $input_single_number: String
    $input_single_not_zero: String
    $input_single_range: String
    $input_single_email: String
    $input_multi: String
  ) {
    ActionAppInputFormUpdate(
      input_single_number: $input_single_number
      input_single_not_zero: $input_single_not_zero
      input_single_range: $input_single_range
      input_single_email: $input_single_email
      input_multi: $input_multi
    ) {
      status_code
      status_message
      errors
    }
  }
`;
export type ActionAppInputFormUpdateMutationFn = Apollo.MutationFunction<
  ActionAppInputFormUpdateMutation,
  ActionAppInputFormUpdateMutationVariables
>;

/**
 * __useActionAppInputFormUpdateMutation__
 *
 * To run a mutation, you first call `useActionAppInputFormUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActionAppInputFormUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actionAppInputFormUpdateMutation, { data, loading, error }] = useActionAppInputFormUpdateMutation({
 *   variables: {
 *      input_single_number: // value for 'input_single_number'
 *      input_single_not_zero: // value for 'input_single_not_zero'
 *      input_single_range: // value for 'input_single_range'
 *      input_single_email: // value for 'input_single_email'
 *      input_multi: // value for 'input_multi'
 *   },
 * });
 */
export function useActionAppInputFormUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActionAppInputFormUpdateMutation,
    ActionAppInputFormUpdateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActionAppInputFormUpdateMutation,
    ActionAppInputFormUpdateMutationVariables
  >(ActionAppInputFormUpdateDocument, options);
}
export type ActionAppInputFormUpdateMutationHookResult = ReturnType<
  typeof useActionAppInputFormUpdateMutation
>;
export type ActionAppInputFormUpdateMutationResult =
  Apollo.MutationResult<ActionAppInputFormUpdateMutation>;
export type ActionAppInputFormUpdateMutationOptions =
  Apollo.BaseMutationOptions<
    ActionAppInputFormUpdateMutation,
    ActionAppInputFormUpdateMutationVariables
  >;
export const ActionAppLoginFormLoginDocument = gql`
  mutation ActionAppLoginFormLogin($email: String, $password: String) {
    ActionAppLoginFormLogin(email: $email, password: $password) {
      status_code
      status_message
      errors
    }
  }
`;
export type ActionAppLoginFormLoginMutationFn = Apollo.MutationFunction<
  ActionAppLoginFormLoginMutation,
  ActionAppLoginFormLoginMutationVariables
>;

/**
 * __useActionAppLoginFormLoginMutation__
 *
 * To run a mutation, you first call `useActionAppLoginFormLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActionAppLoginFormLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actionAppLoginFormLoginMutation, { data, loading, error }] = useActionAppLoginFormLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useActionAppLoginFormLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActionAppLoginFormLoginMutation,
    ActionAppLoginFormLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActionAppLoginFormLoginMutation,
    ActionAppLoginFormLoginMutationVariables
  >(ActionAppLoginFormLoginDocument, options);
}
export type ActionAppLoginFormLoginMutationHookResult = ReturnType<
  typeof useActionAppLoginFormLoginMutation
>;
export type ActionAppLoginFormLoginMutationResult =
  Apollo.MutationResult<ActionAppLoginFormLoginMutation>;
export type ActionAppLoginFormLoginMutationOptions = Apollo.BaseMutationOptions<
  ActionAppLoginFormLoginMutation,
  ActionAppLoginFormLoginMutationVariables
>;
export const ActionAppLoginFormLogoutDocument = gql`
  mutation ActionAppLoginFormLogout {
    ActionAppLoginFormLogout {
      status_code
      status_message
      errors
    }
  }
`;
export type ActionAppLoginFormLogoutMutationFn = Apollo.MutationFunction<
  ActionAppLoginFormLogoutMutation,
  ActionAppLoginFormLogoutMutationVariables
>;

/**
 * __useActionAppLoginFormLogoutMutation__
 *
 * To run a mutation, you first call `useActionAppLoginFormLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActionAppLoginFormLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actionAppLoginFormLogoutMutation, { data, loading, error }] = useActionAppLoginFormLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useActionAppLoginFormLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActionAppLoginFormLogoutMutation,
    ActionAppLoginFormLogoutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActionAppLoginFormLogoutMutation,
    ActionAppLoginFormLogoutMutationVariables
  >(ActionAppLoginFormLogoutDocument, options);
}
export type ActionAppLoginFormLogoutMutationHookResult = ReturnType<
  typeof useActionAppLoginFormLogoutMutation
>;
export type ActionAppLoginFormLogoutMutationResult =
  Apollo.MutationResult<ActionAppLoginFormLogoutMutation>;
export type ActionAppLoginFormLogoutMutationOptions =
  Apollo.BaseMutationOptions<
    ActionAppLoginFormLogoutMutation,
    ActionAppLoginFormLogoutMutationVariables
  >;
export const ActionAppLoginFormCheckDocument = gql`
  mutation ActionAppLoginFormCheck {
    ActionAppLoginFormCheck {
      status_code
      status_message
      errors
    }
  }
`;
export type ActionAppLoginFormCheckMutationFn = Apollo.MutationFunction<
  ActionAppLoginFormCheckMutation,
  ActionAppLoginFormCheckMutationVariables
>;

/**
 * __useActionAppLoginFormCheckMutation__
 *
 * To run a mutation, you first call `useActionAppLoginFormCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActionAppLoginFormCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actionAppLoginFormCheckMutation, { data, loading, error }] = useActionAppLoginFormCheckMutation({
 *   variables: {
 *   },
 * });
 */
export function useActionAppLoginFormCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActionAppLoginFormCheckMutation,
    ActionAppLoginFormCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActionAppLoginFormCheckMutation,
    ActionAppLoginFormCheckMutationVariables
  >(ActionAppLoginFormCheckDocument, options);
}
export type ActionAppLoginFormCheckMutationHookResult = ReturnType<
  typeof useActionAppLoginFormCheckMutation
>;
export type ActionAppLoginFormCheckMutationResult =
  Apollo.MutationResult<ActionAppLoginFormCheckMutation>;
export type ActionAppLoginFormCheckMutationOptions = Apollo.BaseMutationOptions<
  ActionAppLoginFormCheckMutation,
  ActionAppLoginFormCheckMutationVariables
>;
export const ActionAppRedisUpdateDocument = gql`
  mutation ActionAppRedisUpdate($store_value: String) {
    ActionAppRedisUpdate(store_value: $store_value) {
      status_code
      status_message
      errors
    }
  }
`;
export type ActionAppRedisUpdateMutationFn = Apollo.MutationFunction<
  ActionAppRedisUpdateMutation,
  ActionAppRedisUpdateMutationVariables
>;

/**
 * __useActionAppRedisUpdateMutation__
 *
 * To run a mutation, you first call `useActionAppRedisUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActionAppRedisUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actionAppRedisUpdateMutation, { data, loading, error }] = useActionAppRedisUpdateMutation({
 *   variables: {
 *      store_value: // value for 'store_value'
 *   },
 * });
 */
export function useActionAppRedisUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActionAppRedisUpdateMutation,
    ActionAppRedisUpdateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActionAppRedisUpdateMutation,
    ActionAppRedisUpdateMutationVariables
  >(ActionAppRedisUpdateDocument, options);
}
export type ActionAppRedisUpdateMutationHookResult = ReturnType<
  typeof useActionAppRedisUpdateMutation
>;
export type ActionAppRedisUpdateMutationResult =
  Apollo.MutationResult<ActionAppRedisUpdateMutation>;
export type ActionAppRedisUpdateMutationOptions = Apollo.BaseMutationOptions<
  ActionAppRedisUpdateMutation,
  ActionAppRedisUpdateMutationVariables
>;
export const AppRedisDocument = gql`
  query AppRedis($sample_argument: String!) {
    AppRedis(sample_argument: $sample_argument) {
      store_value
    }
  }
`;

/**
 * __useAppRedisQuery__
 *
 * To run a query within a React component, call `useAppRedisQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppRedisQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppRedisQuery({
 *   variables: {
 *      sample_argument: // value for 'sample_argument'
 *   },
 * });
 */
export function useAppRedisQuery(
  baseOptions: Apollo.QueryHookOptions<AppRedisQuery, AppRedisQueryVariables> &
    ({ variables: AppRedisQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppRedisQuery, AppRedisQueryVariables>(
    AppRedisDocument,
    options,
  );
}
export function useAppRedisLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AppRedisQuery,
    AppRedisQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppRedisQuery, AppRedisQueryVariables>(
    AppRedisDocument,
    options,
  );
}
export function useAppRedisSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AppRedisQuery,
    AppRedisQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<AppRedisQuery, AppRedisQueryVariables>(
    AppRedisDocument,
    options,
  );
}
export type AppRedisQueryHookResult = ReturnType<typeof useAppRedisQuery>;
export type AppRedisLazyQueryHookResult = ReturnType<
  typeof useAppRedisLazyQuery
>;
export type AppRedisSuspenseQueryHookResult = ReturnType<
  typeof useAppRedisSuspenseQuery
>;
export type AppRedisQueryResult = Apollo.QueryResult<
  AppRedisQuery,
  AppRedisQueryVariables
>;
