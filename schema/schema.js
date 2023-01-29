const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const Movies = require("../models/movie");
const Directors = require("../models/director");

// const directorsJson = [
//   { name: "Quentin Tarantino", age: 55 }, {"_id":{"$oid":"63adb1952304a95856958104"}}
//   { name: "Michael Radford", age: 72 }, {"_id":{"$oid":"63adb5ee2304a95856958109"}}
//   { name: "Andrei Kurka", age: 40 }, {"_id":{"$oid":"63adb6782304a9585695810b"}}
//   { name: "Guy Ritchie", age: 50 }, {"_id":{"$oid":"63adb72c2304a9585695810d"}}
// ];

// const moviesJson = [
//   { name: "Pulp Fiction", genre: "Crime", directorId: "63adb1952304a95856958104"},
//   { name: "1984", genre: "Sci-Fi", directorId: "63adb5ee2304a95856958109"},
//   { name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "63adb6782304a9585695810b"},
//   { name: "Snatch", genre: "Crime-Comedy", directorId: "63adb72c2304a9585695810d"},
//   { name: "Reservior Dogs", genre: "Crime", directorId: "63adb1952304a95856958104"},
//   { name: "The Hateful Eight", genre: "Crime", directorId: "63adb1952304a95856958104"},
//   { name: "Inglourious Basterds", genre: "Crime", directorId: "63adb6782304a9585695810b"},
//   { name: "Lock, Stock and Two Smoking Barrels", genre: "Crime-Comedy", directorId: "63adb72c2304a9585695810d"},
// ];

// const movies = [
//   { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: "1" },
//   { id: "2", name: "1984", genre: "Sci-Fi", directorId: "2" },
//   { id: "3", name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
//   { id: "4", name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
//   { id: "5", name: "Reservior Dogs", genre: "Crime", directorId: "1" },
//   { id: "6", name: "The Hateful Eight", genre: "Crime", directorId: "1" },
//   { id: "7", name: "Inglourious Basterds", genre: "Crime", directorId: "3" },
//   {
//     id: "8",
//     name: "Lock, Stock and Two Smoking Barrels",
//     genre: "Crime-Comedy",
//     directorId: "4",
//   },
// ];

// const directors = [
//   { id: "1", name: "Quentin Tarantino", age: 55 },
//   { id: "2", name: "Michael Radford", age: 72 },
//   { id: "3", name: "Andrei Kurka", age: 40 },
//   { id: "4", name: "Guy Ritchie", age: 50 },
// ];

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    rate: { type: GraphQLInt },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // return directors.find((director) => director.id == parent.id);
        return Directors.findById(parent.directorId);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies.filter((movie) => movie.directorId === parent.id);
        return Movies.find({ directorId: parent.id });
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
          rate: args.rate,
          watched: args.watched,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findByIdAndRemove(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findByIdAndRemove(args.id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args) {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorId: args.directorId,
              rate: args.rate,
              watched: args.watched,
            },
          },
          { new: true }
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return movies.find((movie) => movie.id == args.id);
        return Movies.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return directors.find((director) => director.id == args.id);
        return Directors.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies;
        return Movies.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        // return directors;
        return Directors.find({});
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
