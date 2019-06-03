const { gql } = require ('apollo-server-express');

const messageSchema = gql`
  extend type Query {
    messages: [Message!]!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }
  type Message {
    id: ID!
    text: String!
    user: User!
  }
  extend type Subscription {
    messageCreated: MessageCreated!
  }
  type MessageCreated {
    message: Message!
  }
`;

module.exports = messageSchema;
