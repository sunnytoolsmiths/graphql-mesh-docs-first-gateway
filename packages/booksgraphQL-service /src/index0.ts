import { RESTDataSource } from '@apollo/datasource-rest';
import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildSubgraphSchema } from '@apollo/subgraph'; 
import { gql } from 'graphql-tag'; 

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

//const typeDefs = require('./schema.graphql');
const resolvers = require('./resolvers');

// const schema = gql(readFileSync('schema.graphql', 'utf-8'));
const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));

class Book {}
class BooksAPI extends RESTDataSource {
  override baseURL = 'http://localhost:3002';

  async getBook(id: string) {
    return this.get(`books/${encodeURIComponent(id)}`);
  }

  async getMostViewedBooks(limit = '10'){//: Promise<Book[]> {
    const data = await this.get('books', {
      params: {
        //per_page: limit.toString(), // all params entries should be strings,
        //order_by: 'most_viewed',
      },
    });
    return data.results;
  }
}

//highlight-start
interface ContextValue {
  dataSources: {
    booksAPI: BooksAPI;
    // personalizationAPI: PersonalizationAPI;
  };
}
//highlight-end

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
async function startApolloServer() {
const { url } = await startStandaloneServer(server, {
  context: async () => {
    const { cache } = server;
    return {
      // We create new instances of our data sources with each request,
      // passing in our server's cache.
      //highlight-start
      dataSources: {
        booksAPI: new BooksAPI({ cache }),
        //personalizationAPI: new PersonalizationAPI({ cache }),
      },
      //highlight-end
    };
  },
});

console.log(`🚀  Server ready at ${url}`);
}

startApolloServer();