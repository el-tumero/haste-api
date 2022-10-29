# Commands  

- mongod --config /usr/local/etc/mongod.conf

- remember to specify allowed origins in cors config in index.ts

- create .env file

- generate proto files: yarn proto-loader-gen-types --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=src/types/proto src/proto/*.proto
