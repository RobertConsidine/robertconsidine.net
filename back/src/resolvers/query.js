const { assertAdminUser } = require("../utils");

async function publishedArticles(root, args, context, info) {
  let where = {
    draft: false
  };

  if (args.filter) {
    where.OR = [
      { title_contains: args.filter },
      { summary_contains: args.filter },
    ];
  };

  return await context.prisma.articles({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: 'publishedAt_DESC'
  });
}

async function allArticles(root, args, context, info) {
  return await context.prisma.articles({
    skip: args.skip,
    first: args.first,
    orderBy: 'createdAt_DESC'
  });
}

async function article(root, args, context, info) {
  let article = await context.prisma.article({
    id: args.id
  });

  if (article.draft) {
    await assertAdminUser(context);
  }

  return article;
}

async function comments(root, args, context, info) {
  return await context.prisma.comments({
    skip: args.skip,
    first: args.first,
  });
}

async function page(root, args, context, info) {
  return await context.prisma.page({
    name: args.name
  });
}

async function pages(root, args, context, info) {
  return await context.prisma.pages();
}

async function files(root, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.files({
    where: {
      OR: [
        {
          page: {
            id: args.documentId
          },
        },
        {
          article: {
            id: args.documentId
          }
        }
      ]
    }
  });
}

async function users(root, args, context, info) {
  await assertAdminUser(context);

  return await context.prisma.users({
    skip: args.skip,
    first: args.first
  });
}

module.exports = {
  publishedArticles,
  allArticles,
  article,
  comments,
  page,
  pages,
  files,
  users
};
