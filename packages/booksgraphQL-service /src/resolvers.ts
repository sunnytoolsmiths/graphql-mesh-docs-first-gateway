const resolvers = {
    Query: {
        // returns an array of Tracks that will be used to populate the homepage grid of our web client
        books: (_, __, { dataSources }) => {
            return dataSources.booksAPI.getMostViewedBooks();
         },
        
        book: (_, { id }, { dataSources }) => {
            return dataSources.booksAPI.getBook(id);
         },
    }
};

module.exports = resolvers;
