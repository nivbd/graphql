const queries = {
  me: (parent, args, { me }) => me,
  user: (parent, { id }, { models }) => models.users[id],
  users: (parent, args, { models }) => Object.values(models.users),
}

const userResolver = {
  Query: queries,
  User: {
    username: (user, args, context) => user.user_name,
    messages: (user, args, { models }) => {
      console.log('user ? ', user);
      return Object.values(models.messages).filter(
        message => message.userId === user.id,
      );
    }
  },
};

module.exports = userResolver;
