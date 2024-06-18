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
  /** Can be used as an argument to upload files using https://github.com/jaydenseric/graphql-multipart-request-spec */
  Upload: { input: any; output: any };
};

export type AppTrnUser = {
  __typename?: 'AppTrnUser';
  authId: Scalars['Int']['output'];
  faceImagePath?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  AppPersonalSettingEditUpdate?: Maybe<Response>;
  AppPersonalSettingShowAlignSlack?: Maybe<Response>;
};

export type MutationAppPersonalSettingEditUpdateArgs = {
  nickname: Scalars['String']['input'];
  slackTeamId?: InputMaybe<Scalars['String']['input']>;
  slackUserId?: InputMaybe<Scalars['String']['input']>;
  slackUserName?: InputMaybe<Scalars['String']['input']>;
  trnUserId: Scalars['Int']['input'];
  upload?: InputMaybe<Scalars['Upload']['input']>;
};

export type Query = {
  __typename?: 'Query';
  AppTrnUserList: Array<Maybe<AppTrnUser>>;
};

export type Response = {
  __typename?: 'Response';
  errors?: Maybe<Scalars['String']['output']>;
  statusCode: Scalars['Int']['output'];
  statusMessage: Scalars['String']['output'];
};

export type AppPersonalSettingEditUpdateMutationVariables = Exact<{
  trnUserId: Scalars['Int']['input'];
  nickname: Scalars['String']['input'];
  slackUserId?: InputMaybe<Scalars['String']['input']>;
  slackUserName?: InputMaybe<Scalars['String']['input']>;
  slackTeamId?: InputMaybe<Scalars['String']['input']>;
  upload?: InputMaybe<Scalars['Upload']['input']>;
}>;

export type AppPersonalSettingEditUpdateMutation = {
  __typename?: 'Mutation';
  AppPersonalSettingEditUpdate?: {
    __typename?: 'Response';
    statusCode: number;
    statusMessage: string;
    errors?: string | null;
  } | null;
};

export type AppPersonalSettingShowAlignSlackMutationVariables = Exact<{
  [key: string]: never;
}>;

export type AppPersonalSettingShowAlignSlackMutation = {
  __typename?: 'Mutation';
  AppPersonalSettingShowAlignSlack?: {
    __typename?: 'Response';
    statusCode: number;
    statusMessage: string;
    errors?: string | null;
  } | null;
};

export type AppTrnUserListQueryVariables = Exact<{ [key: string]: never }>;

export type AppTrnUserListQuery = {
  __typename?: 'Query';
  AppTrnUserList: Array<{
    __typename?: 'AppTrnUser';
    id: number;
    authId: number;
    nickname?: string | null;
    faceImagePath?: string | null;
  } | null>;
};

export const AppPersonalSettingEditUpdateDocument = gql`
  mutation AppPersonalSettingEditUpdate(
    $trnUserId: Int!
    $nickname: String!
    $slackUserId: String
    $slackUserName: String
    $slackTeamId: String
    $upload: Upload
  ) {
    AppPersonalSettingEditUpdate(
      trnUserId: $trnUserId
      nickname: $nickname
      slackUserId: $slackUserId
      slackUserName: $slackUserName
      slackTeamId: $slackTeamId
      upload: $upload
    ) {
      statusCode
      statusMessage
      errors
    }
  }
`;
export type AppPersonalSettingEditUpdateMutationFn = Apollo.MutationFunction<
  AppPersonalSettingEditUpdateMutation,
  AppPersonalSettingEditUpdateMutationVariables
>;

/**
 * __useAppPersonalSettingEditUpdateMutation__
 *
 * To run a mutation, you first call `useAppPersonalSettingEditUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppPersonalSettingEditUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appPersonalSettingEditUpdateMutation, { data, loading, error }] = useAppPersonalSettingEditUpdateMutation({
 *   variables: {
 *      trnUserId: // value for 'trnUserId'
 *      nickname: // value for 'nickname'
 *      slackUserId: // value for 'slackUserId'
 *      slackUserName: // value for 'slackUserName'
 *      slackTeamId: // value for 'slackTeamId'
 *      upload: // value for 'upload'
 *   },
 * });
 */
export function useAppPersonalSettingEditUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppPersonalSettingEditUpdateMutation,
    AppPersonalSettingEditUpdateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppPersonalSettingEditUpdateMutation,
    AppPersonalSettingEditUpdateMutationVariables
  >(AppPersonalSettingEditUpdateDocument, options);
}
export type AppPersonalSettingEditUpdateMutationHookResult = ReturnType<
  typeof useAppPersonalSettingEditUpdateMutation
>;
export type AppPersonalSettingEditUpdateMutationResult =
  Apollo.MutationResult<AppPersonalSettingEditUpdateMutation>;
export type AppPersonalSettingEditUpdateMutationOptions =
  Apollo.BaseMutationOptions<
    AppPersonalSettingEditUpdateMutation,
    AppPersonalSettingEditUpdateMutationVariables
  >;
export const AppPersonalSettingShowAlignSlackDocument = gql`
  mutation AppPersonalSettingShowAlignSlack {
    AppPersonalSettingShowAlignSlack {
      statusCode
      statusMessage
      errors
    }
  }
`;
export type AppPersonalSettingShowAlignSlackMutationFn =
  Apollo.MutationFunction<
    AppPersonalSettingShowAlignSlackMutation,
    AppPersonalSettingShowAlignSlackMutationVariables
  >;

/**
 * __useAppPersonalSettingShowAlignSlackMutation__
 *
 * To run a mutation, you first call `useAppPersonalSettingShowAlignSlackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAppPersonalSettingShowAlignSlackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [appPersonalSettingShowAlignSlackMutation, { data, loading, error }] = useAppPersonalSettingShowAlignSlackMutation({
 *   variables: {
 *   },
 * });
 */
export function useAppPersonalSettingShowAlignSlackMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AppPersonalSettingShowAlignSlackMutation,
    AppPersonalSettingShowAlignSlackMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AppPersonalSettingShowAlignSlackMutation,
    AppPersonalSettingShowAlignSlackMutationVariables
  >(AppPersonalSettingShowAlignSlackDocument, options);
}
export type AppPersonalSettingShowAlignSlackMutationHookResult = ReturnType<
  typeof useAppPersonalSettingShowAlignSlackMutation
>;
export type AppPersonalSettingShowAlignSlackMutationResult =
  Apollo.MutationResult<AppPersonalSettingShowAlignSlackMutation>;
export type AppPersonalSettingShowAlignSlackMutationOptions =
  Apollo.BaseMutationOptions<
    AppPersonalSettingShowAlignSlackMutation,
    AppPersonalSettingShowAlignSlackMutationVariables
  >;
export const AppTrnUserListDocument = gql`
  query AppTrnUserList {
    AppTrnUserList {
      id
      authId
      nickname
      faceImagePath
    }
  }
`;

/**
 * __useAppTrnUserListQuery__
 *
 * To run a query within a React component, call `useAppTrnUserListQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppTrnUserListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppTrnUserListQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppTrnUserListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AppTrnUserListQuery,
    AppTrnUserListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<AppTrnUserListQuery, AppTrnUserListQueryVariables>(
    AppTrnUserListDocument,
    options,
  );
}
export function useAppTrnUserListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AppTrnUserListQuery,
    AppTrnUserListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<AppTrnUserListQuery, AppTrnUserListQueryVariables>(
    AppTrnUserListDocument,
    options,
  );
}
export function useAppTrnUserListSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    AppTrnUserListQuery,
    AppTrnUserListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    AppTrnUserListQuery,
    AppTrnUserListQueryVariables
  >(AppTrnUserListDocument, options);
}
export type AppTrnUserListQueryHookResult = ReturnType<
  typeof useAppTrnUserListQuery
>;
export type AppTrnUserListLazyQueryHookResult = ReturnType<
  typeof useAppTrnUserListLazyQuery
>;
export type AppTrnUserListSuspenseQueryHookResult = ReturnType<
  typeof useAppTrnUserListSuspenseQuery
>;
export type AppTrnUserListQueryResult = Apollo.QueryResult<
  AppTrnUserListQuery,
  AppTrnUserListQueryVariables
>;
