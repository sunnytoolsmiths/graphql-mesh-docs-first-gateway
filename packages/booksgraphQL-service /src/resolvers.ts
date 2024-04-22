const resolvers = {
    Query: {
        // returns an array of Tracks that will be used to populate the homepage grid of our web client
        books: (_, __, { dataSources }) => {
            return dataSources.booksAPI.getMostViewedBooks();
         },
    }
};

module.exports = resolvers;
