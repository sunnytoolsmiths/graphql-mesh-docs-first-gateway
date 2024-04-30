import { RESTDataSource } from '@apollo/datasource-rest';
import { createSchema, createYoga } from 'graphql-yoga';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { buildSubgraphSchema } from '@apollo/subgraph'; 
import { gql } from 'graphql-tag'; 

// const schema = gql(readFileSync('schema.graphql', 'utf-8'));
const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));


const bookSells = [
  {
    bookId: '0',
    sellsCount: 1932,
    monthYear: '03/22',
    __typename: 'Sells',
    storeId: '0'
  },
  {
    bookId: '1',
    sellsCount: 192,
    monthYear: '03/22',
    __typename: 'Sells',
    storeId: '0'
  },
  {
    bookId: '0',
    sellsCount: 2387,
    monthYear: '03/22',
    __typename: 'Sells',
    storeId: '1'
  },
  {
    bookId: '1',
    sellsCount: 283,
    monthYear: '03/22',
    __typename: 'Sells',
    storeId: '1'
  },
];
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
    return []; //data.results;
  }
}

const dataSources = {booksAPI: new BooksAPI(),}
const resolvers = {
  Query: {
    //bookSells: (_p, args) => bookSells.filter(bs => bs.storeId === args.storeId),
    books: () => {
      return dataSources.booksAPI.getMostViewedBooks();
   },
  },
};

// Create your server
const yoga = createYoga({ 
  schema: buildSubgraphSchema ({ typeDefs, resolvers, }) 
  // schema: createSchema({
  //   typeDefs: schema,
  //   resolvers,
  // }),
});

const server = createServer(yoga, )

server.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000${yoga.graphqlEndpoint}`);
});
