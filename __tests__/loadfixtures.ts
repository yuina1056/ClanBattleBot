import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import dataSource from '../src/datasource';

export const loadFixtures = async (fixturesPath: string) => {

  try {
    await dataSource.initialize();
    await dataSource.synchronize(true);

    const loader = new Loader();
    loader.load(path.resolve(fixturesPath));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(dataSource, new Parser(), false);

    for (const fixture of fixturesIterator(fixtures)) {
      const entity: any = await builder.build(fixture);
      await dataSource.getRepository(fixture.entity).save(entity);
    }
  } catch (err) {
    throw err;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
    }
  }
};