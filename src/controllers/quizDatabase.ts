import { NextFunction, Request, Response } from 'express';
import { PrismaClient as PrismaClientApp } from '../../prisma/generated/client-quiz';

const prisma = new PrismaClientApp();

const createQuizDatabase = async (req: Request, res: Response, next: NextFunction) => {
  const { file } = req;

  if (file?.mimetype === 'application/sql') {
    const sqls = file.buffer
      .toString('utf-8')
      .split('\n')
      .filter((line) => line.indexOf('--') !== 0)
      .join('\n')
      .replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/\s+/g, ' ')
      .split(';');

    const clearTables = `
      DO $$
        DECLARE 
            r record;
        BEGIN
            FOR r IN SELECT quote_ident(tablename) AS tablename, quote_ident(schemaname) AS schemaname FROM pg_tables WHERE schemaname = 'public'
            LOOP
                RAISE INFO 'Dropping table %.%', r.schemaname, r.tablename;
                EXECUTE format('DROP TABLE IF EXISTS %I.%I CASCADE', r.schemaname, r.tablename);
            END LOOP;
      END$$;
    `;

    return await prisma
      .$executeRawUnsafe(clearTables)
      .then(async () => {
        for (const sql of sqls) {
          await prisma.$executeRawUnsafe(sql).catch((err) => next(err));
        }
      })
      .then(() => res.status(200).send({ message: 'Baza została dodana' }))
      .catch((err) => next(err));
  }
};

export const quizDatabaseController = {
  createQuizDatabase,
};
