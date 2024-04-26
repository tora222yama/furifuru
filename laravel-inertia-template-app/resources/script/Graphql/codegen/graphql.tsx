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

export type AppPagination = {
  __typename?: 'AppPagination';
  count: Scalars['Int']['output'];
  list: Array<Maybe<AppPaginationItem>>;
};

export type AppPaginationItem = {
  __typename?: 'AppPaginationItem';
  category_id: Scalars['Int']['output'];
  created_at: Scalars['String']['output'];
  explain: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AppRedis = {
  __typename?: 'AppRedis';
  store_value: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AppInputFormUpdate?: Maybe<Response>;
  AppLoginFormCheck?: Maybe<Response>;
  AppLoginFormLogin?: Maybe<Response>;
  AppLoginFormLogout?: Maybe<Response>;
  AppRedisUpdate?: Maybe<Response>;
};

export type MutationAppInputFormUpdateArgs = {
  input_multi?: InputMaybe<Scalars['String']['input']>;
  input_single_email?: InputMaybe<Scalars['String']['input']>;
  input_single_not_zero?: InputMaybe<Scalars['String']['input']>;
  input_single_number?: InputMaybe<Scalars['String']['input']>;
  input_single_range?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAppLoginFormLoginArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAppRedisUpdateArgs = {
  store_value?: InputMaybe<Scalars['String']['input']>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type Query = {
  __typename?: 'Query';
  AppPagination: AppPagination;
  AppRedis: AppRedis;
  /** Find a single user by an identifying attribute. */
  user?: Maybe<User>;
  /** List multiple users. */
  users: Array<User>;
};

/** Indicates what fields are available at the top level of a query operation. */
export type QueryAppPaginationArgs = {
  page_index: Scalars['Int']['input'];
  page_step: Scalars['Int']['input'];
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

export type AppInputFormUpdateMutationVariables = Exact<{
  input_single_number?: InputMaybe<Scalars['String']['input']>;
  input_single_not_zero?: InputMaybe<Scalars['String']['input']>;
  input_single_range?: InputMaybe<Scalars['String']['input']>;
  input_single_email?: InputMaybe<Scalars['String']['input']>;
  input_multi?: InputMaybe<Scalars['String']['input']>;
}>;

export type AppInputFormUpdateMutation = {
  __typename?: 'Mutation';
  AppInputFormUpdate?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type AppLoginFormLoginMutationVariables = Exact<{
  email?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
}>;

export type AppLoginFormLoginMutation = {
  __typename?: 'Mutation';
  AppLoginFormLogin?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type AppLoginFormLogoutMutationVariables = Exact<{
  [key: string]: never;
}>;

export type AppLoginFormLogoutMutation = {
  __typename?: 'Mutation';
  AppLoginFormLogout?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type AppLoginFormCheckMutationVariables = Exact<{
  [key: string]: never;
}>;

export type AppLoginFormCheckMutation = {
  __typename?: 'Mutation';
  AppLoginFormCheck?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type AppRedisUpdateMutationVariables = Exact<{
  store_value?: InputMaybe<Scalars['String']['input']>;
}>;

export type AppRedisUpdateMutation = {
  __typename?: 'Mutation';
  AppRedisUpdate?: {
    __typename?: 'Response';
    status_code: number;
    status_message: string;
    errors?: string | null;
  } | null;
};

export type AppPaginationQueryVariables = Exact<{
  page_index: Scalars['Int']['input'];
  page_step: Scalars['Int']['input'];
}>;

export type AppPaginationQuery = {
  __typename?: 'Query';
  AppPagination: {
    __typename?: 'AppPagination';
    count: number;
    list: Array<{
      __typename?: 'AppPaginationItem';
      id: number;
      category_id: number;
      name: string;
      explain: string;
      created_at: string;
    } | null>;
  };
};

export type AppRedisQueryVariables = Exact<{
  sample_argument: Scalars['String']['input'];
}>;

export type AppRedisQuery = {
  __typename?: 'Query';
  AppRedis: { __typename?: 'AppRedis'; store_value: string };
};

export const AppInputFormUpdateDocument = gql`
  mutation AppInputFormUpdate(
    $input_single_number: String
    $input_single_not_zero: String
    $input_single_range: String
    $input_single_email: String
    $input_multi: String
  ) {
    AppInputFormUpdate(
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
export type AppInputFormUpdateMutationFn = Apollo.MutationFunction<
  AppInputFormUpdateMutation,
  AppInputFormUpdateMutationVariables
>;

/**
 * __useAppInputFormUpdateMutation__
 *
 * To run a mutation, you first call `useAppInputFormUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppInputFormUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appInputFormUpdateMutation, { data, loading, error }] = useAppInputFormUpdateMutation({
 *   variables: {
 *      input_single_number: // value for 'input_single_number'
 *      input_single_not_zero: // value for 'input_single_not_zero'
 *      input_single_range: // value for 'input_single_range'
 *      input_single_email: // value for 'input_single_email'
 *      input_multi: // value for 'input_multi'
 *   },
 * });
 */
export function useAppInputFormUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppInputFormUpdateMutation,
    AppInputFormUpdateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppInputFormUpdateMutation,
    AppInputFormUpdateMutationVariables
  >(AppInputFormUpdateDocument, options);
}
export type AppInputFormUpdateMutationHookResult = ReturnType<
  typeof useAppInputFormUpdateMutation
>;
export type AppInputFormUpdateMutationResult =
  Apollo.MutationResult<AppInputFormUpdateMutation>;
export type AppInputFormUpdateMutationOptions = Apollo.BaseMutationOptions<
  AppInputFormUpdateMutation,
  AppInputFormUpdateMutationVariables
>;
export const AppLoginFormLoginDocument = gql`
  mutation AppLoginFormLogin($email: String, $password: String) {
    AppLoginFormLogin(email: $email, password: $password) {
      status_code
      status_message
      errors
    }
  }
`;
export type AppLoginFormLoginMutationFn = Apollo.MutationFunction<
  AppLoginFormLoginMutation,
  AppLoginFormLoginMutationVariables
>;

/**
 * __useAppLoginFormLoginMutation__
 *
 * To run a mutation, you first call `useAppLoginFormLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppLoginFormLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appLoginFormLoginMutation, { data, loading, error }] = useAppLoginFormLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useAppLoginFormLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppLoginFormLoginMutation,
    AppLoginFormLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppLoginFormLoginMutation,
    AppLoginFormLoginMutationVariables
  >(AppLoginFormLoginDocument, options);
}
export type AppLoginFormLoginMutationHookResult = ReturnType<
  typeof useAppLoginFormLoginMutation
>;
export type AppLoginFormLoginMutationResult =
  Apollo.MutationResult<AppLoginFormLoginMutation>;
export type AppLoginFormLoginMutationOptions = Apollo.BaseMutationOptions<
  AppLoginFormLoginMutation,
  AppLoginFormLoginMutationVariables
>;
export const AppLoginFormLogoutDocument = gql`
  mutation AppLoginFormLogout {
    AppLoginFormLogout {
      status_code
      status_message
      errors
    }
  }
`;
export type AppLoginFormLogoutMutationFn = Apollo.MutationFunction<
  AppLoginFormLogoutMutation,
  AppLoginFormLogoutMutationVariables
>;

/**
 * __useAppLoginFormLogoutMutation__
 *
 * To run a mutation, you first call `useAppLoginFormLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppLoginFormLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appLoginFormLogoutMutation, { data, loading, error }] = useAppLoginFormLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useAppLoginFormLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppLoginFormLogoutMutation,
    AppLoginFormLogoutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppLoginFormLogoutMutation,
    AppLoginFormLogoutMutationVariables
  >(AppLoginFormLogoutDocument, options);
}
export type AppLoginFormLogoutMutationHookResult = ReturnType<
  typeof useAppLoginFormLogoutMutation
>;
export type AppLoginFormLogoutMutationResult =
  Apollo.MutationResult<AppLoginFormLogoutMutation>;
export type AppLoginFormLogoutMutationOptions = Apollo.BaseMutationOptions<
  AppLoginFormLogoutMutation,
  AppLoginFormLogoutMutationVariables
>;
export const AppLoginFormCheckDocument = gql`
  mutation AppLoginFormCheck {
    AppLoginFormCheck {
      status_code
      status_message
      errors
    }
  }
`;
export type AppLoginFormCheckMutationFn = Apollo.MutationFunction<
  AppLoginFormCheckMutation,
  AppLoginFormCheckMutationVariables
>;

/**
 * __useAppLoginFormCheckMutation__
 *
 * To run a mutation, you first call `useAppLoginFormCheckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppLoginFormCheckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appLoginFormCheckMutation, { data, loading, error }] = useAppLoginFormCheckMutation({
 *   variables: {
 *   },
 * });
 */
export function useAppLoginFormCheckMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppLoginFormCheckMutation,
    AppLoginFormCheckMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppLoginFormCheckMutation,
    AppLoginFormCheckMutationVariables
  >(AppLoginFormCheckDocument, options);
}
export type AppLoginFormCheckMutationHookResult = ReturnType<
  typeof useAppLoginFormCheckMutation
>;
export type AppLoginFormCheckMutationResult =
  Apollo.MutationResult<AppLoginFormCheckMutation>;
export type AppLoginFormCheckMutationOptions = Apollo.BaseMutationOptions<
  AppLoginFormCheckMutation,
  AppLoginFormCheckMutationVariables
>;
export const AppRedisUpdateDocument = gql`
  mutation AppRedisUpdate($store_value: String) {
    AppRedisUpdate(store_value: $store_value) {
      status_code
      status_message
      errors
    }
  }
`;
export type AppRedisUpdateMutationFn = Apollo.MutationFunction<
  AppRedisUpdateMutation,
  AppRedisUpdateMutationVariables
>;

/**
 * __useAppRedisUpdateMutation__
 *
 * To run a mutation, you first call `useAppRedisUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppRedisUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appRedisUpdateMutation, { data, loading, error }] = useAppRedisUpdateMutation({
 *   variables: {
 *      store_value: // value for 'store_value'
 *   },
 * });
 */
export function useAppRedisUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppRedisUpdateMutation,
    AppRedisUpdateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppRedisUpdateMutation,
    AppRedisUpdateMutationVariables
  >(AppRedisUpdateDocument, options);
}
export type AppRedisUpdateMutationHookResult = ReturnType<
  typeof useAppRedisUpdateMutation
>;
export type AppRedisUpdateMutationResult =
  Apollo.MutationResult<AppRedisUpdateMutation>;
export type AppRedisUpdateMutationOptions = Apollo.BaseMutationOptions<
  AppRedisUpdateMutation,
  AppRedisUpdateMutationVariables
>;
export const AppPaginationDocument = gql`
  query AppPagination($page_index: Int!, $page_step: Int!) {
    AppPagination(page_index: $page_index, page_step: $page_step) {
      list {
        id
        category_id
        name
        explain
        created_at
      }
      count
    }
  }
`;

/**
 * __useAppPaginationQuery__
 *
 * To run a query within a React component, call `useAppPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppPaginationQuery({
 *   variables: {
 *      page_index: // value for 'page_index'
 *      page_step: // value for 'page_step'
 *   },
 * });
 */
export function useAppPaginationQuery(
  baseOptions: Apollo.QueryHookOptions<
    AppPaginationQuery,
    AppPaginationQueryVariables
  > &
    (
      | { variables: AppPaginationQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppPaginationQuery, AppPaginationQueryVariables>(
    AppPaginationDocument,
    options,
  );
}
export function useAppPaginationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AppPaginationQuery,
    AppPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppPaginationQuery, AppPaginationQueryVariables>(
    AppPaginationDocument,
    options,
  );
}
export function useAppPaginationSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AppPaginationQuery,
    AppPaginationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AppPaginationQuery,
    AppPaginationQueryVariables
  >(AppPaginationDocument, options);
}
export type AppPaginationQueryHookResult = ReturnType<
  typeof useAppPaginationQuery
>;
export type AppPaginationLazyQueryHookResult = ReturnType<
  typeof useAppPaginationLazyQuery
>;
export type AppPaginationSuspenseQueryHookResult = ReturnType<
  typeof useAppPaginationSuspenseQuery
>;
export type AppPaginationQueryResult = Apollo.QueryResult<
  AppPaginationQuery,
  AppPaginationQueryVariables
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
