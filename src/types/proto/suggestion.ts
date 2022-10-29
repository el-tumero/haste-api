import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { SuggestionClient as _suggestionPackage_SuggestionClient, SuggestionDefinition as _suggestionPackage_SuggestionDefinition } from './suggestionPackage/Suggestion';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  suggestionPackage: {
    Personalities: MessageTypeDefinition
    Reply: MessageTypeDefinition
    Suggestion: SubtypeConstructor<typeof grpc.Client, _suggestionPackage_SuggestionClient> & { service: _suggestionPackage_SuggestionDefinition }
  }
}

