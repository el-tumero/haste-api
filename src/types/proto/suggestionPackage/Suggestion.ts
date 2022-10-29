// Original file: src/proto/suggestion.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Personalities as _suggestionPackage_Personalities, Personalities__Output as _suggestionPackage_Personalities__Output } from '../suggestionPackage/Personalities';
import type { Reply as _suggestionPackage_Reply, Reply__Output as _suggestionPackage_Reply__Output } from '../suggestionPackage/Reply';

export interface SuggestionClient extends grpc.Client {
  getChances(argument: _suggestionPackage_Personalities, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, metadata: grpc.Metadata, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, options: grpc.CallOptions, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, metadata: grpc.Metadata, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, options: grpc.CallOptions, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChances(argument: _suggestionPackage_Personalities, callback: grpc.requestCallback<_suggestionPackage_Reply__Output>): grpc.ClientUnaryCall;
  
}

export interface SuggestionHandlers extends grpc.UntypedServiceImplementation {
  getChances: grpc.handleUnaryCall<_suggestionPackage_Personalities__Output, _suggestionPackage_Reply>;
  
}

export interface SuggestionDefinition extends grpc.ServiceDefinition {
  getChances: MethodDefinition<_suggestionPackage_Personalities, _suggestionPackage_Reply, _suggestionPackage_Personalities__Output, _suggestionPackage_Reply__Output>
}
