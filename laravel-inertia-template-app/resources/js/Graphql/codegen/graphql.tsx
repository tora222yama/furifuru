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
  ActionAppRedisUpdate?: Maybe<Response>;
};

export type MutationActionAppRedisUpdateArgs = {
  store_value: Scalars['String']['input'];
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

export type ActionAppRedisUpdateMutationVariables = Exact<{
  store_value: Scalars['String']['input'];
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

export type AppRedisQueryVariables = Exact<{ [key: string]: never }>;

export type AppRedisQuery = {
  __typename?: 'Query';
  AppRedis: { __typename?: 'AppRedis'; store_value: string };
};

export const ActionAppRedisUpdateDocument = gql`
  mutation ActionAppRedisUpdate($store_value: String!) {
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
  query AppRedis {
    AppRedis {
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
 *   },
 * });
 */
export function useAppRedisQuery(
  baseOptions?: Apollo.QueryHookOptions<AppRedisQuery, AppRedisQueryVariables>,
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
