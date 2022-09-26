import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { MatchClient as _matchPackage_MatchClient, MatchDefinition as _matchPackage_MatchDefinition } from './matchPackage/Match';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  matchPackage: {
    Match: SubtypeConstructor<typeof grpc.Client, _matchPackage_MatchClient> & { service: _matchPackage_MatchDefinition }
    Personalities: MessageTypeDefinition
    Reply: MessageTypeDefinition
  }
}

