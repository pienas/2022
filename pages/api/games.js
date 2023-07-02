import { getGames } from '@/lib/db-admin';

export default async (_, res) => {
  try {
    const { results } = await getGames();
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error });
  }
};
