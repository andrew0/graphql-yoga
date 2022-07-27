import type {
  DocumentNode,
  ExecutionResult,
  GraphQLError,
  OperationDefinitionNode,
} from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { GetEnvelopedFn, PromiseOrValue } from '@envelop/core'
import { OnResultProcess } from './plugins/types.js'
import { createFetch } from '@whatwg-node/fetch'

export interface ExecutionPatchResult<
  TData = { [key: string]: any },
  TExtensions = { [key: string]: any },
> {
  errors?: ReadonlyArray<GraphQLError>
  data?: TData | null
  path?: ReadonlyArray<string | number>
  label?: string
  hasNext: boolean
  extensions?: TExtensions
}

export interface GraphQLParams<
  TVariables = Record<string, any>,
  TExtensions = Record<string, any>,
> {
  operationName?: string
  query?: string
  variables?: TVariables
  extensions?: TExtensions
}

export interface FormatPayloadParams<TContext, TRootValue> {
  payload: ExecutionResult | ExecutionPatchResult
  context?: TContext
  document?: DocumentNode
  operation?: OperationDefinitionNode
  rootValue?: TRootValue
}

export interface YogaInitialContext {
  /**
   * A Document containing GraphQL Operations and Fragments to execute.
   */
  query?: string | DocumentNode
  /**
   * An object describing the HTTP request.
   */
  request: Request
  /**
   * The name of the Operation in the Document to execute.
   */
  operationName?: string
  /**
   * Values for any Variables defined by the Operation.
   */
  variables?: Record<string, any>
  /**
   * Additional extensions object sent by the client.
   */
  extensions?: Record<string, any>
}

export interface RequestProcessContext<TContext> {
  request: Request
  enveloped: ReturnType<GetEnvelopedFn<TContext>>
  params: GraphQLParams
  fetchAPI: FetchAPI
  /**
   * Response Hooks
   */
  onResultProcessHooks: OnResultProcess[]
}

export type CORSOptions =
  | {
      origin?: string[] | string
      methods?: string[]
      allowedHeaders?: string[]
      exposedHeaders?: string[]
      credentials?: boolean
      maxAge?: number
    }
  | false

export type GraphQLServerInject<
  TData = any,
  TVariables = Record<string, any>,
  TServerContext extends Record<string, any> = Record<string, any>,
> = {
  /** GraphQL Operation to execute */
  document: string | TypedDocumentNode<TData, TVariables>
  /** Variables for GraphQL Operation */
  variables?: TVariables
  /** Name for GraphQL Operation */
  operationName?: string
  /** Set any headers for the GraphQL request */
  headers?: HeadersInit
} & ({} extends TServerContext
  ? { serverContext?: TServerContext }
  : { serverContext: TServerContext })

export { EnvelopError as GraphQLYogaError } from '@envelop/core'

declare global {
  interface ReadableStream<R = any> {
    [Symbol.asyncIterator]: () => AsyncIterator<R>
  }
}

export type FetchAPI = ReturnType<typeof createFetch>

export interface FetchEvent extends Event {
  request: Request
  respondWith(response: PromiseOrValue<Response>): void
}