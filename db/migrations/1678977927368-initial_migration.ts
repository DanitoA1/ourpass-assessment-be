import { categorySeeds, postSeeds, userSeeds } from 'db/seeds';
import { User } from 'src/users/entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Category } from 'src/categories/entities/category.entity';
import { Post } from 'src/posts/entities/post.entity';

export class initialMigration1678977927368 implements MigrationInterface {
  name = 'initialMigration1678977927368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user-tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_a0940c7c76bf141bfadf063a98\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_168bf21b341e2ae340748e2541d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user-tokens\` ADD CONSTRAINT \`FK_a0940c7c76bf141bfadf063a98e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const users = userSeeds;
    const categories = categorySeeds;
    const posts = postSeeds;
    const createdUsers = [];
    const createdCategories = [];
    for (const user of users) {
      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(user.password, salt);
      user.password = passHash;
      const createdUser = queryRunner.manager.create<User>(User, {
        ...user,
      });
      await queryRunner.manager.save(createdUser);
      createdUsers.push(createdUser);
    }

    for (const category of categories) {
      const createdCategory = queryRunner.manager.create<Category>(Category, {
        ...category,
      });
      await queryRunner.manager.save(createdCategory);
      createdCategories.push(createdCategory);
    }

    for (const post of posts) {
      const createdPost = queryRunner.manager.create<Post>(Post, {
        ...post,
        category: createdCategories[0],
        user: createdUsers[0],
      });
      await queryRunner.manager.save(createdPost);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user-tokens\` DROP FOREIGN KEY \`FK_a0940c7c76bf141bfadf063a98e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_168bf21b341e2ae340748e2541d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a0940c7c76bf141bfadf063a98\` ON \`user-tokens\``,
    );
    await queryRunner.query(`DROP TABLE \`user-tokens\``);
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(`DROP TABLE \`posts\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
