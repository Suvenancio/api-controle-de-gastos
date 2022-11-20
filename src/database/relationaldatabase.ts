import { EntityManager, getManager } from 'typeorm'

export class RelationalDatabaseRepository {
  async transaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>
  ): Promise<T> {
    return await getManager().transaction(runInTransaction)
  }
}
