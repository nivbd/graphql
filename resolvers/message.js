import pubsub, { EVENTS } from '../subscription';
const uuidv4 = require('uuid/v4');

const queries = {
  messages: (parent, args, { models }) => Object.values(models.messages),
  message: (parent, { id }, { models }) => models.messages[id],
}

const messageResolvers = {
  Query: queries,
  Message: {
    user: (message, args, { models }) => {
      console.log('message ? ', message);
      return models.users[message.userId];
    }
  },
  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      models.messages[id] = message;
      models.users[me.id].messageIds.push(id);

      console.log('message created ? ', message);
      pubsub.publish(EVENTS.MESSAGE.CREATED, {
        messageCreated: { message },
      });

      return message;
    },
    deleteMessage: ( parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages;
      if (!message) {
        return false;
      }

      models.messages = otherMessages;
      return true;
    }
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};

module.exports = messageResolvers;
