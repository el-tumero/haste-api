// Original file: src/proto/match.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Personalities as _matchPackage_Personalities, Personalities__Output as _matchPackage_Personalities__Output } from '../matchPackage/Personalities';
import type { Reply as _matchPackage_Reply, Reply__Output as _matchPackage_Reply__Output } from '../matchPackage/Reply';

export interface MatchClient extends grpc.Client {
  getChance(argument: _matchPackage_Personalities, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, metadata: grpc.Metadata, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, options: grpc.CallOptions, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, metadata: grpc.Metadata, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, options: grpc.CallOptions, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  getChance(argument: _matchPackage_Personalities, callback: grpc.requestCallback<_matchPackage_Reply__Output>): grpc.ClientUnaryCall;
  
}

export interface MatchHandlers extends grpc.UntypedServiceImplementation {
  getChance: grpc.handleUnaryCall<_matchPackage_Personalities__Output, _matchPackage_Reply>;
  
}

export interface MatchDefinition extends grpc.ServiceDefinition {
  getChance: MethodDefinition<_matchPackage_Personalities, _matchPackage_Reply, _matchPackage_Personalities__Output, _matchPackage_Reply__Output>
}
